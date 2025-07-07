import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Users, Settings, Plus, PiggyBank, LogOut } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const Navigation = ({ onAddExpense }) => {
  const location = useLocation()
  const { isDark } = useTheme()
  const { logout, currentUser } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Top Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary"
        style={{ backgroundColor: 'var(--bg-card)' }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <span className="text-primary font-bold text-xl">Spendly</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-secondary hover:text-primary'
                      }`}
                      style={{ 
                        backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                        color: isActive ? 'white' : 'var(--text-secondary)'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                onClick={onAddExpense}
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: 'var(--accent-secondary)' }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Expense</span>
              </motion.button>

              {/* User Avatar and Logout */}
              <motion.div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="text-text-muted hover:text-text p-2 rounded-xl transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Bottom Navigation (Mobile) */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-primary"
        style={{ backgroundColor: 'var(--bg-card)' }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300`}
                  style={{ 
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
          
          <motion.button
            onClick={onAddExpense}
            className="flex flex-col items-center space-y-1 p-2"
            style={{ color: 'var(--accent-secondary)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: 'var(--accent-secondary)' }}
            >
              <Plus className="w-6 h-6 text-white" />
            </div>
          </motion.button>
        </div>
      </motion.nav>
    </>
  )
}

export default Navigation
