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
  Palette,
  User,
  Globe,
  Volume2,
  Eye,
  Smartphone,
  Check,
  X,
  Info,
  ExternalLink
} from 'lucide-react'
import { useSpendly } from '../contexts/SpendlyContext'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const ImprovedSettings = () => {
  const { settings, updateSettings, expenses, resetData } = useSpendly()
  const { theme, toggleTheme, isDark } = useTheme()
  const { currentUser } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleToggle = (setting) => {
    updateSettings({ [setting]: !settings[setting] })
    showToast(`${setting.charAt(0).toUpperCase() + setting.slice(1)} ${!settings[setting] ? 'enabled' : 'disabled'}`)
  }

  const handleCurrencyChange = (currency) => {
    updateSettings({ currency })
    showToast(`Currency changed to ${currency}`)
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
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
      
      showToast('Data exported successfully!')
    } catch (error) {
      showToast('Export failed. Please try again.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleReset = async () => {
    try {
      await resetData()
      setShowResetConfirm(false)
      showToast('All data has been reset')
    } catch (error) {
      showToast('Reset failed. Please try again.', 'error')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
    { id: 'support', label: 'Help & Support', icon: HelpCircle }
  ]

  const currencies = [
    { code: '$', name: 'US Dollar' },
    { code: '€', name: 'Euro' },
    { code: '£', name: 'British Pound' },
    { code: '¥', name: 'Japanese Yen' },
    { code: '₹', name: 'Indian Rupee' },
    { code: 'C$', name: 'Canadian Dollar' },
    { code: 'A$', name: 'Australian Dollar' }
  ]

  const SettingToggle = ({ enabled, onChange, label, description, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-card-hover transition-colors">
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent" />
          </div>
        )}
        <div>
          <div className="font-medium text-primary">{label}</div>
          {description && <div className="text-sm text-muted">{description}</div>}
        </div>
      </div>
      <motion.button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors focus-ring ${
          enabled ? 'bg-accent' : 'bg-border-secondary'
        }`}
        whileTap={{ scale: 0.95 }}
        aria-label={`${enabled ? 'Disable' : 'Enable'} ${label}`}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  )

  const SettingCard = ({ title, description, children, icon: Icon }) => (
    <motion.div variants={itemVariants} className="card p-6">
      <div className="flex items-center space-x-3 mb-4">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-primary">{title}</h3>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <SettingCard 
        title="Currency" 
        description="Choose your preferred currency for displaying amounts"
        icon={DollarSign}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currencies.map((currency) => (
            <motion.button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                settings.currency === currency.code
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border-primary text-primary hover:border-accent/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-semibold">{currency.code}</div>
              <div className="text-xs opacity-80">{currency.name}</div>
            </motion.button>
          ))}
        </div>
      </SettingCard>

      <SettingCard 
        title="Spending Behavior" 
        description="Customize how Spendly tracks and responds to your spending"
        icon={Flame}
      >
        <div className="space-y-1">
          <SettingToggle
            enabled={settings.shameMode}
            onChange={() => handleToggle('shameMode')}
            label="Shame Mode"
            description="Get humorous reminders when you overspend"
            icon={Flame}
          />
          <SettingToggle
            enabled={settings.celebrations}
            onChange={() => handleToggle('celebrations')}
            label="Celebrations"
            description="Celebrate when you stay under budget"
          />
          <SettingToggle
            enabled={settings.weeklyReset}
            onChange={() => handleToggle('weeklyReset')}
            label="Weekly Budget Reset"
            description="Automatically reset your budget every week"
          />
        </div>
      </SettingCard>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <SettingCard 
        title="Theme" 
        description="Customize the appearance of your app"
        icon={Palette}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                {isDark ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-accent" />}
              </div>
              <div>
                <div className="font-medium text-primary">Dark Mode</div>
                <div className="text-sm text-muted">Toggle between light and dark themes</div>
              </div>
            </div>
            <motion.button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors focus-ring ${
                isDark ? 'bg-accent' : 'bg-border-secondary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center"
                animate={{ x: isDark ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {isDark ? <Moon className="w-2 h-2 text-gray-600" /> : <Sun className="w-2 h-2 text-gray-600" />}
              </motion.div>
            </motion.button>
          </div>

          <SettingToggle
            enabled={settings.animations}
            onChange={() => handleToggle('animations')}
            label="Animations"
            description="Enable smooth animations and transitions"
          />
          
          <SettingToggle
            enabled={settings.compactMode}
            onChange={() => handleToggle('compactMode')}
            label="Compact Mode"
            description="Show more content in less space"
          />
        </div>
      </SettingCard>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <SettingCard 
        title="Notifications" 
        description="Control when and how you receive notifications"
        icon={Bell}
      >
        <div className="space-y-1">
          <SettingToggle
            enabled={settings.budgetAlerts}
            onChange={() => handleToggle('budgetAlerts')}
            label="Budget Alerts"
            description="Get notified when approaching your budget limit"
            icon={Bell}
          />
          <SettingToggle
            enabled={settings.dailyReminders}
            onChange={() => handleToggle('dailyReminders')}
            label="Daily Reminders"
            description="Daily prompts to log your expenses"
          />
          <SettingToggle
            enabled={settings.weeklyReports}
            onChange={() => handleToggle('weeklyReports')}
            label="Weekly Reports"
            description="Receive weekly spending summaries"
          />
          <SettingToggle
            enabled={settings.soundEffects}
            onChange={() => handleToggle('soundEffects')}
            label="Sound Effects"
            description="Play sounds for various actions"
            icon={Volume2}
          />
        </div>
      </SettingCard>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <SettingCard 
        title="Export Data" 
        description="Download your expense data"
        icon={Download}
      >
        <motion.button
          onClick={handleExport}
          disabled={isExporting}
          className="btn btn-primary w-full sm:w-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExporting ? (
            <>
              <div className="loading-spinner" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export to CSV
            </>
          )}
        </motion.button>
      </SettingCard>

      <SettingCard 
        title="Reset Data" 
        description="Permanently delete all your expense data"
        icon={Trash2}
      >
        <div className="space-y-4">
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2 text-error">
              <Info className="w-5 h-5" />
              <span className="font-medium">Warning</span>
            </div>
            <p className="text-sm text-error/80 mt-1">
              This action cannot be undone. All your expenses, budgets, and settings will be permanently deleted.
            </p>
          </div>
          
          {!showResetConfirm ? (
            <motion.button
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-secondary border-error text-error hover:bg-error hover:text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </motion.button>
          ) : (
            <div className="flex space-x-3">
              <motion.button
                onClick={handleReset}
                className="btn btn-primary bg-error border-error hover:bg-error/90"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4" />
                Confirm Reset
              </motion.button>
              <motion.button
                onClick={() => setShowResetConfirm(false)}
                className="btn btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
            </div>
          )}
        </div>
      </SettingCard>
    </div>
  )

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <SettingCard 
        title="Profile" 
        description="Manage your account information"
        icon={User}
      >
        <div className="flex items-center space-x-4 p-4 bg-card-hover rounded-lg">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-lg font-bold">
            {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium text-primary">
              {currentUser?.displayName || 'User'}
            </div>
            <div className="text-sm text-muted">{currentUser?.email}</div>
          </div>
        </div>
      </SettingCard>
    </div>
  )

  const renderSupportSettings = () => (
    <div className="space-y-6">
      <SettingCard 
        title="Help & Support" 
        description="Get help and provide feedback"
        icon={HelpCircle}
      >
        <div className="space-y-3">
          <motion.button
            className="btn btn-secondary w-full justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Documentation</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="btn btn-secondary w-full justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Report a Bug</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="btn btn-secondary w-full justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Send Feedback</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </SettingCard>

      <SettingCard title="About Spendly">
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold text-primary">Spendly v2.0.0</div>
          <div className="text-sm text-muted">Personal finance made simple</div>
          <div className="text-xs text-muted">© 2025 Spendly. All rights reserved.</div>
        </div>
      </SettingCard>
    </div>
  )

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted">Customize your Spendly experience</p>
      </motion.div>

      {/* Navigation */}
      <motion.div variants={itemVariants}>
        <div className="flex overflow-x-auto scrollbar-hide border-b border-border-primary">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-primary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{section.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants}>
        {activeSection === 'general' && renderGeneralSettings()}
        {activeSection === 'appearance' && renderAppearanceSettings()}
        {activeSection === 'notifications' && renderNotificationSettings()}
        {activeSection === 'data' && renderDataSettings()}
        {activeSection === 'account' && renderAccountSettings()}
        {activeSection === 'support' && renderSupportSettings()}
      </motion.div>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div className={`status-indicator ${toast.type}`} />
          <span className="font-medium">{toast.message}</span>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ImprovedSettings
