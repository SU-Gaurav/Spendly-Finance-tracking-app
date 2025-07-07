import React, { createContext, useContext, useState, useEffect } from 'react'

const SpendlyContext = createContext()

export const useSpendly = () => {
  const context = useContext(SpendlyContext)
  if (!context) {
    throw new Error('useSpendly must be used within a SpendlyProvider')
  }
  return context
}

export const SpendlyProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 120,
      category: 'food',
      description: 'Lunch at cafe',
      date: '2025-07-07',
      time: '12:30'
    },
    {
      id: 2,
      amount: 50,
      category: 'transport',
      description: 'Uber ride',
      date: '2025-07-06',
      time: '18:45'
    },
    {
      id: 3,
      amount: 200,
      category: 'shopping',
      description: 'New shirt',
      date: '2025-07-05',
      time: '16:20'
    }
  ])

  const [budget, setBudget] = useState({
    weekly: 2000,
    monthly: 8000
  })

  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Roommates',
      budget: 5000,
      spent: 3200,
      members: ['You', 'John', 'Sarah'],
      expenses: [
        { member: 'You', amount: 1200, description: 'Groceries' },
        { member: 'John', amount: 1000, description: 'Utilities' },
        { member: 'Sarah', amount: 1000, description: 'Internet' }
      ]
    },
    {
      id: 2,
      name: 'Trip to Manali',
      budget: 15000,
      spent: 8500,
      members: ['You', 'Alex', 'Mike', 'Lisa'],
      expenses: [
        { member: 'You', amount: 2500, description: 'Hotel booking' },
        { member: 'Alex', amount: 3000, description: 'Car rental' },
        { member: 'Mike', amount: 2000, description: 'Food & drinks' },
        { member: 'Lisa', amount: 1000, description: 'Activities' }
      ]
    }
  ])

  const [settings, setSettings] = useState({
    darkMode: false,
    shameMode: true,
    currency: '₹',
    notifications: true
  })

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    }
    setExpenses(prev => [newExpense, ...prev])
  }

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  // Calculate stats
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const weeklySpent = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return expenseDate >= oneWeekAgo
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const budgetProgress = (weeklySpent / budget.weekly) * 100
  const isOverBudget = weeklySpent > budget.weekly

  const value = {
    expenses,
    budget,
    groups,
    settings,
    totalSpent,
    weeklySpent,
    budgetProgress,
    isOverBudget,
    addExpense,
    deleteExpense,
    updateSettings,
    setBudget
  }

  return (
    <SpendlyContext.Provider value={value}>
      {children}
    </SpendlyContext.Provider>
  )
}
