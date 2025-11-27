import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserMode } from '../context/UserModeContext';
import { ShoppingBag, Store, Heart, Gavel, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleMode, isBuyer } = useUserMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleModeToggle = () => {
    toggleMode();
    if (mode === 'buyer') {
      navigate('/seller');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CampusConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Mode Toggle */}
            <button
              onClick={handleModeToggle}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
            >
              {isBuyer ? (
                <>
                  <Store className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-600">Switch to Seller</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-600">Switch to Buyer</span>
                </>
              )}
            </button>

            {isBuyer && (
              <>
                <Link
                  to="/saved"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">Saved</span>
                </Link>
                <Link
                  to="/my-bids"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Gavel className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">My Bids</span>
                </Link>
              </>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.firstName}</p>
                <p className="text-xs text-gray-500">{user?.college?.name}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <button
                onClick={handleModeToggle}
                className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg border-2 border-purple-600 hover:bg-purple-50"
              >
                {isBuyer ? (
                  <>
                    <Store className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-600">Switch to Seller</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-600">Switch to Buyer</span>
                  </>
                )}
              </button>

              {isBuyer && (
                <>
                  <Link
                    to="/saved"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-700">Saved Items</span>
                  </Link>
                  <Link
                    to="/my-bids"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Gavel className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-700">My Bids</span>
                  </Link>
                </>
              )}

              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{user?.firstName}</p>
                <p className="text-xs text-gray-500">{user?.college?.name}</p>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
