# CampusConnect - Hyper-Local Campus Marketplace

A MERN stack peer-to-peer marketplace with **strict campus isolation** ("silo" architecture), where students can buy and sell items exclusively within their university using verified .edu email addresses.

## ✅ Completed Functionalities

### Backend Features
- ✅ **User Authentication** - Register/Login with educational email validation
- ✅ **Campus Silo System** - Automatic college assignment from email domain
- ✅ **Product Management** - Full CRUD operations with campus filtering
- ✅ **Real-Time Bidding** - Socket.io powered live bid updates
- ✅ **Bid Management** - Place, view, accept/reject bids
- ✅ **Analytics Dashboard** - Seller metrics and insights
- ✅ **Saved Items** - User can bookmark products
- ✅ **Product Search & Filter** - By category, keyword, status

### Frontend Features
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Buyer/Seller Mode Toggle** - Switch between marketplace and dashboard
- ✅ **Add Product Modal** - Complete form with image URLs
- ✅ **View Bids Modal** - Sellers can see and accept bids
- ✅ **Real-Time Updates** - Live bid notifications
- ✅ **Product Cards** - Image, price, stats display
- ✅ **Analytics Charts** - Recharts for views and categories
- ✅ **Delete Products** - Remove listings
- ✅ **Saved Items** - Bookmark functionality

### Educational Email Support
Now supports multiple educational domain patterns:
- ✅ `.edu` - US universities (e.g., john@stanford.edu)
- ✅ `.ac.in` - Indian colleges (e.g., student@kiit.ac.in)
- ✅ `.ac.uk` - UK universities (e.g., student@oxford.ac.uk)
- ✅ `.edu.in` - Indian educational institutions
- ✅ `.edu.au` - Australian universities

## 🚀 Quick Start

### Core Architecture
- **Automatic Campus Isolation**: Email domain parsing (`@nyu.edu` → auto-assigned to NYU)
- **Silo Middleware**: All database queries filtered by `collegeId` - prevents cross-campus data leakage
- **Domain-Based Authentication**: Only `.edu` emails allowed
- **Real-Time Bidding**: Socket.io powered live bid updates

### User Features
- **Buyer/Seller Mode Toggle**: Context-based UI switching
- **Soft Auction System**: Sellers accept bids, triggering buyer-seller chat
- **Analytics Dashboard**: Views, conversion rates, bid tracking (Recharts)
- **Saved Items & Bid Tracking**: Personalized collections

## 🛠️ Tech Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Socket.io-client
- React Router DOM
- Recharts (Analytics)

**Backend:**
- Node.js + Express.js
- MongoDB (Mongoose)
- Socket.io (Real-time)
- JWT Authentication
- bcryptjs (Password hashing)

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone and Install**
   ```bash
   cd campus-mart
   npm install
   cd client
   npm install
   cd ..
   ```

2. **Environment Configuration**
   
   The `.env` file is already configured with:
   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=a1042c55a221a94b72b04dd02528d37d
   PORT=5000
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Start Development Servers**

   **Option 1: Run both servers simultaneously**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 🏗️ Project Structure

```
campus-mart/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── College.js           # Auto-created from email domain
│   │   ├── User.js              # collegeId assignment
│   │   ├── Product.js           # College-filtered listings
│   │   └── Bid.js               # Bidding system
│   ├── middleware/
│   │   └── auth.js              # JWT + SILO middleware
│   ├── routes/
│   │   ├── auth.js              # Register/Login with domain parsing
│   │   ├── products.js          # Campus-filtered CRUD
│   │   ├── bids.js              # Bidding logic
│   │   ├── analytics.js         # Seller dashboard stats
│   │   └── user.js              # Profile & saved items
│   ├── socket/
│   │   └── handlers.js          # Real-time bid events
│   ├── utils/
│   │   ├── jwt.js
│   │   └── helpers.js           # Domain extraction
│   └── index.js                 # Server entry point
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Mode toggle UI
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx     # .edu validation
│   │   │   ├── Dashboard.jsx    # Buyer marketplace
│   │   │   ├── ProductDetail.jsx # Real-time bidding
│   │   │   ├── SellerDashboard.jsx # Analytics + listings
│   │   │   ├── SavedItems.jsx
│   │   │   └── MyBids.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # JWT + user state
│   │   │   └── UserModeContext.jsx # Buyer/Seller toggle
│   │   ├── utils/
│   │   │   ├── api.js           # Axios interceptors
│   │   │   └── socket.js        # Socket.io client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .env                         # Environment variables
└── package.json
```

## 🔐 The "Silo" System (Critical Implementation)

### How It Works

1. **Registration Flow:**
   ```
   User registers with john@nyu.edu
   → Backend extracts "nyu.edu"
   → Queries College collection
   → If exists: Assign collegeId
   → If new: Create College entry → Assign collegeId
   → JWT payload: { userId, collegeId, role }
   ```

2. **Request Filtering:**
   ```javascript
   // middleware/auth.js - verifyCampus()
   req.campusFilter = { college: req.collegeId }
   
   // routes/products.js - ALL queries use:
   Product.find({ ...req.campusFilter, status: 'active' })
   ```

3. **Zero Cross-Campus Leakage:**
   - User from NYU can NEVER see products from MIT
   - Enforced at database query level, not UI level
   - collegeId is immutable after registration

## 🚀 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Auto-assigns college from email
- `POST /api/auth/login` - Returns JWT with collegeId

### Products (Campus-Filtered)
- `GET /api/products` - Only returns products from user's college
- `GET /api/products/:id` - Validates college match
- `POST /api/products` - Auto-assigns user's collegeId
- `PUT /api/products/:id` - Seller-only update
- `DELETE /api/products/:id` - Seller-only delete

### Bidding
- `POST /api/bids` - Place bid with real-time broadcast
- `GET /api/bids/product/:id` - Seller views bids
- `POST /api/bids/:id/accept` - Lock bidding, create chat

### Analytics (Seller)
- `GET /api/analytics/seller-dashboard` - Aggregated stats
- `GET /api/analytics/product/:id` - Product-specific insights

## 🎮 Usage Guide

### For Buyers

1. **Register** with your `.edu` email (e.g., `john@stanford.edu`)
2. **Browse** marketplace - see only Stanford products
3. **Search/Filter** by category or keywords
4. **Place Bids** on items with real-time updates
5. **Save Items** for later viewing
6. **Track Bids** in "My Bids" section

### For Sellers

1. **Toggle to Seller Mode** (top navbar)
2. **Add Products** with details, pricing, images
3. **View Analytics:**
   - Total views across all listings
   - Bid conversion rates
   - Views over time (line chart)
   - Category performance (bar chart)
4. **Manage Listings** - view, edit, delete products
5. **Accept Bids** - triggers buyer notification

## 🧪 Testing the Silo System

```bash
# Test 1: Register two users from different domains
POST /api/auth/register
{ "email": "alice@nyu.edu", ... }

POST /api/auth/register
{ "email": "bob@mit.edu", ... }

# Test 2: Create products as both users
# Login as alice@nyu.edu → Create product
# Login as bob@mit.edu → Create product

# Test 3: Verify isolation
# Login as alice → GET /api/products
# Should ONLY see NYU products, not MIT

# Test 4: Attempt direct access
# Login as alice → GET /api/products/{mit-product-id}
# Should return 404 "Product not found"
```

## 🔧 Configuration

### MongoDB Atlas (Already Connected)
The project is pre-configured with a cloud database. To use local MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/campus-connect
```

### Email Verification (Optional)
Currently disabled for faster development. To enable:

1. Add email service credentials to `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

2. In `server/routes/auth.js`, uncomment:
   ```javascript
   sendVerificationEmail(user.email, verificationCode);
   ```

## 📊 Analytics Features

Seller Dashboard includes:
- **Metrics Cards**: Total listings, views, bids, potential earnings
- **Views Over Time**: 7-day line chart
- **Category Breakdown**: Bar chart showing distribution
- **Top Products**: Ranked by views
- **Conversion Rate**: (Bids / Views) × 100

## 🔄 Real-Time Features

### Socket.io Events

**Client → Server:**
- `join_product` - Subscribe to product updates
- `place_bid_optimistic` - Instant UI update

**Server → Client:**
- `bid_update` - New highest bid notification
- `bid_accepted` - Product sold notification

## 🎨 UI Features

- **Responsive Design**: Mobile-first with Tailwind CSS
- **Optimistic Updates**: Instant bid feedback before server confirmation
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Theme Colors**: Purple primary (#5A4FCF) from college theme

## 🐛 Known Limitations

- **Image Upload**: Currently uses URL strings (not file upload)
- **Chat System**: Placeholder (not fully implemented)
- **Safe Trade Zones**: Map feature stubbed out
- **Email Verification**: Disabled by default
- **Search**: Basic implementation (can be enhanced with Algolia/ElasticSearch)

## 🚢 Deployment

### Backend (Heroku/Railway/Render)
```bash
# Ensure production environment variables
MONGODB_URI=<production-db>
JWT_SECRET=<strong-secret>
CLIENT_URL=<frontend-url>
NODE_ENV=production
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
# Set environment variable:
VITE_API_URL=<backend-api-url>
```

## 📝 Resume Highlights

**What Makes This Project Stand Out:**

1. **Multi-Tenant Architecture**: Real-world SaaS pattern with data isolation
2. **Security-First Design**: JWT + middleware-enforced access control
3. **Real-Time Systems**: Socket.io bidding with optimistic UI
4. **Data Analytics**: Aggregation pipelines for business insights
5. **Scalable Schema**: Indexed queries for campus-specific filtering
6. **Production-Ready**: Error handling, validation, RESTful API design

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize!

## 📄 License

MIT License - Free to use for learning and portfolio purposes.

---

Built with ❤️ by [Your Name]
**Contact**: your.email@university.edu
