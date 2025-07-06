import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.preferences?.currency === '$') {
        parsedUser.preferences.currency = '₹';
        localStorage.setItem('currentUser', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const { username, email, password, firstName, lastName, studentStatus } = userData;
      
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.find(u => u.email === email || u.username === username);
      
      if (userExists) {
        throw new Error('User with this email or username already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        firstName,
        lastName,
        studentStatus,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
        preferences: {
          currency: '₹',
          monthlyIncome: 0,
          theme: 'default'
        }
      };

      // Save user to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Remove password from user object for session
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email || u.username === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Remove password from user object for session
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array too
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const deleteAccount = () => {
    if (user) {
      // Remove user from users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      
      // Clear user data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('financeTransactions');
      localStorage.removeItem('financeBudgets');
      localStorage.removeItem('financeSettings');
      
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
