import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import ExpenseEntry from './components/ExpenseEntry'
import GroupBudget from './components/GroupBudget'
import Settings from './components/Settings'
import Navigation from './components/Navigation'
import { SpendlyProvider } from './contexts/SpendlyContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Protected Route Component
const ProtectedApp = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const { currentUser } = useAuth()

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-primary">
        <Login />
      </div>
    )
  }

  return (
    <SpendlyProvider>
      <Router>
        <div className="min-h-screen bg-primary">
          <Navigation onAddExpense={() => setShowExpenseModal(true)} />
          
          <main className="pt-20 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <motion.div
                        key="dashboard"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <Dashboard />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/groups"
                    element={
                      <motion.div
                        key="groups"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <GroupBudget />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <motion.div
                        key="settings"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <Settings />
                      </motion.div>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>

          <AnimatePresence>
            {showExpenseModal && (
              <ExpenseEntry onClose={() => setShowExpenseModal(false)} />
            )}
          </AnimatePresence>
        </div>
      </Router>
    </SpendlyProvider>
  )
}

// Main App Component with Providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
