import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Modal, ListGroup, Badge, InputGroup } from 'react-bootstrap';
import { format } from 'date-fns';

const Transactions = ({ transactions, addTransaction, deleteTransaction, settings }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: 'food'
  });

  const categories = {
    expense: ['food', 'transport', 'entertainment', 'books', 'housing', 'other'],
    income: ['scholarship', 'part-time', 'allowance', 'freelance', 'other']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.description) {
      addTransaction(formData);
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: 'food'
      });
      setShowModal(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: categories[value][0] })
    }));
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      food: 'bi-cup-straw',
      transport: 'bi-bus-front',
      entertainment: 'bi-controller',
      books: 'bi-book',
      housing: 'bi-house',
      scholarship: 'bi-award',
      'part-time': 'bi-briefcase',
      allowance: 'bi-gift',
      freelance: 'bi-laptop',
      other: 'bi-three-dots'
    };
    return icons[category] || 'bi-three-dots';
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'category-food',
      transport: 'category-transport',
      entertainment: 'category-entertainment',
      books: 'category-books',
      housing: 'category-housing',
      scholarship: 'category-income',
      'part-time': 'category-income',
      allowance: 'category-income',
      freelance: 'category-income',
      other: 'category-other'
    };
    return colors[category] || 'category-other';
  };

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary">
                <i className="bi bi-list-ul me-2"></i>
                Transactions
              </h2>
              <p className="text-muted">Track and manage your income and expenses</p>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-1"></i>
              Add Transaction
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {[...categories.expense, ...categories.income].map(cat => (
              <option key={cat} value={cat} className="text-capitalize">{cat}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Transactions List */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">All Transactions ({filteredTransactions.length})</h5>
            <div className="d-flex gap-2">
              <Badge bg="success">
                Income: {filteredTransactions.filter(t => t.type === 'income').length}
              </Badge>
              <Badge bg="danger">
                Expenses: {filteredTransactions.filter(t => t.type === 'expense').length}
              </Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-receipt text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3 mb-0">No transactions found</p>
              <small className="text-muted">
                {transactions.length === 0 
                  ? 'Start by adding your first transaction'
                  : 'Try adjusting your filters'
                }
              </small>
            </div>
          ) : (
            <ListGroup variant="flush">
              {filteredTransactions.map((transaction) => (
                <ListGroup.Item key={transaction.id} className="transaction-item">
                  <div className="d-flex align-items-center">
                    <div className={`category-icon me-3 ${getCategoryColor(transaction.category)}`}>
                      <i className={`bi ${getCategoryIcon(transaction.category)}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{transaction.description}</h6>
                          <div className="d-flex align-items-center gap-2">
                            <Badge 
                              bg={transaction.type === 'income' ? 'success' : 'danger'}
                              className="text-capitalize"
                            >
                              {transaction.type}
                            </Badge>
                            <small className="text-muted text-capitalize">
                              {transaction.category}
                            </small>
                            <small className="text-muted">
                              {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className={`fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {transaction.type === 'income' ? '+' : '-'}{settings.currency}{parseFloat(transaction.amount).toFixed(2)}
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="mt-1"
                            onClick={() => deleteTransaction(transaction.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Add Transaction Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Transaction</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Form.Select>
              </Col>
              <Col xs={12}>
                <Form.Label>Amount ({settings.currency})</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </Col>
              <Col xs={12}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description..."
                  required
                />
              </Col>
              <Col xs={12}>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat} className="text-capitalize">{cat}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Transaction
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Transactions;
