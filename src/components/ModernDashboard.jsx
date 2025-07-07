import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Trophy,
  AlertTriangle,
  Flame,
  PiggyBank,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'
import { AccessibleButton } from './AccessibilityComponents'

const ModernDashboard = () => {
  const { 
    totalSpent, 
    weeklySpent, 
    budget, 
    budgetProgress, 
    isOverBudget, 
    expenses,
    settings 
  } = useSpendly()

  const { isDark } = useTheme()
  const [showValues, setShowValues] = useState(true)
  const [timeFilter, setTimeFilter] = useState('week')

  // Calculate insights
  const insights = useMemo(() => {
    const savings = Math.max(0, budget.weekly - weeklySpent)
    const averageDaily = weeklySpent / 7
    const projectedWeekly = averageDaily * 7
    
    return {
      savings,
      averageDaily,
      projectedWeekly,
      isOnTrack: projectedWeekly <= budget.weekly,
      topCategory: expenses[0]?.category || 'Food'
    }
  }, [weeklySpent, budget.weekly, expenses])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    subtitle,
    trend = 'neutral',
    size = 'default'
  }) => (
    <motion.div
      variants={itemVariants}
      className={`metric-card interactive-card ${size === 'large' ? 'lg:col-span-2' : ''}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
            boxShadow: `0 4px 12px ${color}33`
          }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        {change && (
          <div className={`metric-change ${trend}`}>
            {trend === 'positive' ? 
              <TrendingUp className="w-3 h-3" /> : 
              <TrendingDown className="w-3 h-3" />
            }
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="metric-value">
          {showValues ? value : '••••'}
        </div>
        <div className="metric-label">{title}</div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs text-muted mt-2 font-medium">
          {subtitle}
        </div>
      )}

      {/* Progress indicator for budget */}
      {title === 'Budget Progress' && (
        <div className="mt-4">
          <div className="progress-modern">
            <motion.div
              className="progress-fill"
              style={{
                background: isOverBudget 
                  ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                  : 'linear-gradient(90deg, #10B981, #059669)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </motion.div>
  )

  const InsightCard = () => (
    <motion.div
      variants={itemVariants}
      className="card-glass col-span-full p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-brand-primary" />
          </div>
          <h3 className="text-lg font-semibold text-primary">Smart Insights</h3>
        </div>
        <AccessibleButton variant="ghost" size="small">
          <MoreHorizontal className="w-4 h-4" />
        </AccessibleButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {settings.currency}{insights.savings}
          </div>
          <div className="text-sm text-muted">Saved this week</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {settings.currency}{insights.averageDaily.toFixed(0)}
          </div>
          <div className="text-sm text-muted">Daily average</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${
            insights.isOnTrack ? 'text-success' : 'text-warning'
          }`}>
            {insights.isOnTrack ? 'On Track' : 'Overspending'}
          </div>
          <div className="text-sm text-muted">Weekly projection</div>
        </div>
      </div>

      {!insights.isOnTrack && (
        <motion.div
          className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="flex items-center space-x-2 text-warning">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-sm">
              At current pace, you'll exceed budget by {settings.currency}
              {(insights.projectedWeekly - budget.weekly).toFixed(0)}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <motion.div
      className="space-y-8 p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-secondary">
            Here's your financial overview for {timeFilter === 'week' ? 'this week' : 'this month'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <AccessibleButton
            variant="ghost"
            size="small"
            onClick={() => setShowValues(!showValues)}
            ariaLabel={showValues ? 'Hide values' : 'Show values'}
          >
            {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </AccessibleButton>
          
          <div className="flex rounded-lg border border-border-primary overflow-hidden">
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-2 text-sm transition-colors ${
                timeFilter === 'week' 
                  ? 'bg-brand-primary text-white' 
                  : 'text-muted hover:text-primary'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-2 text-sm transition-colors ${
                timeFilter === 'month' 
                  ? 'bg-brand-primary text-white' 
                  : 'text-muted hover:text-primary'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Spent"
          value={`${settings.currency}${totalSpent}`}
          change={12}
          trend="negative"
          icon={TrendingUp}
          color="#8B5CF6"
          subtitle="All time"
        />
        
        <MetricCard
          title="Weekly Spent"
          value={`${settings.currency}${weeklySpent}`}
          change={5}
          trend="positive"
          icon={Calendar}
          color="#6366F1"
          subtitle={`${budgetProgress.toFixed(1)}% of budget`}
        />
        
        <MetricCard
          title="Budget Progress"
          value={`${budgetProgress.toFixed(1)}%`}
          icon={Target}
          color={isOverBudget ? "#EF4444" : "#10B981"}
          subtitle={`${settings.currency}${Math.abs(budget.weekly - weeklySpent)} ${isOverBudget ? 'over' : 'remaining'}`}
        />
        
        <MetricCard
          title="Savings"
          value={`${settings.currency}${insights.savings}`}
          change={8}
          trend="positive"
          icon={PiggyBank}
          color="#EC4899"
          subtitle="This week"
        />
      </div>

      {/* Insights Section */}
      <InsightCard />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          {/* Enhanced Expense Chart would go here */}
          <div className="card-modern p-6 h-96 flex items-center justify-center">
            <div className="text-center text-muted">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">Expense Trends</h3>
              <p className="text-sm">Interactive chart coming soon</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          {/* Recent Transactions would go here */}
          <div className="card-modern p-6 h-96 flex items-center justify-center">
            <div className="text-center text-muted">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">Recent Activity</h3>
              <p className="text-sm">Transaction list coming soon</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ModernDashboard
