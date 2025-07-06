import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import FinancialSummary from './FinancialSummary';
import RecentTransactions from './RecentTransactions';
import BudgetOverview from './BudgetOverview';
import QuickStats from './QuickStats';

const Dashboard = ({ transactions, budgets, settings }) => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  });

  // Calculate totals
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Calculate total budget
  const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
  const budgetUsed = budgets.reduce((sum, budget) => {
    const categoryExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((catSum, t) => catSum + parseFloat(t.amount), 0);
    return sum + categoryExpenses;
  }, 0);

  return (
    <div className="fade-in-up">
      <Row className="mb-4">
        <Col>
          <div className="dashboard-header spacing-minimal">
            <h1 className="text-primary dashboard-title title-minimal">
              <i className="bi bi-house me-3 icon-minimal"></i>
              Dashboard
            </h1>
            <div className="dashboard-subtitle spacing-compact">
              <h4 className="text-white mb-1 subtitle-minimal">{format(currentDate, 'MMMM yyyy')}</h4>
              <p className="text-muted-soft">Welcome back! Here's your financial overview for this month.</p>
            </div>
          </div>
        </Col>
      </Row>

      <FinancialSummary 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        totalBudget={totalBudget}
        budgetUsed={budgetUsed}
        settings={settings}
      />

      <Row className="mb-4">
        <Col lg={8}>
          <RecentTransactions 
            transactions={transactions.slice(0, 5)}
            settings={settings}
          />
        </Col>
        <Col lg={4}>
          <QuickStats 
            transactions={currentMonthTransactions}
            settings={settings}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <BudgetOverview 
            budgets={budgets}
            transactions={currentMonthTransactions}
            settings={settings}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
