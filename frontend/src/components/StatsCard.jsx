import React from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  change,
  className = '' 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-600'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      text: 'text-gray-600'
    }
  }

  const colorClass = colorClasses[color] || colorClasses.blue

  const formatValue = (value) => {
    if (typeof value === 'string') return value
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  const getChangeColor = (change) => {
    if (!change) return 'text-gray-500'
    return change > 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeIcon = (change) => {
    if (!change) return null
    return change > 0 ? FiTrendingUp : FiTrendingDown
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${getChangeColor(change)}`}>
              {getChangeIcon(change) && (
                <span className="mr-1">
                  {React.createElement(getChangeIcon(change), { size: 14 })}
                </span>
              )}
              <span>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClass.bg}`}>
          <Icon className={colorClass.icon} size={24} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard