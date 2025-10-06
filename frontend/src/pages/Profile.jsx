import React, { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiCamera, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiSettings,
  FiBell,
  FiEye,
  FiTrendingUp,
  FiDollarSign,
  FiPackage
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { authAPI, userAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    year: user?.year || '',
    phone: user?.phone || '',
    emailNotifications: user?.emailNotifications ?? true
  })

  // Fetch user stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'userStats',
    userAPI.getStats,
    {
      enabled: !!user,
      onError: (error) => {
        console.error('Failed to fetch stats:', error)
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(authAPI.updateProfile, {
    onSuccess: (data) => {
      updateUser(data.user)
      queryClient.invalidateQueries('userStats')
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    updateProfileMutation.mutate(profileData)
  }

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      college: user?.college || '',
      year: user?.year || '',
      phone: user?.phone || '',
      emailNotifications: user?.emailNotifications ?? true
    })
    setIsEditing(false)
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // TODO: Implement image upload to Cloudinary
      toast.info('Profile picture upload coming soon!')
    }
  }

  const stats = statsData?.stats || {}
  const memberSince = new Date(user?.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })

  if (statsLoading && !statsData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Profile - CampusMart</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FiUser className="text-primary-500" />
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <FiEdit3 size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isLoading}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FiSave size={16} />
                      {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <button
                    onClick={handleProfilePictureClick}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-500 hover:border-primary-300 transition-colors"
                  >
                    <FiCamera size={14} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">Member since {memberSince}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline mr-2" size={16} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline mr-2" size={16} />
                    Email Address
                  </label>
                  <p className="text-gray-900 py-2">{user?.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2" size={16} />
                    College
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="college"
                      value={profileData.college}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.college}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiCalendar className="inline mr-2" size={16} />
                    Academic Year
                  </label>
                  {isEditing ? (
                    <select
                      name="year"
                      value={profileData.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2">{user?.year}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="inline mr-2" size={16} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <FiBell className="text-primary-500" />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications about your products and interests</p>
                  </div>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={profileData.emailNotifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.emailNotifications 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FiTrendingUp className="text-primary-500" />
                Account Statistics
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiPackage className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-lg font-semibold text-gray-900">{stats.totalProducts || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-lg font-semibold text-gray-900">₹{stats.totalEarnings || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiEye className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-lg font-semibold text-gray-900">{stats.totalViews || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.activeProducts || 0}</p>
                      <p className="text-xs text-gray-600">Active</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">{stats.soldProducts || 0}</p>
                      <p className="text-xs text-gray-600">Sold</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FiSettings className="text-primary-500" />
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium text-gray-900">Account Settings</div>
                  <div className="text-sm text-gray-600">Manage your account preferences</div>
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium text-gray-900">Privacy Settings</div>
                  <div className="text-sm text-gray-600">Control your privacy preferences</div>
                </button>
                
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium text-gray-900">Security</div>
                  <div className="text-sm text-gray-600">Change password and security settings</div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile