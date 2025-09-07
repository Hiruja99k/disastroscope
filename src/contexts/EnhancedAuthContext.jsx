import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { tinybirdService } from '../services/tinybirdService';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component with Tinybird Integration
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up with email and password
  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Send email verification
      await sendEmailVerification(user);

      // Create user in Tinybird
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        }
      };

      try {
        await tinybirdService.createUser(userData);
        console.log('User created in Tinybird successfully');
      } catch (tinybirdError) {
        console.warn('Failed to create user in Tinybird:', tinybirdError);
        // Don't fail the signup if Tinybird fails
      }

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Track login in Tinybird
      try {
        await tinybirdService.trackUserLogin(userCredential.user.uid, userCredential.user.email);
        console.log('Login tracked in Tinybird successfully');
      } catch (tinybirdError) {
        console.warn('Failed to track login in Tinybird:', tinybirdError);
        // Don't fail the signin if Tinybird fails
      }

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Create or update user in Tinybird
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        }
      };

      try {
        await tinybirdService.createUser(userData);
        await tinybirdService.trackUserLogin(user.uid, user.email);
        console.log('Google user created/tracked in Tinybird successfully');
      } catch (tinybirdError) {
        console.warn('Failed to create/track Google user in Tinybird:', tinybirdError);
        // Don't fail the signin if Tinybird fails
      }

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with phone number
  const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
    try {
      setError(null);
      setLoading(true);
      
      const provider = new PhoneAuthProvider(auth);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      return confirmationResult;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = async (confirmationResult, otp) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await confirmationResult.confirm(otp);
      const user = userCredential.user;

      // Create user in Tinybird
      const userData = {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        }
      };

      try {
        await tinybirdService.createUser(userData);
        await tinybirdService.trackUserLogin(user.uid, user.phoneNumber);
        console.log('Phone user created/tracked in Tinybird successfully');
      } catch (tinybirdError) {
        console.warn('Failed to create/track phone user in Tinybird:', tinybirdError);
        // Don't fail the signin if Tinybird fails
      }

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUser = async (updates) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      // Update Firebase Auth profile
      if (updates.displayName || updates.photoURL) {
        await updateProfile(currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        });
      }

      // Update user in Tinybird
      try {
        await tinybirdService.updateUser(currentUser.uid, updates);
        console.log('User updated in Tinybird successfully');
      } catch (tinybirdError) {
        console.warn('Failed to update user in Tinybird:', tinybirdError);
        // Don't fail the update if Tinybird fails
      }
      
      return currentUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updateUserPassword = async (newPassword) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      await updatePassword(currentUser, newPassword);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      await sendEmailVerification(currentUser);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete user account
  const deleteUserAccount = async () => {
    try {
      setError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      // Delete user from Tinybird first
      try {
        await tinybirdService.deleteUser(currentUser.uid);
        console.log('User deleted from Tinybird successfully');
      } catch (tinybirdError) {
        console.warn('Failed to delete user from Tinybird:', tinybirdError);
        // Continue with Firebase deletion even if Tinybird fails
      }
      
      // Delete user from Firebase Auth
      await deleteUser(currentUser);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneOTP,
    signOut: signOutUser,
    updateUser,
    updateUserPassword,
    resetPassword,
    sendVerificationEmail,
    deleteUserAccount,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
