<<<<<<< HEAD
# 💰 Spendly - Finance tracking app
- Add, edit, and delete income/expense transactions
- Categorize transactions for better organization
- Advanced filtering by date, category, and type
- Search functionality for quick access

### 💰 **Budget Management**
- Create and manage budgets by category
- Visual budget utilization tracking
- Overspending alerts and recommendations
- Monthly budget analysis

### 📈 **Advanced Analytics & Reports**
- Expense breakdown by category with pie charts
- Monthly spending trends and patterns
- Budget vs actual performance analysis
- Personalized financial insights and advice
- Exportable reports for financial planning

A modern, feature-rich React-based personal finance tracker designed to help you take control of your finances. Track income, expenses, and budgets with beautiful visualizations and insightful analytics.

![Spendly Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔐 **Secure Authentication**
- User registration and login with encrypted passwords
- Session management with persistent login state
- Secure data storage with bcryptjs encryption

### 📊 **Comprehensive Dashboard**
- Real-time financial overview with key metrics
- Monthly income vs expenses visualization
- Budget tracking with progress indicators
- Quick statistics and insights

### � **Smart Transaction Management**
- Add, edit, and delete income/expense transactions
- Categorize transactions for better organization
- Advanced filtering by date, category, and type
- Search functionality for quick access

### � **Budget Management**
- Create and manage budgets by category
- Visual budget utilization tracking
- Overspending alerts and recommendations
- Monthly budget analysis

### � **Advanced Analytics & Reports**
- Expense breakdown by category with pie charts
- Monthly spending trends and patterns
- Budget vs actual performance analysis
- Personalized financial insights and advice
- Exportable reports for financial planning

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Glassmorphism design with smooth animations
- Dark/light theme compatibility
- Intuitive navigation and user experience

## 🚀 Technologies Used

- **Frontend**: React.js 18.2.0
- **UI Framework**: React Bootstrap 5.3.0
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Bootstrap Icons
- **Authentication**: bcryptjs for password hashing
- **Storage**: Local Storage for data persistence
- **Styling**: Custom CSS with modern design patterns

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (version 16.0 or higher)
- **npm** (version 8.0 or higher) or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/spendly-finance-tracker.git
   cd spendly-finance-tracker
   ```

2. **Install dependencies**:
=======
# 💸 Spendly - Smart Finance Tracker

A modern, responsive personal finance tracker built with React, Vite, Tailwind CSS, and Framer Motion. Track your expenses, manage group budgets, and stay on top of your financial goals with style!

## ✨ Features

### 🏠 Dashboard
- **Overview Cards**: Total spent, weekly budget, and goal progress with animated progress bars
- **Interactive Charts**: Daily/weekly expense visualization using Chart.js
- **Celebration System**: Animated badges with confetti when you save money
- **Shame Mode**: AI-generated roasts with witty messages when you overspend
- **Smart Mascot**: Animated piggy bank that reacts to your spending trends

### 💰 Expense Management
- **Quick Entry Modal**: Stylish modal with blurred background
- **Category Selection**: Floating buttons with modern icons (Food, Transport, Shopping, Entertainment)
- **Smart Inputs**: Auto-complete and quick-add buttons for common expenses
- **Real-time Updates**: Instant feedback and smooth animations

### 👥 Group Budgets
- **Multiple Groups**: Manage expenses with roommates, friends, or travel groups
- **Visual Split**: Pie charts showing who spent what
- **Progress Tracking**: Ring charts for group budget vs spending
- **Chat Interface**: Activity feed with message-style expense logs
- **Settle Up**: Easy expense splitting and settlement

### ⚙️ Settings & Customization
- **Dark/Light Mode**: Toggle between themes
- **Currency Support**: Multiple currency options (₹, $, €, £)
- **Export Options**: Download CSV reports or sync with Google Sheets
- **Shame Mode Toggle**: Enable/disable playful spending alerts
- **Data Management**: Import, export, and reset functionality

## 🎨 Design Features

### Visual Elements
- **3D Cards**: Soft shadows and rounded corners with hover effects
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Gradient Themes**: Vibrant color schemes (indigo-purple, teal-orange)
- **Smooth Animations**: Framer Motion for page transitions and interactions

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layout**: Grid and flex utilities for perfect layouts
- **Touch-Friendly**: Large buttons and gesture support

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Chart.js** - Beautiful, responsive charts
- **Lucide React** - Modern icon library
- **Canvas Confetti** - Celebration animations
- **React Router** - Client-side routing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/spendly.git
   cd spendly
   ```

2. **Install dependencies**
>>>>>>> 66d2cba (Prepare Spendly for public GitHub release: demo data only for demo user, improved light mode, theme toggle, demo login button, code cleanup)
   ```bash
   npm install
   ```

<<<<<<< HEAD
3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📱 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Launches the test runner |
| `npm run eject` | Ejects from Create React App (⚠️ irreversible) |

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── AuthWrapper.js   # Authentication container
│   ├── Dashboard.js     # Main dashboard
│   ├── Transactions.js  # Transaction management
│   ├── Budget.js        # Budget management
│   ├── Reports.js       # Analytics and reports
│   ├── Profile.js       # User profile management
│   ├── Settings.js      # App settings
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication state management
├── utils/              # Utility functions
│   └── demoData.js     # Sample data for demo
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles and themes
```

## 🎯 Key Features Overview

### **Smart Financial Tracking**
- Multi-currency support (₹ as default)
- Category-based expense organization
- Recurring transaction templates
- Real-time balance calculations

### **Intelligent Budgeting**
- Category-wise budget allocation
- Spending limit notifications
- Budget performance tracking
- Automated savings suggestions

### **Comprehensive Analytics**
- Monthly/yearly financial trends
- Category-wise spending analysis
- Budget vs actual comparisons
- Personalized financial advice

### **User Experience**
- One-click transaction entry
- Intuitive category management
- Responsive mobile interface
- Data export capabilities

## 🎮 Demo Account

Experience Spendly with pre-loaded sample data:

**Login Credentials:**
- **Email**: `demo@student.com`
- **Password**: `demo123`

The demo account includes:
- Sample transactions across multiple categories
- Pre-configured budgets
- Various financial scenarios for testing

## 🔧 Configuration

### Currency Settings
- Default currency: Indian Rupee (₹)
- Configurable in user settings
- Multi-currency support available

### Data Storage
- Client-side storage using localStorage
- Automatic data backup and restore
- User-specific data isolation

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow React best practices
- Maintain consistent code styling
- Add meaningful commit messages
- Update documentation as needed

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub with:
- Clear description of the issue/feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable
=======
3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 📱 Usage

### Adding Expenses
1. Click the "Add Expense" button (+ icon)
2. Enter amount, select category, and add description
3. Use quick-add buttons for common amounts
4. Submit to see real-time updates

### Managing Groups
1. Navigate to Groups page
2. Select or create a new group
3. View expense splits and activity
4. Add group expenses and settle up

### Customizing Settings
1. Go to Settings page
2. Toggle dark mode, shame mode, and notifications
3. Change currency and export preferences
4. Manage data and security options

## 🎯 Key Features Showcase

### Shame Mode 🔥
Get playful roasts when overspending:
- "Looks like your wallet is on a diet, but your spending isn't!"
- Animated flame icons and witty messages
- Helps keep you accountable with humor

### Smart Mascot 🐷
Your personal finance companion:
- Reacts to spending patterns
- Provides helpful tips and encouragement
- Animated based on budget progress

### Celebration System 🎉
- Confetti animations for savings milestones
- Animated success messages
- Positive reinforcement for good habits

## 🎨 Color Palette

```css
/* Primary Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--gradient-warning: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
--gradient-danger: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
```

## 🔮 Future Enhancements

- [ ] Firebase integration for real-time data
- [ ] Bank account linking
- [ ] AI-powered spending insights
- [ ] Bill reminders and recurring expenses
- [ ] Advanced reporting and analytics
- [ ] Social features and challenges
- [ ] Investment tracking
- [ ] Budget recommendations
>>>>>>> 66d2cba (Prepare Spendly for public GitHub release: demo data only for demo user, improved light mode, theme toggle, demo login button, code cleanup)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<<<<<<< HEAD
## 🙏 Acknowledgments

- React team for the amazing framework
- Bootstrap team for the UI components
- Chart.js team for beautiful visualizations
- All contributors and users of Spendly

## 📞 Support

- **Email**: support@spendly.com
- **Documentation**: [Wiki](https://github.com/yourusername/spendly-finance-tracker/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/spendly-finance-tracker/issues)

---

<div align="center">

**Made with ❤️ by developers, for better financial management**

[⭐ Star this repo](https://github.com/yourusername/spendly-finance-tracker) | [🍴 Fork it](https://github.com/yourusername/spendly-finance-tracker/fork) | [🐛 Report bugs](https://github.com/yourusername/spendly-finance-tracker/issues)

</div>
=======
## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

Need help? Reach out:
- Email: support@spendly.app
- GitHub Issues: [Report a bug](https://github.com/your-username/spendly/issues)

---

Made with ❤️ for better financial tracking
>>>>>>> 66d2cba (Prepare Spendly for public GitHub release: demo data only for demo user, improved light mode, theme toggle, demo login button, code cleanup)
