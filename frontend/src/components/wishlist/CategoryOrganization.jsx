import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TagIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const CategoryOrganization = ({ wishlistKeywords, onUpdateKeyword, onDeleteKeyword }) => {
  const [categories, setCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    organizeKeywordsByCategory();
  }, [wishlistKeywords]);

  const organizeKeywordsByCategory = () => {
    const organized = {};
    
    wishlistKeywords.forEach(keyword => {
      const category = keyword.category || 'Uncategorized';
      if (!organized[category]) {
        organized[category] = [];
      }
      organized[category].push(keyword);
    });

    // Sort keywords within each category by most recent
    Object.keys(organized).forEach(category => {
      organized[category].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });

    setCategories(organized);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCategoryRename = async (oldCategory, newCategory) => {
    if (!newCategory.trim() || newCategory === oldCategory) {
      setEditingCategory(null);
      setNewCategoryName('');
      return;
    }

    try {
      // Update all keywords in this category
      const keywordsToUpdate = categories[oldCategory] || [];
      for (const keyword of keywordsToUpdate) {
        await onUpdateKeyword(keyword._id, { category: newCategory });
      }
      
      toast.success('Category renamed successfully');
      setEditingCategory(null);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error renaming category:', error);
      toast.error('Failed to rename category');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getVisibleCategories = () => {
    const sortedCategories = Object.keys(categories).sort();
    if (showHidden) {
      return sortedCategories;
    }
    
    // Filter out categories with only hidden keywords
    return sortedCategories.filter(category => {
      const visibleKeywords = categories[category].filter(keyword => keyword.isActive);
      return visibleKeywords.length > 0;
    });
  };

  const visibleCategories = getVisibleCategories();

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderIcon className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            <span className="text-sm text-gray-500">
              ({visibleCategories.length} {visibleCategories.length === 1 ? 'category' : 'categories'})
            </span>
          </div>
          
          <button
            onClick={() => setShowHidden(!showHidden)}
            className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
          >
            {showHidden ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span>{showHidden ? 'Hide inactive' : 'Show all'}</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {visibleCategories.length === 0 ? (
          <div className="text-center py-8">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h4>
            <p className="text-gray-600">
              Add wishlist keywords to organize them into categories.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleCategories.map((category, index) => {
              const keywords = categories[category] || [];
              const visibleKeywords = showHidden 
                ? keywords 
                : keywords.filter(keyword => keyword.isActive);
              const isExpanded = expandedCategories[category];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Category Header */}
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                        </motion.div>
                        
                        {editingCategory === category ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              onBlur={() => handleCategoryRename(category, newCategoryName)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleCategoryRename(category, newCategoryName);
                                } else if (e.key === 'Escape') {
                                  setEditingCategory(null);
                                  setNewCategoryName('');
                                }
                              }}
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <FolderIcon className="h-5 w-5 text-purple-500" />
                            <span className="font-medium text-gray-900">{category}</span>
                            <span className="text-sm text-gray-500">
                              ({visibleKeywords.length} {visibleKeywords.length === 1 ? 'item' : 'items'})
                            </span>
                          </>
                        )}
                      </div>
                      
                      {!editingCategory && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(category);
                              setNewCategoryName(category);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white space-y-3">
                          {visibleKeywords.map((keyword) => (
                            <motion.div
                              key={keyword._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`
                                p-3 rounded-lg border transition-all
                                ${keyword.isActive 
                                  ? 'border-gray-200 bg-white' 
                                  : 'border-gray-100 bg-gray-50 opacity-60'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <TagIcon className="h-4 w-4 text-purple-500" />
                                  <span className={`font-medium ${keyword.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {keyword.keyword}
                                  </span>
                                  
                                  {keyword.priority && (
                                    <span className={`
                                      px-2 py-0.5 rounded-full text-xs font-medium
                                      ${getPriorityColor(keyword.priority)}
                                    `}>
                                      {keyword.priority}
                                    </span>
                                  )}
                                  
                                  {!keyword.isActive && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => onUpdateKeyword(keyword._id, { isActive: !keyword.isActive })}
                                    className={`
                                      p-1 transition-colors
                                      ${keyword.isActive 
                                        ? 'text-gray-400 hover:text-yellow-600' 
                                        : 'text-gray-400 hover:text-green-600'
                                      }
                                    `}
                                    title={keyword.isActive ? 'Deactivate' : 'Activate'}
                                  >
                                    {keyword.isActive ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                  </button>
                                  
                                  <button
                                    onClick={() => onDeleteKeyword(keyword._id)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete keyword"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {keyword.maxPrice && (
                                <div className="mt-2 text-sm text-gray-600">
                                  Max price: ₹{keyword.maxPrice.toLocaleString()}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryOrganization;