import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Flame, 
  Download, 
  Upload, 
  Bell, 
  DollarSign,
  Trash2,
  RefreshCw,
  Shield,
  HelpCircle,
  Palette
} from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'

const Settings = () => {
  const { settings, updateSettings, expenses } = useSpendly()
  const { theme, toggleTheme, isDark } = useTheme()
  const [isExporting, setIsExporting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleToggle = (setting) => {
    updateSettings({ [setting]: !settings[setting] })
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create CSV data
    const csvData = expenses.map(expense => 
      `${expense.date},${expense.category},${expense.description},${expense.amount}`
    ).join('\n')
    
    const csvContent = `Date,Category,Description,Amount\n${csvData}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = 'spendly-expenses.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    
    setIsExporting(false)
  }

  const handleReset = () => {
    // Reset functionality would go here
    setShowResetConfirm(false)
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

  const SettingCard = ({ icon: Icon, title, description, children, danger = false }) => (
    <motion.div
      variants={itemVariants}
      className="card p-6"
      style={{
        borderColor: danger ? 'var(--error)' : 'var(--border-primary)'
      }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ 
            backgroundColor: danger ? 'var(--error)' : 'var(--accent-primary)'
          }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-primary font-semibold">{title}</h3>
          <p className="text-secondary text-sm">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  )

  const Toggle = ({ checked, onChange, label, icon: Icon }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-4 h-4 text-muted" />}
        <span className="text-primary">{label}</span>
      </div>
      <motion.button
        onClick={onChange}
        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
          checked ? 'theme-switch active' : 'theme-switch'
        }`}
        style={{ 
          backgroundColor: checked ? 'var(--accent-primary)' : 'var(--border-secondary)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow-lg"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
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
          Settings ⚙️
        </h1>
        <p className="text-secondary text-lg">
          Customize your Spendly experience
        </p>
      </motion.div>

      {/* Appearance Settings */}
      <SettingCard
        icon={Palette}
        title="Appearance"
        description="Customize the look and feel"
      >
        <div className="space-y-4">
          <Toggle
            checked={isDark}
            onChange={toggleTheme}
            label={`${isDark ? 'Dark' : 'Light'} Mode`}
            icon={isDark ? Moon : Sun}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted" />
              <span className="text-primary">Currency</span>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="rounded-xl px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <option value="₹">₹ INR</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>
          </div>
        </div>
      </SettingCard>

      {/* Notification Settings */}
      <SettingCard
        icon={Bell}
        title="Notifications"
        description="Manage your notification preferences"
      >
        <div className="space-y-4">
          <Toggle
            checked={settings.notifications}
            onChange={() => handleToggle('notifications')}
            label="Push Notifications"
            icon={Bell}
          />
          <Toggle
            checked={settings.shameMode}
            onChange={() => handleToggle('shameMode')}
            label="Shame Mode"
            icon={Flame}
          />
          <p className="text-muted text-xs mt-2">
            Get playful roasts when you overspend to help you stay on track! 🔥
          </p>
        </div>
      </SettingCard>

      {/* Data Management */}
      <SettingCard
        icon={Download}
        title="Data Management"
        description="Export, import, and sync your data"
      >
        <div className="space-y-4">
          <motion.button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExporting ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-t-transparent rounded-full"
                  style={{ borderColor: 'var(--text-muted)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </>
            )}
          </motion.button>

          <motion.button
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-4 h-4" />
            <span>Sync with Google Sheets</span>
          </motion.button>
        </div>
      </SettingCard>

      {/* Security Settings */}
      <SettingCard
        icon={Shield}
        title="Security & Privacy"
        description="Protect your financial data"
      >
        <div className="space-y-4">
          <motion.button
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-4 h-4" />
            <span>Change Password</span>
          </motion.button>

          <motion.button
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span>Download Data</span>
          </motion.button>
        </div>
      </SettingCard>

      {/* Help & Support */}
      <SettingCard
        icon={HelpCircle}
        title="Help & Support"
        description="Get help and provide feedback"
      >
        <div className="space-y-4">
          <motion.button
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Center</span>
          </motion.button>

          <motion.button
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>📧</span>
            <span>Contact Support</span>
          </motion.button>
        </div>
      </SettingCard>

      {/* Danger Zone */}
      <SettingCard
        icon={Trash2}
        title="Danger Zone"
        description="Irreversible actions"
        danger={true}
      >
        <div className="space-y-4">
          {!showResetConfirm ? (
            <motion.button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: isDark ? '#2E1A1A' : '#FEF2F2',
                borderColor: 'var(--error)',
                color: 'var(--error)',
                border: '1px solid var(--error)'
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Data</span>
            </motion.button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-center" style={{ color: 'var(--error)' }}>
                ⚠️ This will permanently delete all your expenses and cannot be undone!
              </p>
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-xl font-medium transition-all"
                  style={{ backgroundColor: 'var(--error)', color: 'white' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Yes, Reset
                </motion.button>
                <motion.button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </SettingCard>

      {/* App Info */}
      <motion.div
        variants={itemVariants}
        className="text-center text-muted text-sm"
      >
        <p>Spendly v1.0.0</p>
        <p>Made with ❤️ for better financial tracking</p>
        <p className="mt-2">Current theme: <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>{isDark ? 'Dark' : 'Light'}</span></p>
      </motion.div>
    </motion.div>
  )
}

export default Settings
