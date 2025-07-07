import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, DollarSign, Coffee, Car, ShoppingBag, Gamepad2, Calendar, FileText, Sparkles } from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'

const ExpenseEntry = ({ onClose }) => {
  const { addExpense, settings } = useSpendly()
  const { theme } = useTheme()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { id: 'food', label: 'Food & Dining', icon: Coffee, emoji: '🍕' },
    { id: 'transport', label: 'Transport', icon: Car, emoji: '🚕' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, emoji: '🛍️' },
    { id: 'entertainment', label: 'Entertainment', icon: Gamepad2, emoji: '🎮' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || !category || !description) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    addExpense({
      amount: parseFloat(amount),
      category,
      description
    })
    
    setIsSubmitting(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-text text-xl font-bold">Add Expense</h2>
                <p className="text-text-muted text-sm">Track your spending</p>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-xl flex items-center justify-center text-text-muted hover:text-text transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-text text-sm font-medium mb-2">
                Amount
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted text-lg font-bold">
                  {settings.currency}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-xl text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all text-lg font-semibold"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-text text-sm font-medium mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        category === cat.id
                          ? 'border-accent bg-accent/10 shadow-lg'
                          : 'border-border bg-muted hover:bg-muted/80'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{cat.emoji}</span>
                        </div>
                        <span className="text-text text-sm font-medium text-center">
                          {cat.label}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-text text-sm font-medium mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-text-muted" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you spend on?"
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-xl text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!amount || !category || !description || isSubmitting}
              className="w-full py-4 bg-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Add Expense</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Add Buttons */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-text-muted text-sm mb-3">Quick Add</p>
            <div className="flex space-x-2">
              {[
                { amount: 50, label: '₹50', desc: 'Coffee' },
                { amount: 150, label: '₹150', desc: 'Lunch' },
                { amount: 500, label: '₹500', desc: 'Shopping' },
              ].map((quick) => (
                <motion.button
                  key={quick.amount}
                  type="button"
                  onClick={() => {
                    setAmount(quick.amount.toString())
                    setDescription(quick.desc)
                  }}
                  className="flex-1 py-2 px-3 bg-muted hover:bg-muted/80 rounded-xl text-text text-sm font-medium transition-all border border-border"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {quick.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ExpenseEntry
