# CampusConnect - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend Server

```bash
cd server
node index.js
```

You should see:
```
📊 MongoDB Connected: cluster0...
🚀 Server running on port 5000
📡 Socket.io listening for connections
```

### Step 2: Start the Frontend

Open a new terminal:

```bash
cd client
npm run dev
```

You should see:
```
ROLLDOWN-VITE ready in XXXms
➜ Local: http://localhost:5173/
```

### Step 3: Open Your Browser

Navigate to: **http://localhost:5173**

---

## 📝 First Time Setup

### Register a New Account

1. Click **"Create one"** on the login page
2. Enter your details:
   - **First Name**: Your first name
   - **Last Name**: Your last name (optional)
   - **Email**: Your college email (e.g., `student@kiit.ac.in`)
   - **Password**: At least 6 characters
3. Click **"Create Account"**

✅ The system will automatically:
- Extract your college domain (`kiit.ac.in`)
- Create/find your college in the database
- Assign you to that college
- Generate a JWT token with your `collegeId`

---

## 🛍️ Using the Marketplace (Buyer Mode)

### Browse Products
- View all products from your campus
- Use the search bar to find specific items
- Filter by category (Electronics, Books, Furniture, etc.)

### Place a Bid
1. Click on any product card
2. Enter your bid amount (must be higher than current price)
3. Optional: Add a message to the seller
4. Click **"Place Bid"**
5. Watch for real-time updates as others bid!

### Save Items
- Click the ❤️ heart icon on any product
- View saved items from **"Saved"** in the navbar

### Track Your Bids
- Click **"My Bids"** in navbar
- See all your bidding activity
- Check bid status: Pending, Accepted, or Rejected

---

## 🏪 Selling Items (Seller Mode)

### Switch to Seller Mode
Click **"Switch to Seller"** button in the top navbar

### Add a Product
1. Click **"+ Add Product"** button
2. Fill in the form:
   - **Title**: Product name
   - **Category**: Select from dropdown
   - **Condition**: New, Like New, Good, Fair, Poor
   - **Starting Price**: Minimum bid amount
   - **Description**: Details about the item
   - **Images**: Paste image URLs and click "Add"
3. Click **"Create Listing"**

### View Analytics
Your seller dashboard shows:
- 📦 Total Listings
- 👁️ Total Views
- 🔨 Total Bids
- 💰 Potential Earnings
- 📈 Views over time (chart)
- 📊 Category breakdown (chart)

### Manage Bids
1. Click **"Bids (X)"** next to any product in your listings
2. View all bids with bidder details
3. Click **"Accept"** to accept a bid
   - This locks the product
   - Changes status to "bidding_locked"
   - Notifies the buyer (future: opens chat)

### Delete a Product
Click the 🗑️ trash icon next to any product

---

## 🎮 Key Features to Test

### 1. The Silo System (Most Important!)

**Test Cross-Campus Isolation:**

1. **Create User A** with email: `alice@college1.ac.in`
2. **Create Product** as Alice
3. **Logout** and **Create User B** with: `bob@college2.ac.in`
4. **Try to view** the marketplace

**Expected Result:** Bob should NOT see Alice's product because they're from different colleges!

### 2. Real-Time Bidding

**Test Live Updates:**

1. Open product detail page in **two browser windows**
2. Place a bid in **Window 1**
3. Watch **Window 2** update instantly!

### 3. Buyer/Seller Toggle

- Switch modes and see completely different UIs
- Buyer: Marketplace with search/filter
- Seller: Analytics dashboard with charts

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `MongoDB Connection Error`

**Fix:**
```bash
# Check .env file exists in root
ls .env

# Verify MONGODB_URI is set
cat .env | grep MONGODB_URI
```

### Frontend Won't Load

**Error:** Tailwind classes not working

**Fix:**
```bash
cd client
npm install -D tailwindcss@3.4.17 postcss autoprefixer
```

### Can't Register

**Error:** "Please use your university email"

**Solution:** Use an educational email ending in:
- `.edu`
- `.ac.in`
- `.ac.uk`
- `.edu.in`
- `.edu.au`

---

## 📋 Sample Test Data

### Test Users
```
User 1:
- Email: john@stanford.edu
- Password: password123
- College: Stanford University

User 2:
- Email: priya@kiit.ac.in
- Password: password123
- College: Kiit University

User 3:
- Email: mike@oxford.ac.uk
- Password: password123
- College: Oxford University
```

### Sample Products
```
Product 1:
- Title: iPhone 13 Pro
- Category: Electronics
- Price: $800
- Condition: Like New

Product 2:
- Title: Calculus Textbook
- Category: Books
- Price: $45
- Condition: Good

Product 3:
- Title: Study Desk
- Category: Furniture
- Price: $120
- Condition: Fair
```

---

## 🎯 Testing Checklist

- [ ] Register with college email
- [ ] Auto-assigned to correct college
- [ ] Browse campus-specific products
- [ ] Search and filter products
- [ ] Place bids on items
- [ ] Save items to favorites
- [ ] Switch to seller mode
- [ ] Add new product listing
- [ ] View seller analytics
- [ ] Receive bids on your products
- [ ] Accept a bid
- [ ] Delete a product
- [ ] Real-time bid updates work
- [ ] Cross-campus isolation verified

---

## 💡 Tips

1. **Use Real Image URLs**: Paste working URLs (e.g., from Imgur, Cloudinary)
2. **Descriptive Titles**: Help buyers find your items
3. **Competitive Pricing**: Set reasonable starting prices
4. **Quick Responses**: Accept bids promptly to keep buyers engaged
5. **Multiple Browsers**: Test real-time features across sessions

---

## 📞 Support

If you encounter issues:

1. Check terminal for error messages
2. Verify MongoDB connection is active
3. Ensure ports 5000 and 5173 are available
4. Clear browser cache and localStorage
5. Restart both servers

---

## 🎉 You're Ready!

Start buying and selling on your campus marketplace! 🚀

**Pro Tip:** Open two browser sessions (one in incognito) to test buyer and seller interactions simultaneously.
