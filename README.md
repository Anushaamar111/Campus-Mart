# CampusMart - College Student Marketplace

🎓 **CampusMart** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for college students to buy and sell used items at affordable prices.

## 🚀 Features

### 👩‍🎓 User Features
- ✅ User registration and JWT-based authentication
- ✅ Create, edit, and delete product listings
- ✅ Upload item images with Cloudinary integration
- ✅ Smart wishlist with keyword matching
- ✅ Real-time notifications (in-app and email)
- ✅ Advanced search and filtering
- ✅ User profiles and contact information
- ✅ Responsive design with Tailwind CSS

### 🧠 Smart Matching System
- ✅ Automatic wishlist matching when new products are listed
- ✅ Email notifications for wishlist matches
- ✅ Real-time Socket.io notifications

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| **Frontend** | React.js, Tailwind CSS, Vite | Modern, responsive UI |
| **Backend** | Node.js, Express.js | RESTful API server |
| **Database** | MongoDB, Mongoose | Data persistence |
| **Authentication** | JWT | Secure user sessions |
| **Real-time** | Socket.io | Live notifications |
| **Email** | Nodemailer | Email notifications |
| **Images** | Cloudinary | Image storage & optimization |
| **Deployment** | Ready for Vercel/Netlify/Render | Production deployment |

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd peer-mart

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/campusmart

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Run the Application

```bash
# Terminal 1: Start the backend server
cd backend
npm run dev

# Terminal 2: Start the frontend development server
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
peer-mart/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database & external service configs
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
├── frontend/               # React.js application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   └── index.html         # Main HTML template
└── README.md
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  college: String,
  year: String,
  phone: String,
  wishlist: [String],
  notifications: [{
    message: String,
    productId: ObjectId,
    isRead: Boolean,
    createdAt: Date
  }],
  emailNotifications: Boolean
}
```

### Product Schema
```javascript
{
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  condition: String,
  images: [{
    url: String,
    publicId: String
  }],
  seller: ObjectId (User),
  location: String,
  tags: [String],
  isAvailable: Boolean,
  views: Number,
  interestedUsers: [{
    user: ObjectId,
    contactedAt: Date
  }]
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/interest` - Express interest

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add keyword to wishlist
- `DELETE /api/wishlist/remove` - Remove keyword from wishlist

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## 🎨 Frontend Features

### Components
- **Responsive Navbar** with user authentication
- **Product Cards** with image carousel
- **Search & Filter** functionality
- **Real-time Notifications** with toast messages
- **Form Handling** with React Hook Form
- **Image Upload** with drag & drop support

### Pages
- **Home** - Landing page with featured products
- **Products** - Product listing with search/filter
- **Product Detail** - Individual product view
- **Create/Edit Product** - Product management
- **Profile** - User profile management
- **Wishlist** - Manage wishlist keywords
- **Notifications** - View and manage notifications

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ File upload restrictions

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tailwind CSS utility classes
- ✅ Responsive navigation
- ✅ Touch-friendly interface
- ✅ Optimized images

## 🚀 Deployment

### Backend (Render/Railway)
1. Create account on Render/Railway
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables
4. Configure redirects for SPA

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster and database
3. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@campusmart.com or create an issue on GitHub.

---

**Made with ❤️ for students by students**