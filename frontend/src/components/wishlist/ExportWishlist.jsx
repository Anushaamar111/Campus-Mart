import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
  CodeBracketIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarIcon,
  TagIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { exportWishlist } from '../../services/wishlistAPI';

const ExportWishlist = ({ wishlistKeywords }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [includeOptions, setIncludeOptions] = useState({
    keywords: true,
    categories: true,
    priorities: true,
    maxPrices: true,
    timestamps: true,
    inactiveItems: false
  });

  const formatOptions = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Structured data format, ideal for backup and import',
      icon: CodeBracketIcon,
      extension: '.json'
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Spreadsheet format, perfect for Excel or Google Sheets',
      icon: TableCellsIcon,
      extension: '.csv'
    },
    {
      id: 'txt',
      name: 'Text',
      description: 'Simple text format, easy to read and share',
      icon: DocumentTextIcon,
      extension: '.txt'
    }
  ];

  const handleExport = async () => {
    if (wishlistKeywords.length === 0) {
      toast.error('No wishlist items to export');
      return;
    }

    setIsExporting(true);
    
    try {
      const response = await exportWishlist(exportFormat, includeOptions);
      
      // Create and download file
      const blob = new Blob([response.data], { 
        type: getContentType(exportFormat) 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wishlist_${new Date().toISOString().split('T')[0]}${getFileExtension(exportFormat)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Wishlist exported as ${exportFormat.toUpperCase()}`);
      setShowOptions(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export wishlist');
    } finally {
      setIsExporting(false);
    }
  };

  const getContentType = (format) => {
    switch (format) {
      case 'json':
        return 'application/json';
      case 'csv':
        return 'text/csv';
      case 'txt':
        return 'text/plain';
      default:
        return 'text/plain';
    }
  };

  const getFileExtension = (format) => {
    switch (format) {
      case 'json':
        return '.json';
      case 'csv':
        return '.csv';
      case 'txt':
        return '.txt';
      default:
        return '.txt';
    }
  };

  const toggleIncludeOption = (option) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const getPreviewData = () => {
    const filteredKeywords = includeOptions.inactiveItems 
      ? wishlistKeywords 
      : wishlistKeywords.filter(k => k.isActive);

    return {
      totalItems: filteredKeywords.length,
      categories: [...new Set(filteredKeywords.map(k => k.category || 'Uncategorized'))].length,
      priorities: [...new Set(filteredKeywords.map(k => k.priority).filter(Boolean))].length
    };
  };

  const previewData = getPreviewData();

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Export Wishlist</h3>
          </div>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Export Data
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Format Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Export Format</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formatOptions.map((format) => {
                    const Icon = format.icon;
                    return (
                      <motion.button
                        key={format.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExportFormat(format.id)}
                        className={`
                          p-4 rounded-lg border-2 text-left transition-all
                          ${exportFormat === format.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`h-5 w-5 ${exportFormat === format.id ? 'text-purple-600' : 'text-gray-500'}`} />
                          <span className={`font-medium ${exportFormat === format.id ? 'text-purple-900' : 'text-gray-900'}`}>
                            {format.name}
                          </span>
                          {exportFormat === format.id && (
                            <CheckCircleIcon className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{format.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Include Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Include in Export</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'keywords', label: 'Keywords', icon: TagIcon },
                    { key: 'categories', label: 'Categories', icon: TagIcon },
                    { key: 'priorities', label: 'Priorities', icon: CheckCircleIcon },
                    { key: 'maxPrices', label: 'Max Prices', icon: CurrencyRupeeIcon },
                    { key: 'timestamps', label: 'Timestamps', icon: CalendarIcon },
                    { key: 'inactiveItems', label: 'Inactive Items', icon: XMarkIcon }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.key}
                        className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={includeOptions[option.key]}
                          onChange={() => toggleIncludeOption(option.key)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Icon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Export Preview</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{previewData.totalItems}</div>
                    <div className="text-gray-600">Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{previewData.categories}</div>
                    <div className="text-gray-600">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{previewData.priorities}</div>
                    <div className="text-gray-600">Priorities</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowOptions(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || previewData.totalItems === 0}
                  className="inline-flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isExporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Export {exportFormat.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary when collapsed */}
      {!showOptions && wishlistKeywords.length > 0 && (
        <div className="p-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {wishlistKeywords.length} wishlist {wishlistKeywords.length === 1 ? 'item' : 'items'} ready for export
            </span>
            <span>
              Multiple formats available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportWishlist;