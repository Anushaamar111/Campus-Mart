import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HeartIcon, SparklesIcon, FolderIcon, ArrowDownTrayIcon, ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Wishlist Components
import WishlistKeyword from '../components/wishlist/WishlistKeyword';
import WishlistMatches from '../components/wishlist/WishlistMatches';
import SmartSuggestions from '../components/wishlist/SmartSuggestions';
import MatchHistory from '../components/wishlist/MatchHistory';
import CategoryOrganization from '../components/wishlist/CategoryOrganization';
import ExportWishlist from '../components/wishlist/ExportWishlist';

// API Services
import { 
  getWishlist, 
  addWishlistKeyword, 
  removeWishlistKeyword, 
  updateWishlistKeyword,
  clearWishlist 
} from '../services/wishlistAPI';

const Wishlist = () => {
  const [wishlistKeywords, setWishlistKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('keywords');

  const tabs = [
    { id: 'keywords', label: 'Keywords', icon: HeartIcon },
    { id: 'matches', label: 'Matches', icon: SparklesIcon },
    { id: 'suggestions', label: 'Suggestions', icon: SparklesIcon },
    { id: 'history', label: 'History', icon: ClockIcon },
    { id: 'categories', label: 'Categories', icon: FolderIcon },
    { id: 'export', label: 'Export', icon: ArrowDownTrayIcon }
  ];

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlistKeywords(data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (keywordData) => {
    try {
      const newKeyword = await addWishlistKeyword(keywordData);
      setWishlistKeywords(prev => [newKeyword, ...prev]);
      toast.success('Keyword added to wishlist');
      return newKeyword;
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast.error('Failed to add keyword');
      throw error;
    }
  };

  const handleUpdateKeyword = async (keywordId, updates) => {
    try {
      const updatedKeyword = await updateWishlistKeyword(keywordId, updates);
      setWishlistKeywords(prev => 
        prev.map(keyword => 
          keyword._id === keywordId ? updatedKeyword : keyword
        )
      );
      toast.success('Keyword updated');
      return updatedKeyword;
    } catch (error) {
      console.error('Error updating keyword:', error);
      toast.error('Failed to update keyword');
      throw error;
    }
  };

  const handleDeleteKeyword = async (keywordId) => {
    try {
      await removeWishlistKeyword(keywordId);
      setWishlistKeywords(prev => prev.filter(keyword => keyword._id !== keywordId));
      toast.success('Keyword removed from wishlist');
    } catch (error) {
      console.error('Error removing keyword:', error);
      toast.error('Failed to remove keyword');
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
      setWishlistKeywords([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>My Wishlist - CampusMart</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'keywords':
        return (
          <WishlistKeyword
            wishlistKeywords={wishlistKeywords}
            onAddKeyword={handleAddKeyword}
            onUpdateKeyword={handleUpdateKeyword}
            onDeleteKeyword={handleDeleteKeyword}
            onClearWishlist={handleClearWishlist}
          />
        );
      case 'matches':
        return <WishlistMatches />;
      case 'suggestions':
        return <SmartSuggestions onAddKeyword={handleAddKeyword} />;
      case 'history':
        return <MatchHistory />;
      case 'categories':
        return (
          <CategoryOrganization
            wishlistKeywords={wishlistKeywords}
            onUpdateKeyword={handleUpdateKeyword}
            onDeleteKeyword={handleDeleteKeyword}
          />
        );
      case 'export':
        return <ExportWishlist wishlistKeywords={wishlistKeywords} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist - CampusMart</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <HeartIcon className="h-8 w-8 text-purple-500" />
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your wishlist keywords, discover matches, and never miss out on the items you want. 
              Get notified when products matching your interests become available.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                        ${activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>

          {/* Quick Stats */}
          {wishlistKeywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {wishlistKeywords.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Keywords</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {wishlistKeywords.filter(k => k.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {[...new Set(wishlistKeywords.map(k => k.category || 'Uncategorized'))].length}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {wishlistKeywords.filter(k => k.priority === 'high').length}
                  </div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;