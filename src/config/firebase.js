// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE0KxTP2BsWiiGeEqunEXjziyxNYLnsXU",
  authDomain: "spendly-finance-app.firebaseapp.com",
  projectId: "spendly-finance-app",
  storageBucket: "spendly-finance-app.firebasestorage.app",
  messagingSenderId: "596960751986",
  appId: "1:596960751986:web:73a0e282742b255a77edeb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

// Alternative Google Auth Provider (as requested)
const provider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Export the provider for alternative usage
export { provider }

export default app
