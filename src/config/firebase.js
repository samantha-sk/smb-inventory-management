import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSVAmFIkS2zq53Kl_VjbnaSItqWwfMu0k",
    authDomain: "my-biz-inventory.firebaseapp.com",
    projectId: "my-biz-inventory",
    storageBucket: "my-biz-inventory.firebasestorage.app",
    messagingSenderId: "939918279494",
    appId: "1:939918279494:web:7a8eee10d9c93e3a8c9b47",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Debug flag to indicate if Google auth is enabled in Firebase Console
export const isGoogleAuthEnabled = true;

// Initialize reCAPTCHA verifier for phone auth
export const setupRecaptcha = () => {
  try {
    if (!window.recaptchaVerifier) {
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        console.error('reCAPTCHA container not found');
        return;
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          // reCAPTCHA expired
          console.log('reCAPTCHA expired');
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      });
    }
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
  }
};

// Helper function to format phone number
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If the number doesn't start with +, add it
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

export { auth, googleProvider };
export default app;