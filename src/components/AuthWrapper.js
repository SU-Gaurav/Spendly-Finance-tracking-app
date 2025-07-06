import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './Login';
import Register from './Register';

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle smooth transitions
  const handleSwitch = (toLogin) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(toLogin);
      setIsTransitioning(false);
    }, 200);
  };

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0,
      y: -50,
      scale: 0.95,
      filter: 'blur(10px)',
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    }
  };

  const backgroundVariants = {
    login: {
      background: [
        'radial-gradient(circle at 20% 80%, rgba(74, 144, 226, 0.03) 0%, transparent 60%)',
        'radial-gradient(circle at 80% 20%, rgba(74, 144, 226, 0.05) 0%, transparent 60%)',
        'radial-gradient(circle at 20% 80%, rgba(74, 144, 226, 0.03) 0%, transparent 60%)'
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    },
    register: {
      background: [
        'radial-gradient(circle at 80% 20%, rgba(76, 175, 80, 0.03) 0%, transparent 60%)',
        'radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.05) 0%, transparent 60%)',
        'radial-gradient(circle at 80% 20%, rgba(76, 175, 80, 0.03) 0%, transparent 60%)'
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div 
      className="auth-container-advanced"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } }
      }}
    >
      {/* Animated Background */}
      <motion.div
        className="auth-background-overlay"
        animate={isLogin ? 'login' : 'register'}
        variants={backgroundVariants}
      />

      {/* Floating Elements */}
      <div className="auth-floating-elements">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`floating-element floating-element-${i + 1}`}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="auth-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="auth-form-container"
          >
            {isLogin ? (
              <Login 
                onSwitchToRegister={() => handleSwitch(false)}
                isTransitioning={isTransitioning}
              />
            ) : (
              <Register 
                onSwitchToLogin={() => handleSwitch(true)}
                isTransitioning={isTransitioning}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab Indicator */}
      <motion.div className="auth-tab-indicator">
        <div className="tab-container">
          <motion.button
            className={`tab-button ${isLogin ? 'active' : ''}`}
            onClick={() => handleSwitch(true)}
            disabled={isTransitioning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Sign In
          </motion.button>
          <motion.button
            className={`tab-button ${!isLogin ? 'active' : ''}`}
            onClick={() => handleSwitch(false)}
            disabled={isTransitioning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-person-plus me-2"></i>
            Sign Up
          </motion.button>
          <motion.div
            className="tab-slider"
            animate={{
              x: isLogin ? 0 : '100%'
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthWrapper;
