import React, { useState } from 'react';
import { Row, Col, Card, Form, Tab, Tabs } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths, eachMonthOfInterval } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

const Reports = ({ transactions, budgets, settings }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
  const currentDate = new Date();
  const getDateRange = () => {
    switch (selectedPeriod) {
      case 'current':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      case 'last3':
        return {
          start: startOfMonth(subMonths(currentDate, 2)),
          end: endOfMonth(currentDate)
        };
      case 'last6':
        return {
          start: startOfMonth(subMonths(currentDate, 5)),
          end: endOfMonth(currentDate)
        };
      default:
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
    }
  };

  const dateRange = getDateRange();
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, dateRange);
  });

  // Expense by Category Data
  const expensesByCategory = {};
  filteredTransactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const category = transaction.category;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + parseFloat(transaction.amount);
    });

  const categoryColors = {
    food: '#ff6b6b',
    transport: '#4ecdc4',
    entertainment: '#45b7d1',
    books: '#96ceb4',
    housing: '#ffeaa7',
    other: '#a29bfe'
  };

  const pieData = {
    labels: Object.keys(expensesByCategory).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: Object.keys(expensesByCategory).map(cat => categoryColors[cat] || '#a29bfe'),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Monthly Trends Data
  const monthlyData = {};
  if (selectedPeriod !== 'current') {
    const months = eachMonthOfInterval(dateRange);
    months.forEach(month => {
      const monthKey = format(month, 'MMM yyyy');
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return isWithinInterval(tDate, { start: monthStart, end: monthEnd });
      });

      monthlyData[monthKey] = {
        income: monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0),
        expenses: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0)
      };
    });
  }

  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map(d => d.income),
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyData).map(d => d.expenses),
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
        tension: 0.4
      }
    ]
  };

  // Budget vs Actual Data
  const budgetData = budgets.map(budget => {
    const categoryExpenses = filteredTransactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      category: budget.category,
      budgeted: parseFloat(budget.amount),
      actual: categoryExpenses
    };
  });

  const budgetChartData = {
    labels: budgetData.map(d => d.category.charAt(0).toUpperCase() + d.category.slice(1)),
    datasets: [
      {
        label: 'Budgeted',
        data: budgetData.map(d => d.budgeted),
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1
      },
      {
        label: 'Actual',
        data: budgetData.map(d => d.actual),
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return settings.currency + value;
          }
        }
      }
    }
  };

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="fade-in-up">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="page-header">
              <h1 className="text-primary page-title">
                <i className="bi bi-bar-chart me-3"></i>
                Financial Reports
              </h1>
              <p className="text-muted">Analyze your spending patterns and financial health</p>
            </div>
            <div className="period-selector">
              <Form.Select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="enhanced-select"
              >
                <option value="current">Current Month</option>
                <option value="last3">Last 3 Months</option>
                <option value="last6">Last 6 Months</option>
              </Form.Select>
            </div>
          </div>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="income-card text-center glass-strong">
            <Card.Body>
              <div className="report-icon mb-3">
                <i className="bi bi-arrow-up-circle"></i>
              </div>
              <h4 className="text-white mt-2">{settings.currency}{totalIncome.toFixed(2)}</h4>
              <small className="text-white-50">Total Income</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="expense-card text-center glass-strong">
            <Card.Body>
              <div className="report-icon mb-3">
                <i className="bi bi-arrow-down-circle"></i>
              </div>
              <h4 className="text-white mt-2">{settings.currency}{totalExpenses.toFixed(2)}</h4>
              <small className="text-white-50">Total Expenses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`${balance >= 0 ? 'savings-card' : 'expense-card'} text-center glass-strong`}>
            <Card.Body>
              <div className="report-icon mb-3">
                <i className={`bi bi-wallet2`}></i>
              </div>
              <h4 className={`mt-2 text-white`}>
                {settings.currency}{balance.toFixed(2)}
              </h4>
              <small className="text-white-50">Net Balance</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="budget-card text-center glass-strong">
            <Card.Body>
              <div className="report-icon mb-3">
                <i className="bi bi-percent"></i>
              </div>
              <h4 className={`mt-2 text-white`}>
                {savingsRate.toFixed(1)}%
              </h4>
              <small className="text-white-50">Savings Rate</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Tabs defaultActiveKey="expenses" className="mb-4 enhanced-tabs">
        <Tab eventKey="expenses" title="Expense Breakdown">
          <Row>
            <Col lg={8}>
              <Card className="chart-card">
                <Card.Header className="chart-header">
                  <h5 className="mb-0 text-white">
                    <i className="bi bi-pie-chart me-2"></i>
                    Expenses by Category
                  </h5>
                </Card.Header>
                <Card.Body>
                  {Object.keys(expensesByCategory).length > 0 ? (
                    <div className="chart-container">
                      <Pie data={pieData} options={chartOptions} />
                    </div>
                  ) : (
                    <div className="empty-chart-state">
                      <div className="empty-state-icon mb-3">
                        <i className="bi bi-pie-chart"></i>
                      </div>
                      <p className="text-muted mt-3">No expense data for selected period</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="details-card">
                <Card.Header className="chart-header">
                  <h5 className="mb-0 text-white">
                    <i className="bi bi-list-ul me-2"></i>
                    Category Details
                  </h5>
                </Card.Header>
                <Card.Body>
                  {Object.entries(expensesByCategory).map(([category, amount]) => {
                    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                    return (
                      <div key={category} className="category-detail-item">
                        <div className="d-flex align-items-center">
                          <div 
                            className="category-color-indicator me-3"
                            style={{
                              backgroundColor: categoryColors[category] || '#a29bfe',
                            }}
                          ></div>
                          <span className="text-capitalize text-white">{category}</span>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-white">{settings.currency}{amount.toFixed(2)}</div>
                          <small className="text-muted">{percentage.toFixed(1)}%</small>
                        </div>
                      </div>
                    );
                  })}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {selectedPeriod !== 'current' && (
          <Tab eventKey="trends" title="Monthly Trends">
            <Card className="chart-card">
              <Card.Header className="chart-header">
                <h5 className="mb-0 text-white">
                  <i className="bi bi-graph-up me-2"></i>
                  Income vs Expenses Over Time
                </h5>
              </Card.Header>
              <Card.Body>
                {Object.keys(monthlyData).length > 0 ? (
                  <div className="chart-container">
                    <Line data={monthlyChartData} options={barChartOptions} />
                  </div>
                ) : (
                  <div className="empty-chart-state">
                    <div className="empty-state-icon mb-3">
                      <i className="bi bi-graph-up"></i>
                    </div>
                    <p className="text-muted mt-3">No data available for trend analysis</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        )}

        <Tab eventKey="budget" title="Budget Analysis">
          <Card className="chart-card">
            <Card.Header className="chart-header">
              <h5 className="mb-0 text-white">
                <i className="bi bi-bar-chart-line me-2"></i>
                Budget vs Actual Spending
              </h5>
            </Card.Header>
            <Card.Body>
              {budgetData.length > 0 ? (
                <div className="chart-container">
                  <Bar data={budgetChartData} options={barChartOptions} />
                </div>
              ) : (
                <div className="empty-chart-state">
                  <div className="empty-state-icon mb-3">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <p className="text-muted mt-3">No budget data available</p>
                  <small className="text-muted">Create budgets to see budget analysis</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Financial Health Insights */}
      <Card className="insights-card">
        <Card.Header className="insights-header">
          <h5 className="mb-0 text-white">
            <i className="bi bi-lightbulb me-2"></i>
            Financial Health Insights
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            <Col md={6}>
              <div className={`insight-item p-4 rounded ${savingsRate >= 20 ? 'insight-success' : savingsRate >= 10 ? 'insight-warning' : 'insight-danger'}`}>
                <div className="insight-icon mb-3">
                  <i className="bi bi-piggy-bank"></i>
                </div>
                <h6 className="text-white mb-2">
                  Savings Rate: {savingsRate.toFixed(1)}%
                </h6>
                <small className="text-white-50">
                  {savingsRate >= 20 
                    ? 'Excellent! You\'re saving a healthy amount.'
                    : savingsRate >= 10 
                    ? 'Good start! Try to increase your savings rate to 20%.'
                    : 'Consider reducing expenses or increasing income to improve savings.'
                  }
                </small>
              </div>
            </Col>
            <Col md={6}>
              <div className="insight-item insight-info p-4 rounded">
                <div className="insight-icon mb-3">
                  <i className="bi bi-graduation-cap"></i>
                </div>
                <h6 className="text-white mb-2">Student Finance Tip</h6>
                <small className="text-white-50">
                  {totalExpenses > totalIncome
                    ? 'Your expenses exceed income. Look for areas to cut back, especially in entertainment and dining out.'
                    : balance > 500
                    ? 'Great financial control! Consider investing your surplus in an emergency fund.'
                    : 'You\'re doing well! Try to build up an emergency fund of at least ₹5,000.'
                  }
                </small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Reports;
