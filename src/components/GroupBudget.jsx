import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, TrendingUp, PieChart, MessageCircle, Calendar, Target } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'

ChartJS.register(ArcElement, Tooltip, Legend)

const GroupBudget = () => {
  const { groups, settings } = useSpendly()
  const { theme } = useTheme()
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || null)

  const selectedGroupData = groups.find(g => g.id === selectedGroup)

  const getPieChartData = (group) => {
    const colors = theme === 'dark' 
      ? ['rgba(139, 180, 248, 0.8)', 'rgba(179, 136, 255, 0.8)', 'rgba(187, 134, 252, 0.8)', 'rgba(251, 113, 133, 0.8)', 'rgba(34, 197, 94, 0.8)']
      : ['rgba(59, 130, 246, 0.8)', 'rgba(147, 51, 234, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)']

    return {
      labels: group.expenses.map(exp => exp.member),
      datasets: [
        {
          data: group.expenses.map(exp => exp.amount),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        }
      ]
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'dark' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(71, 85, 105, 0.8)',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(30, 30, 47, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? 'rgba(226, 232, 240, 1)' : 'rgba(71, 85, 105, 1)',
        bodyColor: theme === 'dark' ? 'rgba(226, 232, 240, 1)' : 'rgba(71, 85, 105, 1)',
        borderColor: theme === 'dark' ? 'rgba(71, 85, 105, 0.2)' : 'rgba(226, 232, 240, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
            return `${context.label}: ${settings.currency}${context.parsed} (${percentage}%)`
          }
        }
      }
    }
  }

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

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center" variants={itemVariants}>
        <h1 className="text-4xl font-bold text-text mb-2">
          Group Budgets 👥
        </h1>
        <p className="text-text-muted text-lg">
          Track shared expenses with friends
        </p>
      </motion.div>

      {/* Group Selection */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-text text-lg font-semibold">Your Groups</h3>
              <p className="text-text-muted text-sm">{groups.length} active groups</p>
            </div>
          </div>
          
          <motion.button
            className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>New Group</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => {
            const progress = (group.spent / group.budget) * 100
            const isSelected = selectedGroup === group.id
            
            return (
              <motion.div
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-lg'
                    : 'border-border bg-muted hover:bg-muted/80'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-text font-semibold">{group.name}</h4>
                  <span className="text-text-muted text-sm">{group.members.length} members</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Spent</span>
                    <span className="text-text font-medium">
                      {settings.currency}{group.spent} / {settings.currency}{group.budget}
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        progress > 100 
                          ? 'bg-red-500' 
                          : 'bg-accent'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">{progress.toFixed(1)}% used</span>
                    <span className="text-text-muted">
                      {settings.currency}{group.budget - group.spent} left
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Selected Group Details */}
      {selectedGroupData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Group Stats */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-text text-lg font-semibold">Expense Split</h3>
                  <p className="text-text-muted text-sm">{selectedGroupData.name}</p>
                </div>
              </div>
            </div>

            <div className="h-64 mb-6">
              <Pie data={getPieChartData(selectedGroupData)} options={chartOptions} />
            </div>

            <div className="space-y-3">
              {selectedGroupData.expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {expense.member.charAt(0)}
                    </div>
                    <div>
                      <p className="text-text font-medium">{expense.member}</p>
                      <p className="text-text-muted text-sm">{expense.description}</p>
                    </div>
                  </div>
                  <span className="text-text font-bold">
                    {settings.currency}{expense.amount}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chat-style Expense Log */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-text text-lg font-semibold">Activity Feed</h3>
                  <p className="text-text-muted text-sm">Recent transactions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 h-64 overflow-y-auto scrollbar-hide">
              {selectedGroupData.expenses.map((expense, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${expense.member === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    expense.member === 'You'
                      ? 'bg-accent text-white'
                      : 'bg-muted text-text border border-border'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{expense.member}</span>
                      <Calendar className="w-3 h-3 opacity-70" />
                    </div>
                    <p className="text-sm mb-1">{expense.description}</p>
                    <p className="font-bold">{settings.currency}{expense.amount}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-xl text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                />
                <motion.button
                  className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Group Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-text text-lg font-semibold mb-2">Quick Actions</h3>
            <p className="text-text-muted text-sm">Manage your group expenses</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              className="flex items-center space-x-2 bg-muted hover:bg-muted/80 text-text px-4 py-2 rounded-xl font-medium transition-all border border-border"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Add Expense</span>
            </motion.button>
            
            <motion.button
              className="flex items-center space-x-2 bg-muted hover:bg-muted/80 text-text px-4 py-2 rounded-xl font-medium transition-all border border-border"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target className="w-4 h-4" />
              <span>Settle Up</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GroupBudget
