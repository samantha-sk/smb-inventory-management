import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, isGoogleAuthEnabled, setupRecaptcha, formatPhoneNumber } from '../config/firebase';
import { 
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  signInWithPhoneNumber
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneAuthError, setPhoneAuthError] = useState(null);
  const [phoneAuthSuccess, setPhoneAuthSuccess] = useState(null);

  // Google Sign In
  const signInWithGoogle = async () => {
    // If Google auth is not enabled in Firebase Console, use mock auth for testing
    if (!isGoogleAuthEnabled) {
      console.log("Using mock authentication for testing (Google auth not enabled)");
      const mockUser = {
        uid: 'mock-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://via.placeholder.com/150',
        emailVerified: true
      };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return mockUser;
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
      throw error;
    }
  };

  // Phone Sign In
  const sendPhoneOTP = async (phoneNumber) => {
    try {
      setPhoneAuthError(null);
      setPhoneAuthSuccess(null);
      
      // Ensure reCAPTCHA is set up before sending OTP
      setupRecaptcha();
      
      // Wait a small delay to ensure reCAPTCHA is initialized
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized. Please try again.');
      }
      
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setPhoneAuthSuccess('OTP has been sent to your phone number.');
      return confirmation;
    } catch (error) {
      console.error("Error sending OTP:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // Handle specific error cases
      if (error.code === 'auth/invalid-phone-number') {
        setPhoneAuthError('Invalid phone number format. Please enter a valid phone number with country code.');
      } else if (error.code === 'auth/too-many-requests') {
        setPhoneAuthError('Too many attempts. Please try again later.');
      } else if (error.code === 'auth/quota-exceeded') {
        setPhoneAuthError('Daily quota exceeded. Please try again tomorrow.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setPhoneAuthError('Phone authentication is not enabled. Please contact support.');
      } else {
        setPhoneAuthError('Failed to send OTP. Please try again.');
      }
      throw new Error(setPhoneAuthError);
    }
  };

  // Verify OTP
  const verifyOTP = async (otp) => {
    try {
      setPhoneAuthError(null);
      setPhoneAuthSuccess(null);
      
      if (!confirmationResult) {
        throw new Error('No confirmation result found. Please request OTP again.');
      }
      
      const result = await confirmationResult.confirm(otp);
      setCurrentUser(result.user);
      setPhoneAuthSuccess('Phone number verified successfully!');
      return result.user;
    } catch (error) {
      console.error("Error verifying OTP:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // Handle specific error cases
      if (error.code === 'auth/invalid-verification-code') {
        setPhoneAuthError('Invalid OTP. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        setPhoneAuthError('OTP has expired. Please request a new one.');
      } else if (error.code === 'auth/too-many-requests') {
        setPhoneAuthError('Too many attempts. Please try again later.');
      } else {
        setPhoneAuthError('Failed to verify OTP. Please try again.');
      }
      throw new Error(setPhoneAuthError);
    }
  };

  // Sign Out
  const logout = async () => {
    // If using mock auth, just clear the current user
    if (!isGoogleAuthEnabled && currentUser?.uid === 'mock-user-123') {
      console.log("Signing out mock user");
      localStorage.removeItem('mockUser');
      setCurrentUser(null);
      return;
    }
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Check for mock user in localStorage on initial load
    if (!isGoogleAuthEnabled) {
      const mockUser = JSON.parse(localStorage.getItem('mockUser'));
      if (mockUser) {
        console.log("Found mock user in localStorage:", mockUser.email);
        setCurrentUser(mockUser);
      }
      setLoading(false);
      return () => {};
    }
    
    // If not using mock auth, listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    sendPhoneOTP,
    verifyOTP,
    logout,
    phoneAuthError,
    phoneAuthSuccess
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 