import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: {
        name: 'CampusMart',
        address: process.env.EMAIL_USER
      },
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendWishlistNotification = async (userEmail, userName, productTitle, productPrice) => {
  const subject = '🎯 Wishlist Match Found - CampusMart';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎓 CampusMart</h1>
        <p style="color: white; margin: 5px 0;">Your Campus Marketplace</p>
      </div>
      
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Hi ${userName}! 👋</h2>
        <p style="color: #666; font-size: 16px;">Great news! We found a product that matches your wishlist:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">${productTitle}</h3>
          <p style="color: #e74c3c; font-size: 24px; font-weight: bold; margin: 10px 0;">₹${productPrice}</p>
        </div>
        
        <p style="color: #666;">Don't wait too long - good deals go fast on campus! 🏃‍♀️💨</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    text-decoration: none; 
                    padding: 12px 30px; 
                    border-radius: 25px; 
                    display: inline-block;
                    font-weight: bold;">
            View Product 🔍
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>You received this email because you have wishlist notifications enabled.</p>
        <p>© 2024 CampusMart - Made with ❤️ for students</p>
      </div>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = '🎉 Welcome to CampusMart!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎓 Welcome to CampusMart!</h1>
      </div>
      
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Hi ${userName}! 👋</h2>
        <p style="color: #666; font-size: 16px;">Welcome to your campus marketplace! Here's what you can do:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul style="color: #666; line-height: 1.8;">
            <li>📚 Buy textbooks and study materials from seniors</li>
            <li>💻 Find affordable electronics and gadgets</li>
            <li>🏠 Get hostel essentials at great prices</li>
            <li>🎯 Create wishlists and get notified of matches</li>
            <li>💰 Sell your unused items to juniors</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    text-decoration: none; 
                    padding: 12px 30px; 
                    border-radius: 25px; 
                    display: inline-block;
                    font-weight: bold;">
            Start Shopping 🛍️
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© 2024 CampusMart - Made with ❤️ for students</p>
      </div>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, html);
};

export {
  sendEmail,
  sendWishlistNotification,
  sendWelcomeEmail
};