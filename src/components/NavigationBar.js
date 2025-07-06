import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Navbar variant="dark" expand="lg" fixed="top" className="navbar" style={{ zIndex: 1040 }}>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <i className="bi bi-piggy-bank me-2"></i>
            Spendly
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="bi bi-house me-1"></i>
                Dashboard
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/transactions">
              <Nav.Link>
                <i className="bi bi-list-ul me-1"></i>
                Transactions
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/budget">
              <Nav.Link>
                <i className="bi bi-wallet2 me-1"></i>
                Budget
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/reports">
              <Nav.Link>
                <i className="bi bi-bar-chart me-1"></i>
                Reports
              </Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <div 
              className="dropdown navbar-dropdown position-relative" 
              ref={dropdownRef}
              style={{ zIndex: 1070 }}
            >
              <button 
                className="btn nav-link dropdown-toggle-custom d-flex align-items-center"
                onClick={handleDropdownToggle}
                style={{ 
                  cursor: 'pointer',
                  color: 'white',
                  textDecoration: 'none',
                  border: 'none',
                  background: showDropdown ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="bi bi-person-circle me-1"></i>
                {user?.firstName || 'User'}
                <i className={`bi ${showDropdown ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}></i>
              </button>

              {showDropdown && (
                <div 
                  className="dropdown-menu show position-absolute"
                  style={{
                    top: 'calc(100% + 4px)',
                    right: '0',
                    left: 'auto',
                    zIndex: 1070,
                    minWidth: '220px',
                    marginTop: '0',
                    display: 'block',
                    opacity: 1,
                    visibility: 'visible',
                    transform: 'translateY(0)',
                    pointerEvents: 'auto'
                  }}
                >
                  <LinkContainer to="/profile">
                    <button className="dropdown-item" onClick={handleDropdownClose}>
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </button>
                  </LinkContainer>
                  <LinkContainer to="/settings">
                    <button className="dropdown-item" onClick={handleDropdownClose}>
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </button>
                  </LinkContainer>
                  <hr className="dropdown-divider" />
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      handleDropdownClose();
                      logout();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
