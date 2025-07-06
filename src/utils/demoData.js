import bcrypt from 'bcryptjs';

export const createDemoUser = async () => {
  const demoPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = {
    id: 'demo-user-1',
    username: 'demo_student',
    email: 'demo@student.com',
    firstName: 'Alex',
    lastName: 'Student',
    studentStatus: 'undergraduate',
    password: demoPassword,
    createdAt: new Date('2024-01-01').toISOString(),
    avatar: 'AS',
    preferences: {
      currency: '₹',
      monthlyIncome: 25000,
      theme: 'default'
    }
  };

  const demoTransactions = [
    {
      id: '1',
      type: 'income',
      amount: '18000',
      description: 'Part-time job - Coffee shop',
      category: 'part-time',
      date: new Date('2024-12-01').toISOString()
    },
    {
      id: '2',
      type: 'income',
      amount: '12000',
      description: 'Monthly allowance from parents',
      category: 'allowance',
      date: new Date('2024-12-01').toISOString()
    },
    {
      id: '3',
      type: 'expense',
      amount: '8000',
      description: 'Groceries for the month',
      category: 'food',
      date: new Date('2024-12-02').toISOString()
    },
    {
      id: '4',
      type: 'expense',
      amount: '1500',
      description: 'Bus pass',
      category: 'transport',
      date: new Date('2024-12-03').toISOString()
    },
    {
      id: '5',
      type: 'expense',
      amount: '4500',
      description: 'Computer Science textbook',
      category: 'books',
      date: new Date('2024-12-05').toISOString()
    },
    {
      id: '6',
      type: 'expense',
      amount: '800',
      description: 'Movie tickets',
      category: 'entertainment',
      date: new Date('2024-12-07').toISOString()
    },
    {
      id: '7',
      type: 'expense',
      amount: '600',
      description: 'Coffee with friends',
      category: 'food',
      date: new Date('2024-12-08').toISOString()
    },
    {
      id: '8',
      type: 'expense',
      amount: '12000',
      description: 'Monthly rent - shared apartment',
      category: 'housing',
      date: new Date('2024-12-10').toISOString()
    },
    {
      id: '9',
      type: 'expense',
      amount: '499',
      description: 'Netflix subscription',
      category: 'entertainment',
      date: new Date('2024-12-12').toISOString()
    },
    {
      id: '10',
      type: 'expense',
      amount: '2500',
      description: 'Dining out with study group',
      category: 'food',
      date: new Date('2024-12-15').toISOString()
    }
  ];

  const demoBudgets = [
    {
      id: '1',
      category: 'food',
      amount: '12000',
      description: 'Monthly food budget including groceries and dining'
    },
    {
      id: '2',
      category: 'transport',
      amount: '3000',
      description: 'Public transportation and occasional rides'
    },
    {
      id: '3',
      category: 'entertainment',
      amount: '4000',
      description: 'Movies, subscriptions, and social activities'
    },
    {
      id: '4',
      category: 'books',
      amount: '6000',
      description: 'Textbooks and academic materials'
    },
    {
      id: '5',
      category: 'housing',
      amount: '15000',
      description: 'Rent and utilities for shared apartment'
    }
  ];

  return {
    user: demoUser,
    transactions: demoTransactions,
    budgets: demoBudgets
  };
};

export const setupDemoData = async () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const demoExists = users.find(u => u.email === 'demo@student.com');
  
  if (!demoExists) {
    const demoData = await createDemoUser();
    users.push(demoData.user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set up demo data for the demo user
    localStorage.setItem('demo-financeTransactions', JSON.stringify(demoData.transactions));
    localStorage.setItem('demo-financeBudgets', JSON.stringify(demoData.budgets));
    localStorage.setItem('demo-financeSettings', JSON.stringify({
      currency: '₹',
      monthlyIncome: 25000,
      studentStatus: 'undergraduate'
    }));
  }
};
