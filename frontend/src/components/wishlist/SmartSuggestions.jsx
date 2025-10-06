import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  PlusIcon,
  SparklesIcon,
  TagIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { getSuggestions } from '../../services/wishlistAPI';

const SmartSuggestions = ({ onAddKeyword, currentWishlist = [] }) => {
  const [suggestions, setSuggestions] = useState({
    categories: [],
    popularTags: [],
    recommended: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await getSuggestions();
      setSuggestions(data.suggestions || {});
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = (keyword) => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (currentWishlist.includes(normalizedKeyword)) {
      toast.error('This keyword is already in your wishlist');
      return;
    }
    onAddKeyword(keyword);
  };

  const tabs = [
    {
      id: 'recommended',
      label: 'Recommended',
      icon: LightBulbIcon,
      items: suggestions.recommended || []
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderIcon,
      items: suggestions.categories || []
    },
    {
      id: 'popular',
      label: 'Popular Tags',
      icon: TagIcon,
      items: suggestions.popularTags || []
    }
  ];

  const activeItems = tabs.find(tab => tab.id === activeTab)?.items || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-yellow-500" />
          <span>Smart Suggestions</span>
        </h3>
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-6 w-6 border-2 border-yellow-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-yellow-500" />
          <span>Smart Suggestions</span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add popular keywords to get better matches
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.items.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Suggestions */}
      <div className="p-6">
        {activeItems.length === 0 ? (
          <div className="text-center py-8">
            <SparklesIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No suggestions available</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeItems.map((item, index) => {
              const isAlreadyAdded = currentWishlist.includes(item.toLowerCase());
              
              return (
                <motion.button
                  key={`${activeTab}-${item}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleAddSuggestion(item)}
                  disabled={isAlreadyAdded}
                  className={`
                    inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium
                    transition-all duration-200 border
                    ${isAlreadyAdded
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-sm'
                    }
                  `}
                >
                  <span className="capitalize">{item}</span>
                  {!isAlreadyAdded && <PlusIcon className="h-3 w-3" />}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSuggestions;