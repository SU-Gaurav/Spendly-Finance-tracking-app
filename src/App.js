import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavigationBar from './components/NavigationBar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Profile from './components/Profile';
import AuthWrapper from './components/AuthWrapper';
import { setupDemoData } from './utils/demoData';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settings, setSettings] = useState({
    currency: '₹',
    monthlyIncome: 0,
    studentStatus: 'undergraduate'
  });

  useEffect(() => {
    if (user) {
      const userPrefix = user.id === 'demo-user-1' ? 'demo-' : '';
      
      const savedTransactions = localStorage.getItem(`${userPrefix}financeTransactions`);
      const savedBudgets = localStorage.getItem(`${userPrefix}financeBudgets`);
      const savedSettings = localStorage.getItem(`${userPrefix}financeSettings`);

      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions([]);
      }
      
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      } else {
        setBudgets([]);
      }
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.currency === '$') {
          parsedSettings.currency = '₹';
        }
        setSettings(parsedSettings);
      } else {
        setSettings({
          currency: user.preferences?.currency || '₹',
          monthlyIncome: user.preferences?.monthlyIncome || 0,
          studentStatus: user.studentStatus || 'undergraduate'
        });
      }
    } else {
      setTransactions([]);
      setBudgets([]);
      setSettings({
        currency: '₹',
        monthlyIncome: 0,
        studentStatus: 'undergraduate'
      });
    }
  }, [user]);

  // Save data to localStorage whenever state changes (user-specific)
  useEffect(() => {
    if (user) {
      const userPrefix = user.id === 'demo-user-1' ? 'demo-' : '';
      localStorage.setItem(`${userPrefix}financeTransactions`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      const userPrefix = user.id === 'demo-user-1' ? 'demo-' : '';
      localStorage.setItem(`${userPrefix}financeBudgets`, JSON.stringify(budgets));
    }
  }, [budgets, user]);

  useEffect(() => {
    if (user) {
      const userPrefix = user.id === 'demo-user-1' ? 'demo-' : '';
      localStorage.setItem(`${userPrefix}financeSettings`, JSON.stringify(settings));
    }
  }, [settings, user]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id, updatedBudget) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updatedBudget } : b));
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth wrapper if user is not logged in
  if (!user) {
    return <AuthWrapper />;
  }

  // Show main app if user is logged in
  return (
    <div className="main-app">
      <NavigationBar />
      <Container fluid className="mt-4 px-4">
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                transactions={transactions}
                budgets={budgets}
                settings={settings}
              />
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <Transactions 
                transactions={transactions}
                addTransaction={addTransaction}
                deleteTransaction={deleteTransaction}
                settings={settings}
              />
            } 
          />
          <Route 
            path="/budget" 
            element={
              <Budget 
                budgets={budgets}
                transactions={transactions}
                addBudget={addBudget}
                updateBudget={updateBudget}
                deleteBudget={deleteBudget}
                settings={settings}
              />
            } 
          />
          <Route 
            path="/reports" 
            element={
              <Reports 
                transactions={transactions}
                budgets={budgets}
                settings={settings}
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings 
                settings={settings}
                setSettings={setSettings}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={<Profile />} 
          />
        </Routes>
      </Container>
    </div>
  );
};

// Main App Component with Auth Provider
function App() {
  useEffect(() => {
    // Set up demo data on app start
    setupDemoData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
