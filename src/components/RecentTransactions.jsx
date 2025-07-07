import React from 'react'
import { motion } from 'framer-motion'
import { Clock, ShoppingBag, Car, Coffee, Gamepad2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'

const RecentTransactions = () => {
  const { expenses, deleteExpense, settings } = useSpendly()
  const { theme } = useTheme()

  const getCategoryIcon = (category) => {
    const icons = {
      food: Coffee,
      shopping: ShoppingBag,
      transport: Car,
      entertainment: Gamepad2,
      default: MoreHorizontal
    }
    return icons[category] || icons.default
  }

  const recentExpenses = expenses.slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-lg h-96"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-text text-lg font-semibold">Recent Transactions</h3>
            <p className="text-text-muted text-sm">Latest {recentExpenses.length} expenses</p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3 overflow-y-auto scrollbar-hide h-64">
        {recentExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <Coffee className="w-12 h-12 mb-3 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Start tracking your expenses!</p>
          </div>
        ) : (
          recentExpenses.map((expense, index) => {
            const Icon = getCategoryIcon(expense.category)
            
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-center justify-between p-4 bg-muted rounded-xl border border-border hover:bg-muted/80 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h4 className="text-text font-medium">{expense.description}</h4>
                    <div className="flex items-center space-x-2 text-text-muted text-sm">
                      <span className="capitalize">{expense.category}</span>
                      <span>•</span>
                      <span>{expense.date}</span>
                      <span>•</span>
                      <span>{expense.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-text font-bold text-lg">
                      -{settings.currency}{expense.amount}
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => deleteExpense(expense.id)}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Footer */}
      {recentExpenses.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">
              Total: {settings.currency}{recentExpenses.reduce((sum, exp) => sum + exp.amount, 0)}
            </span>
            <motion.button
              className="text-accent hover:text-accent/80 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All →
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default RecentTransactions
