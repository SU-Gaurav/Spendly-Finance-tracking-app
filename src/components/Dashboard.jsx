import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  Trophy,
  AlertTriangle,
  Flame,
  PiggyBank
} from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'
import ExpenseChart from './ExpenseChart'
import RecentTransactions from './RecentTransactions'
import SpendlyMascot from './SpendlyMascot'
import confetti from 'canvas-confetti'

const Dashboard = () => {
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
  const [showCelebration, setShowCelebration] = useState(false)
  const [savings, setSavings] = useState(0)

  useEffect(() => {
    const weeklySavings = budget.weekly - weeklySpent
    setSavings(weeklySavings)
    
    // Show celebration if user saved money
    if (weeklySavings > 0 && weeklySpent > 0) {
      setShowCelebration(true)
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      setTimeout(() => setShowCelebration(false), 5000)
    }
  }, [weeklySpent, budget.weekly])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <motion.div
      variants={itemVariants}
      className="card p-6 hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div 
            className="flex items-center space-x-1"
            style={{ color: trend > 0 ? 'var(--error)' : 'var(--success)' }}
          >
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
      <p className="text-primary text-2xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-muted text-xs">{subtitle}</p>}
    </motion.div>
  )

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center" variants={itemVariants}>
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-secondary text-lg">
          Let's check your spending today
        </p>
      </motion.div>

      {/* Celebration Banner */}
      {showCelebration && savings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="card p-6"
          style={{ 
            borderColor: 'var(--success)',
            backgroundColor: isDark ? '#1A2E1A' : '#F0FDF4'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
            <div className="text-center">
              <h3 className="text-primary text-xl font-bold">
                🎉 You've saved {settings.currency}{savings} this week!
              </h3>
              <p className="text-secondary">Keep up the great work!</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
        </motion.div>
      )}

      {/* Shame Mode Alert */}
      {settings.shameMode && isOverBudget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6"
          style={{ 
            borderColor: 'var(--error)',
            backgroundColor: isDark ? '#2E1A1A' : '#FEF2F2'
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Flame className="w-10 h-10 animate-pulse" style={{ color: 'var(--error)' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
                <h3 className="font-bold text-lg" style={{ color: 'var(--error)' }}>Shame Mode Activated! 🔥</h3>
              </div>
              <p className="text-primary mb-2">
                "Looks like your wallet is on a diet, but your spending isn't! 
                You've exceeded your weekly budget by {settings.currency}{weeklySpent - budget.weekly}. 
                Time to channel your inner monk! 🧘‍♂️"
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={{ color: 'var(--error)' }}>Overspent:</span>
                <span className="text-primary font-bold">
                  {settings.currency}{weeklySpent - budget.weekly}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <StatCard
          title="Total Spent"
          value={`${settings.currency}${totalSpent}`}
          icon={TrendingUp}
          color="var(--accent-secondary)"
          trend={12}
          subtitle="All time"
        />
        <StatCard
          title="Weekly Spent"
          value={`${settings.currency}${weeklySpent}`}
          icon={Calendar}
          color="var(--accent-primary)"
          trend={-5}
          subtitle={`${budgetProgress.toFixed(1)}% of budget`}
        />
        <StatCard
          title="Budget Progress"
          value={`${budgetProgress.toFixed(1)}%`}
          icon={Target}
          color={isOverBudget ? "var(--error)" : "var(--success)"}
          subtitle={`${settings.currency}${budget.weekly - weeklySpent} remaining`}
        />
        <StatCard
          title="Savings"
          value={`${settings.currency}${Math.max(0, savings)}`}
          icon={PiggyBank}
          color="var(--accent-tertiary)"
          trend={savings > 0 ? -8 : 15}
          subtitle="This week"
        />
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        variants={itemVariants}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary text-lg font-semibold">Weekly Budget Progress</h3>
          <span className="text-secondary text-sm">
            {settings.currency}{weeklySpent} / {settings.currency}{budget.weekly}
          </span>
        </div>
        <div className="relative">
          <div 
            className="h-4 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-primary)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: isOverBudget ? 'var(--error)' : 'var(--success)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          {isOverBudget && (
            <motion.div
              className="absolute top-0 right-0 h-4 rounded-full"
              style={{ backgroundColor: 'var(--error)' }}
              initial={{ width: 0 }}
              animate={{ width: `${budgetProgress - 100}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-muted text-xs">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <ExpenseChart />
        </motion.div>
        <motion.div variants={itemVariants}>
          <RecentTransactions />
        </motion.div>
      </div>

      {/* Mascot */}
      <motion.div variants={itemVariants}>
        <SpendlyMascot />
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
