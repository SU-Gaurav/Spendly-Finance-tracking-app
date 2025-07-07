import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const ExpenseChart = () => {
  const { expenses } = useSpendly()
  const { isDark } = useTheme()
  const [chartType, setChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('week')

  // Process data for charts
  const processChartData = () => {
    const now = new Date()
    let days = 7
    if (timeRange === 'month') days = 30
    
    const labels = []
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      labels.push(
        timeRange === 'week' 
          ? date.toLocaleDateString('en-US', { weekday: 'short' })
          : date.getDate().toString()
      )
      
      const dayExpenses = expenses
        .filter(expense => expense.date === dateStr)
        .reduce((sum, expense) => sum + expense.amount, 0)
      
      data.push(dayExpenses)
    }
    
    return { labels, data }
  }

  const { labels, data } = processChartData()

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily Expenses',
        data,
        borderColor: isDark ? '#8AB4F8' : '#3B82F6',
        backgroundColor: chartType === 'line' 
          ? (isDark ? 'rgba(138, 180, 248, 0.1)' : 'rgba(59, 130, 246, 0.1)')
          : (isDark ? 'rgba(138, 180, 248, 0.8)' : 'rgba(59, 130, 246, 0.8)'),
        borderWidth: 3,
        fill: chartType === 'line',
        tension: 0.4,
        pointBackgroundColor: isDark ? '#FFFFFF' : '#1F2937',
        pointBorderColor: isDark ? '#8AB4F8' : '#3B82F6',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(30, 30, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#FFFFFF' : '#111827',
        bodyColor: isDark ? '#B8BCC8' : '#374151',
        borderColor: isDark ? '#404057' : '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? '#B8BCC8' : '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: isDark ? '#2D2D3A' : '#F3F4F6',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#B8BCC8' : '#6B7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return '₹' + value
          }
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-6 h-96"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-primary text-lg font-semibold">Expense Trends</h3>
            <p className="text-secondary text-sm">
              {timeRange === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Toggle */}
          <div 
            className="flex rounded-xl p-1"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                timeRange === 'week'
                  ? 'shadow-lg'
                  : ''
              }`}
              style={{
                backgroundColor: timeRange === 'week' ? 'var(--accent-primary)' : 'transparent',
                color: timeRange === 'week' ? 'white' : 'var(--text-secondary)'
              }}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                timeRange === 'month'
                  ? 'shadow-lg'
                  : ''
              }`}
              style={{
                backgroundColor: timeRange === 'month' ? 'var(--accent-primary)' : 'transparent',
                color: timeRange === 'month' ? 'white' : 'var(--text-secondary)'
              }}
            >
              Month
            </button>
          </div>
          
          {/* Chart Type Toggle */}
          <motion.button
            onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 relative">
        <motion.div
          key={`${chartType}-${timeRange}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {chartType === 'line' ? (
            <Line data={chartData} options={options} />
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </motion.div>
      </div>

      {/* Stats */}
      <div 
        className="flex items-center justify-between mt-4 pt-4"
        style={{ borderTop: '1px solid var(--border-primary)' }}
      >
        <div className="text-center">
          <p className="text-muted text-xs">Average</p>
          <p className="text-primary font-semibold">
            ₹{Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted text-xs">Highest</p>
          <p className="text-primary font-semibold">₹{Math.max(...data)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted text-xs">Total</p>
          <p className="text-primary font-semibold">₹{data.reduce((a, b) => a + b, 0)}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default ExpenseChart
