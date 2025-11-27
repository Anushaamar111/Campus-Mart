import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Eye, Gavel, IndianRupee, Send, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setBidAmount((data.product.highestBid || data.product.basePrice) + 1);
        // Check if product is saved
        setIsSaved(user?.savedItems?.includes(id) || false);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user?.savedItems]);

  const handleSave = async () => {
    try {
      await api.post(`/user/saved/${id}`);
      setIsSaved(!isSaved);
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/bids', {
        productId: id,
        amount: parseFloat(bidAmount),
        message: bidMessage
      });

      // Optimistic update
      setProduct(prev => ({
        ...prev,
        highestBid: parseFloat(bidAmount),
        bidCount: (prev.bidCount || 0) + 1
      }));

      setBidAmount(parseFloat(bidAmount) + 1);
      setBidMessage('');
      alert('Bid placed successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  const currentPrice = product.highestBid > 0 ? product.highestBid : product.basePrice;
  const isActive = product.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <Eye className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{product.views || 0}</p>
                <p className="text-sm text-gray-500">Views</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <Gavel className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{product.bidCount || 0}</p>
                <p className="text-sm text-gray-500">Bids</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <IndianRupee className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">₹{currentPrice}</p>
                <p className="text-sm text-gray-500 mt-1">Current Price</p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`badge ${
                    product.status === 'active' ? 'badge-success' :
                    product.status === 'bidding_locked' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {product.status === 'active' ? 'Active' :
                     product.status === 'bidding_locked' ? 'Bidding Closed' : 'Sold'}
                  </span>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                <button
                  onClick={handleSave}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title={isSaved ? 'Remove from saved' : 'Save product'}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <User className="w-5 h-5" />
                <span>{product.seller?.firstName} {product.seller?.lastName}</span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Condition</p>
                <p className="text-lg font-medium text-gray-900">{product.condition || 'Not specified'}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description || 'No description provided.'}
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Starting Price</p>
                  <p className="text-xl font-semibold text-gray-900">${product.basePrice.toFixed(2)}</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500">Current {product.highestBid > 0 ? 'Highest Bid' : 'Price'}</p>
                  <p className="text-3xl font-bold text-purple-600">${currentPrice.toFixed(2)}</p>
                </div>

                {/* Bid Form */}
                {isActive && (
                  <form onSubmit={handlePlaceBid} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bid Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={currentPrice + 0.01}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum bid: ${(currentPrice + 0.01).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message to Seller (Optional)
                      </label>
                      <textarea
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        rows="3"
                        className="input-field resize-none"
                        placeholder="Any questions or special requests?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                      <span>{submitting ? 'Placing Bid...' : 'Place Bid'}</span>
                    </button>
                  </form>
                )}

                {!isActive && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    This product is no longer available for bidding.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
