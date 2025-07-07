import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Eye, EyeOff } from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'

const ImprovedDashboard = () => {
  const { theme } = useTheme()
  const [showBalance, setShowBalance] = React.useState(true)

  // Improved card hierarchy with better visual grouping
  const statsCards = [
    {
      id: 'total',
      title: 'Total Spent',
      value: '₹370',
      change: '+12%',
      trend: 'up',
      period: 'All time',
      color: 'blue',
      icon: DollarSign
    },
    {
      id: 'weekly',
      title: 'Weekly Spent',
      value: '₹370',
      change: '+5%',
      trend: 'up',
      period: '18.5% of budget',
      color: 'purple',
      icon: Calendar
    },
    {
      id: 'budget',
      title: 'Budget Progress',
      value: '18.5%',
      change: null,
      trend: 'neutral',
      period: '₹1630 remaining',
      color: 'green',
      icon: Target,
      progress: 18.5
    },
    {
      id: 'savings',
      title: 'Savings',
      value: '₹1630',
      change: '+8%',
      trend: 'up',
      period: 'This week',
      color: 'emerald',
      icon: TrendingUp
    }
  ]

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <h1 className="h1 text-text">Welcome back!</h1>
          <motion.span 
            className="text-4xl"
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          >
            👋
          </motion.span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <p className="body text-text-muted">Let's check your spending today</p>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid with Better Spacing */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className={`bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden`}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className={`w-32 h-32 bg-${card.color}-500 rounded-full blur-3xl -top-16 -right-16`} />
            </div>
            
            {/* Card Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-${card.color}-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-500`} />
                </div>
                {card.change && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                    card.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {card.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="caption font-medium">{card.change}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="body-small text-text-muted">{card.title}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="h3 text-text font-bold">
                    {showBalance ? card.value : '••••'}
                  </p>
                </div>
                <p className="caption text-text-muted">{card.period}</p>
                
                {/* Progress Bar for Budget Card */}
                {card.progress && (
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className={`h-2 bg-${card.color}-500 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Budget Progress Section */}
      <motion.div 
        className="bg-card border border-border rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="h3 text-text mb-2">Weekly Budget Progress</h3>
            <p className="body-small text-text-muted">Track your spending against your weekly goal</p>
          </div>
          <div className="text-right">
            <p className="h4 text-text font-bold">₹370 / ₹2000</p>
            <p className="caption text-text-muted">18.5% used</p>
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="space-y-4">
          <div className="relative">
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: '18.5%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
            
            {/* Progress Markers */}
            <div className="flex justify-between mt-2 text-xs text-text-muted">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="body-small text-text-muted">Daily Average</p>
              <p className="h4 text-text font-semibold">₹53</p>
            </div>
            <div className="text-center">
              <p className="body-small text-text-muted">Remaining</p>
              <p className="h4 text-green-500 font-semibold">₹1630</p>
            </div>
            <div className="text-center">
              <p className="body-small text-text-muted">Days Left</p>
              <p className="h4 text-text font-semibold">4</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ImprovedDashboard
