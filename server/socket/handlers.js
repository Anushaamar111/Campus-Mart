/**
 * Socket.io Event Handlers
 * Handles real-time bidding and chat
 */

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    /**
     * Join a product room to receive real-time updates
     */
    socket.on('join_product', (productId) => {
      socket.join(`product_${productId}`);
      console.log(`📦 Socket ${socket.id} joined product_${productId}`);
    });

    /**
     * Leave a product room
     */
    socket.on('leave_product', (productId) => {
      socket.leave(`product_${productId}`);
      console.log(`📦 Socket ${socket.id} left product_${productId}`);
    });

    /**
     * Place a bid (optimistic UI support)
     * The actual bid validation happens in the API route
     * This just broadcasts the optimistic update
     */
    socket.on('place_bid_optimistic', ({ productId, amount, userId, userName }) => {
      // Broadcast to all clients viewing this product
      socket.to(`product_${productId}`).emit('bid_update_optimistic', {
        productId,
        amount,
        userId,
        userName,
        timestamp: new Date()
      });
    });

    /**
     * Join a chat room (for buyer-seller communication)
     */
    socket.on('join_chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`💬 Socket ${socket.id} joined chat_${chatId}`);
    });

    /**
     * Leave a chat room
     */
    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
      console.log(`💬 Socket ${socket.id} left chat_${chatId}`);
    });

    /**
     * Send a chat message
     */
    socket.on('send_message', ({ chatId, message, senderId, senderName }) => {
      io.to(`chat_${chatId}`).emit('new_message', {
        chatId,
        message,
        senderId,
        senderName,
        timestamp: new Date()
      });
    });

    /**
     * Typing indicator
     */
    socket.on('typing', ({ chatId, userName }) => {
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userName
      });
    });

    socket.on('stop_typing', ({ chatId }) => {
      socket.to(`chat_${chatId}`).emit('user_stop_typing');
    });

    /**
     * Disconnect
     */
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
