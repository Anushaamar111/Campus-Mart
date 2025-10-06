import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import CreateProduct from './pages/CreateProduct'
import EditProduct from './pages/EditProduct'
import Profile from './pages/Profile'
import MyProducts from './pages/MyProducts'
import InterestedUsers from './pages/InterestedUsers'
import Wishlist from './pages/Wishlist'
import Notifications from './pages/Notifications'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return user ? children : <Navigate to="/login" />
}

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return !user ? children : <Navigate to="/" />
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
          <Route path="/create-product" element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          } />
          <Route path="/edit-product/:id" element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/my-products" element={
            <ProtectedRoute>
              <MyProducts />
            </ProtectedRoute>
          } />
          <Route path="/products/:productId/interested-users" element={
            <ProtectedRoute>
              <InterestedUsers />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App