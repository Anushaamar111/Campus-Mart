import { X, User, IndianRupee, MessageSquare, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const BidsModal = ({ isOpen, onClose, productId, productTitle }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && productId) {
      fetchBids();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, productId]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/bids/product/${productId}`);
      setBids(data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (!confirm('Accept this bid? This will lock bidding and notify the buyer.')) {
      return;
    }

    try {
      await api.post(`/bids/${bidId}/accept`);
      alert('Bid accepted! The buyer has been notified.');
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept bid');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bids</h2>
            <p className="text-sm text-gray-600 mt-1">{productTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No bids yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className={`border rounded-lg p-4 ${
                    bid.status === 'accepted'
                      ? 'border-green-300 bg-green-50'
                      : bid.status === 'rejected'
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-purple-300 bg-purple-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {bid.bidder?.firstName} {bid.bidder?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{bid.bidder?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          ${bid.amount.toFixed(2)}
                        </span>
                        <span className={`badge ml-2 ${
                          bid.status === 'accepted' ? 'badge-success' :
                          bid.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {bid.status}
                        </span>
                      </div>

                      {bid.message && (
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-700">{bid.message}</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(bid.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {bid.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptBid(bid._id)}
                        className="btn-primary flex items-center space-x-2 ml-4"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidsModal;
