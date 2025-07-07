import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  Info
} from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'

const EnhancedExpenseChart = () => {
  const { expenses, settings } = useSpendly()
  const [chartType, setChartType] = useState('bar')
  const [timeRange, setTimeRange] = useState('week')
  const [showTooltip, setShowTooltip] = useState(null)

  // Process data based on time range
  const chartData = useMemo(() => {
    const now = new Date()
    let filteredExpenses = expenses

    switch (timeRange) {
      case 'week':
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          const daysDiff = (now - expenseDate) / (1000 * 60 * 60 * 24)
          return daysDiff <= 7
        })
        break
      case 'month':
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getMonth() === now.getMonth()
        })
        break
      case 'year':
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getFullYear() === now.getFullYear()
        })
        break
    }

    // Group by category
    const categoryData = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    return Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100
    })).sort((a, b) => b.amount - a.amount)
  }, [expenses, timeRange])

  const maxAmount = Math.max(...chartData.map(d => d.amount), 0)
  const totalAmount = chartData.reduce((sum, d) => sum + d.amount, 0)

  const categoryColors = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Entertainment': '#96CEB4',
    'Bills & Utilities': '#FECA57',
    'Healthcare': '#FF9FF3',
    'Education': '#54A0FF',
    'Travel': '#5F27CD',
    'Other': '#9B59B6'
  }

  const BarChart = () => (
    <div className="space-y-4">
      {chartData.map((item, index) => (
        <motion.div
          key={item.category}
          className="relative group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColors[item.category] || '#9B59B6' }}
              />
              <span className="text-sm font-medium text-primary truncate">
                {item.category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-primary">
                {settings.currency}{item.amount.toFixed(2)}
              </span>
              <span className="text-xs text-muted ml-2">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="relative h-3 bg-border-primary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                backgroundColor: categoryColors[item.category] || '#9B59B6',
                width: `${(item.amount / maxAmount) * 100}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.amount / maxAmount) * 100}%` }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
              onMouseEnter={() => setShowTooltip(item)}
              onMouseLeave={() => setShowTooltip(null)}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )

  const PieChartComponent = () => {
    const centerX = 120
    const centerY = 120
    const radius = 100
    let currentAngle = 0

    return (
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="relative">
          <svg width="240" height="240" className="transform -rotate-90">
            {chartData.map((item, index) => {
              const angle = (item.percentage / 100) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle
              currentAngle += angle

              // Calculate path for pie slice
              const startAngleRad = (startAngle * Math.PI) / 180
              const endAngleRad = (endAngle * Math.PI) / 180
              
              const x1 = centerX + radius * Math.cos(startAngleRad)
              const y1 = centerY + radius * Math.sin(startAngleRad)
              const x2 = centerX + radius * Math.cos(endAngleRad)
              const y2 = centerY + radius * Math.sin(endAngleRad)
              
              const largeArcFlag = angle > 180 ? 1 : 0
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')

              return (
                <motion.path
                  key={item.category}
                  d={pathData}
                  fill={categoryColors[item.category] || '#9B59B6'}
                  stroke="var(--bg-primary)"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setShowTooltip(item)}
                  onMouseLeave={() => setShowTooltip(null)}
                />
              )
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {settings.currency}{totalAmount.toFixed(0)}
            </span>
            <span className="text-sm text-muted">Total</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {chartData.map((item, index) => (
            <motion.div
              key={item.category}
              className="flex items-center justify-between p-3 rounded-lg bg-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: categoryColors[item.category] || '#9B59B6' }}
                />
                <span className="text-sm font-medium text-primary">
                  {item.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary">
                  {settings.currency}{item.amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            {chartType === 'bar' ? 
              <BarChart3 className="w-5 h-5 text-white" /> : 
              <PieChart className="w-5 h-5 text-white" />
            }
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">
              Expense Breakdown
            </h3>
            <p className="text-sm text-muted">
              {timeRange === 'week' ? 'Last 7 days' : 
               timeRange === 'month' ? 'This month' : 'This year'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input text-sm py-2 px-3"
            aria-label="Select time range"
          >
            <option value="week">Last Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          {/* Chart type toggle */}
          <div className="flex rounded-lg overflow-hidden border border-border-primary">
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 transition-colors ${
                chartType === 'bar' 
                  ? 'bg-accent text-white' 
                  : 'bg-transparent text-muted hover:text-primary'
              }`}
              aria-label="Bar chart view"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 transition-colors ${
                chartType === 'pie' 
                  ? 'bg-accent text-white' 
                  : 'bg-transparent text-muted hover:text-primary'
              }`}
              aria-label="Pie chart view"
            >
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart content */}
      <div className="min-h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-border-primary flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-muted" />
            </div>
            <h4 className="text-lg font-medium text-primary mb-2">
              No expenses found
            </h4>
            <p className="text-muted max-w-sm">
              No expenses recorded for the selected time period. Start adding expenses to see your breakdown here.
            </p>
          </div>
        ) : (
          chartType === 'bar' ? <BarChart /> : <PieChartComponent />
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          className="fixed pointer-events-none z-50 bg-card border border-border-primary rounded-lg p-3 shadow-lg"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-sm">
            <div className="font-medium text-primary">{showTooltip.category}</div>
            <div className="text-muted">
              {settings.currency}{showTooltip.amount.toFixed(2)} ({showTooltip.percentage.toFixed(1)}%)
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer with insights */}
      <div className="mt-6 pt-4 border-t border-border-primary">
        <div className="flex items-center space-x-2 text-sm text-muted">
          <Info className="w-4 h-4" />
          <span>
            {chartData.length > 0 && (
              `Top category: ${chartData[0]?.category} (${chartData[0]?.percentage.toFixed(1)}%)`
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default EnhancedExpenseChart
