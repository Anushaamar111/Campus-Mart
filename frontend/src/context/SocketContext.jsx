import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'
      const newSocket = io(baseUrl, {
        withCredentials: true,
      })

      newSocket.on('connect', () => {
        setIsConnected(true)
        console.log('Connected to server')
        
        // Join user's room for personalized notifications
        newSocket.emit('join', user.id)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
        console.log('Disconnected from server')
      })

      // Listen for wishlist match notifications
      newSocket.on('wishlistMatch', (data) => {
        toast.success(
          <div>
            <strong>Wishlist Match! 🎯</strong>
            <br />
            {data.message}
          </div>,
          {
            duration: 6000,
            icon: '🔔',
          }
        )
      })

      // Listen for general notifications
      newSocket.on('notification', (data) => {
        toast.info(data.message, {
          duration: 4000,
          icon: '📢',
        })
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
        setSocket(null)
        setIsConnected(false)
      }
    } else {
      // Close socket if user logs out
      if (socket) {
        socket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user])

  const emitEvent = (eventName, data) => {
    if (socket && isConnected) {
      socket.emit(eventName, data)
    }
  }

  const value = {
    socket,
    isConnected,
    emitEvent
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}