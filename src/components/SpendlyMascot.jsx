import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PiggyBank, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'

const SpendlyMascot = () => {
  const { weeklySpent, budget, isOverBudget, budgetProgress } = useSpendly()
  const { theme } = useTheme()
  const [mascotMood, setMascotMood] = useState('happy')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isOverBudget) {
      setMascotMood('worried')
      setMessage("Oops! We're over budget. Time to be more careful! 💸")
    } else if (budgetProgress > 80) {
      setMascotMood('concerned')
      setMessage("Getting close to the limit. Let's slow down a bit! 🎯")
    } else if (budgetProgress > 50) {
      setMascotMood('neutral')
      setMessage("We're doing okay! Keep tracking those expenses! 📊")
    } else {
      setMascotMood('happy')
      setMessage("Great job! We're well within budget! 🎉")
    }
  }, [budgetProgress, isOverBudget])

  const getMascotColor = () => {
    switch (mascotMood) {
      case 'worried':
        return 'bg-red-500'
      case 'concerned':
        return 'bg-yellow-500'
      case 'neutral':
        return 'bg-accent'
      default:
        return 'bg-green-500'
    }
  }

  const getMascotAnimation = () => {
    switch (mascotMood) {
      case 'worried':
        return 'animate-wiggle'
      case 'concerned':
        return 'animate-pulse'
      default:
        return 'animate-float'
    }
  }

  const getEmoji = () => {
    switch (mascotMood) {
      case 'worried':
        return '😰'
      case 'concerned':
        return '😟'
      case 'neutral':
        return '🙂'
      default:
        return '😊'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-6">
        {/* Mascot */}
        <motion.div
          className={`relative w-24 h-24 ${getMascotColor()} rounded-2xl flex items-center justify-center shadow-lg ${getMascotAnimation()}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <PiggyBank className="w-12 h-12 text-white" />
          
          {/* Emoji overlay */}
          <motion.div
            className="absolute -top-2 -right-2 text-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {getEmoji()}
          </motion.div>

          {/* Trend indicator */}
          <motion.div
            className="absolute -bottom-2 -left-2 w-8 h-8 bg-muted rounded-full flex items-center justify-center backdrop-blur-sm"
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isOverBudget ? (
              <TrendingUp className="w-4 h-4 text-red-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-400" />
            )}
          </motion.div>
        </motion.div>

        {/* Message */}
        <div className="flex-1">
          <div className="bg-muted rounded-2xl p-4 border border-border relative">
            {/* Speech bubble pointer */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
              <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-muted"></div>
            </div>
            
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-text font-medium"
            >
              {message}
            </motion.p>
            
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-text-muted">Your Spendly Assistant</span>
              <div className="flex items-center space-x-2 text-text-muted">
                <Target className="w-4 h-4" />
                <span>{budgetProgress.toFixed(1)}% of budget used</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <motion.button
          className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-text text-sm font-medium transition-all duration-300 border border-border"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          💡 Get Tips
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-text text-sm font-medium transition-all duration-300 border border-border"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          📊 View Report
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-text text-sm font-medium transition-all duration-300 border border-border"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          🎯 Set Goal
        </motion.button>
      </div>
    </motion.div>
  )
}

export default SpendlyMascot
