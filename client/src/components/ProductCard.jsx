import { Heart, Eye, Gavel, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProductCard = ({ product, onClick, onSaveToggle }) => {
  const { user, refreshUser } = useAuth();
  // Derive saved state directly from user data instead of using effect
  const initialSavedState = user?.savedItems?.includes(product._id) || false;
  const [isSaved, setIsSaved] = useState(initialSavedState);

  // Update when user's savedItems change
  useEffect(() => {
    const isCurrentlySaved = user?.savedItems?.includes(product._id) || false;
    if (isCurrentlySaved !== isSaved) {
      queueMicrotask(() => setIsSaved(isCurrentlySaved));
    }
  }, [user?.savedItems, product._id, isSaved]);

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await api.post(`/user/saved/${product._id}`);
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      
      // Refresh user data to get updated savedItems
      if (refreshUser) {
        await refreshUser();
      }
      
      // Notify parent component to refresh if callback provided
      if (onSaveToggle) {
        onSaveToggle(product._id, newSavedState);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const getStatusBadge = () => {
    switch (product.status) {
      case 'active':
        return <span className="badge-success">Active</span>;
      case 'bidding_locked':
        return <span className="badge-warning">Bidding Closed</span>;
      case 'sold':
        return <span className="badge-danger">Sold</span>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer group relative overflow-hidden animate-fadeIn"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag className="w-16 h-16" />
          </div>
        )}
        
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description || 'No description available'}
        </p>

        {/* Price */}
        <div className="mb-3">
          <p className="text-sm text-gray-500">
            {product.highestBid > 0 ? 'Current Bid' : 'Starting Price'}
          </p>
          <p className="text-xl font-bold text-gray-900">
            ₹{(product.highestBid > 0 ? product.highestBid : product.basePrice).toFixed(2)}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{product.views || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gavel className="w-4 h-4" />
            <span>{product.bidCount || 0} bids</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500">
            Seller: <span className="font-medium text-gray-700">
              {product.seller?.firstName || 'Unknown'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
