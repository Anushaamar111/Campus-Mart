import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  XMarkIcon, 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const WishlistKeyword = ({ wishlistKeywords, onAddKeyword, onUpdateKeyword, onDeleteKeyword, onClearWishlist }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    category: 'Uncategorized',
    priority: 'medium',
    maxPrice: '',
    isActive: true
  });

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' }
  ];

  const categories = [
    'Uncategorized', 'Electronics', 'Books', 'Furniture', 'Clothing', 
    'Sports', 'Music', 'Art', 'Food', 'Transportation', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newKeyword.keyword.trim()) {
      toast.error('Keyword is required');
      return;
    }

    try {
      const keywordData = {
        ...newKeyword,
        maxPrice: newKeyword.maxPrice ? parseFloat(newKeyword.maxPrice) : undefined
      };
      
      if (editingKeyword) {
        await onUpdateKeyword(editingKeyword._id, keywordData);
        setEditingKeyword(null);
      } else {
        await onAddKeyword(keywordData);
      }
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving keyword:', error);
    }
  };

  const resetForm = () => {
    setNewKeyword({
      keyword: '',
      category: 'Uncategorized',
      priority: 'medium',
      maxPrice: '',
      isActive: true
    });
  };

  const handleEdit = (keyword) => {
    setEditingKeyword(keyword);
    setNewKeyword({
      keyword: keyword.keyword,
      category: keyword.category || 'Uncategorized',
      priority: keyword.priority || 'medium',
      maxPrice: keyword.maxPrice ? keyword.maxPrice.toString() : '',
      isActive: keyword.isActive !== false
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingKeyword(null);
    resetForm();
  };

  const getPriorityColor = (priority) => {
    const p = priorities.find(p => p.value === priority);
    return p ? p.color : 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TagIcon className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Wishlist Keywords</h3>
            <span className="text-sm text-gray-500">
              ({wishlistKeywords.length} {wishlistKeywords.length === 1 ? 'keyword' : 'keywords'})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {wishlistKeywords.length > 0 && (
              <button
                onClick={onClearWishlist}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Keyword</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-gray-900">
                  {editingKeyword ? 'Edit Keyword' : 'Add New Keyword'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keyword *
                    </label>
                    <input
                      type="text"
                      value={newKeyword.keyword}
                      onChange={(e) => setNewKeyword({...newKeyword, keyword: e.target.value})}
                      placeholder="e.g., iPhone, laptop, textbook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newKeyword.category}
                      onChange={(e) => setNewKeyword({...newKeyword, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newKeyword.priority}
                      onChange={(e) => setNewKeyword({...newKeyword, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {priorities.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newKeyword.maxPrice}
                      onChange={(e) => setNewKeyword({...newKeyword, maxPrice: e.target.value})}
                      placeholder="Optional"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newKeyword.isActive}
                      onChange={(e) => setNewKeyword({...newKeyword, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      {editingKeyword ? 'Update' : 'Add'} Keyword
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keywords List */}
        {wishlistKeywords.length === 0 ? (
          <div className="text-center py-8">
            <TagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No keywords yet</h4>
            <p className="text-gray-600 mb-4">
              Add keywords to get notified when matching products are posted.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Your First Keyword</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {wishlistKeywords.map((keyword, index) => (
                <motion.div
                  key={keyword._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`
                    p-4 rounded-lg border transition-all
                    ${keyword.isActive 
                      ? 'border-gray-200 bg-white' 
                      : 'border-gray-100 bg-gray-50 opacity-60'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TagIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {keyword.keyword}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {keyword.category}
                          </span>
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs font-medium
                            ${getPriorityColor(keyword.priority)}
                          `}>
                            {keyword.priority}
                          </span>
                          {keyword.maxPrice && (
                            <span className="text-xs text-gray-500">
                              Max: ₹{keyword.maxPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onUpdateKeyword(keyword._id, { isActive: !keyword.isActive })}
                        className={`
                          p-2 transition-colors
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
                        onClick={() => handleEdit(keyword)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit keyword"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => onDeleteKeyword(keyword._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete keyword"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistKeyword;