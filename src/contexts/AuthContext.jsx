import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth, googleProvider, provider } from '../config/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError(null)
      
      // Use the pattern you provided
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up successfully
          const user = userCredential.user;
          console.log('User signed up:', user.uid);
          return userCredential;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Signup error:', errorCode, errorMessage);
          setError(errorMessage);
          throw error;
        });
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null)
      
      // Demo mode - bypass Firebase for demo credentials
      if (email === 'demo@spendly.com' && password === 'demo123') {
        console.log('Demo login activated for:', email)
        
        // Create a mock user object that mimics Firebase user structure
        const demoUser = {
          uid: 'demo-user-12345',
          email: 'demo@spendly.com',
          displayName: 'Demo User',
          photoURL: null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          },
          providerData: [{
            uid: 'demo@spendly.com',
            email: 'demo@spendly.com',
            displayName: 'Demo User',
            photoURL: null,
            providerId: 'password'
          }],
          // Mark this as a demo user for later reference
          isDemoUser: true
        }
        
        // Set the demo user as current user
        setCurrentUser(demoUser)
        
        // Return a mock result that mimics Firebase response
        return {
          user: demoUser,
          operationType: 'signIn',
          providerId: 'password'
        }
      }
      
      // For all other credentials, use Firebase authentication
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null)
      
      // Use the pattern you provided
      return signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log('Google sign-in successful:', user.uid);
          console.log('Access token:', token);
          // IdP data available using getAdditionalUserInfo(result)
          return result;
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData?.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          
          console.error('Google sign-in error:', errorCode, errorMessage);
          
          // Handle specific Google Auth errors
          if (errorCode === 'auth/popup-closed-by-user') {
            setError('Sign-in popup was closed. Please try again.')
          } else if (errorCode === 'auth/popup-blocked') {
            setError('Popup was blocked by browser. Please allow popups for this site.')
          } else if (errorCode === 'auth/cancelled-popup-request') {
            // User cancelled - don't show error
            setError(null)
          } else {
            setError(errorMessage)
          }
          
          throw error;
        });
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign out
  const logout = async () => {
    try {
      setError(null)
      
      // Check if current user is a demo user
      if (currentUser?.isDemoUser) {
        console.log('Demo user sign-out')
        setCurrentUser(null)
        return true
      }
      
      // For Firebase users, use Firebase sign out
      return signOut(auth).then(() => {
        // Sign-out successful.
        console.log('Sign-out successful');
        setCurrentUser(null);
        return true;
      }).catch((error) => {
        // An error happened.
        console.error('Sign-out error:', error);
        setError(error.message);
        throw error;
      });
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Get current user info helper
  const getCurrentUserInfo = () => {
    // Handle demo user
    if (currentUser?.isDemoUser) {
      return {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        user: currentUser, // Full user object
        isDemoUser: true
      };
    }
    
    // Handle Firebase user
    const user = auth.currentUser;
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      const email = user.email;
      const displayName = user.displayName;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;
      
      return {
        uid,
        email,
        displayName,
        photoURL,
        emailVerified,
        user, // Full user object
        isDemoUser: false
      };
    } else {
      // User is signed out
      return null;
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    // Use the pattern you provided
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const email = user.email;
        const displayName = user.displayName;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        
        console.log('Firebase user is signed in:', {
          uid,
          email,
          displayName,
          photoURL,
          emailVerified
        });
        
        // Only set Firebase users, not demo users
        if (!currentUser?.isDemoUser) {
          setCurrentUser(user);
        }
        setLoading(false);
      } else {
        // User is signed out
        console.log('Firebase user is signed out');
        
        // Only clear currentUser if it's not a demo user
        if (!currentUser?.isDemoUser) {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    });

    return unsubscribe
  }, [currentUser])

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    getCurrentUserInfo,
    loading,
    error,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
