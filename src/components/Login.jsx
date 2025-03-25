import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneAuthSuccess, setPhoneAuthSuccess] = useState('');
  
  const { signInWithGoogle, sendPhoneOTP, verifyOTP, phoneAuthError, phoneAuthSuccess: authSuccess } = useAuth();
  const navigate = useNavigate();

  // Reset form when switching login methods
  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    setError('');
    setPhoneNumber('');
    setOtp('');
    setOtpSent(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const user = await signInWithGoogle();
      console.log("Google sign-in successful:", user);
      
      // Ensure user is stored in localStorage for ProtectedRoute
      if (user) {
        localStorage.setItem('mockUser', JSON.stringify(user));
      }
      
      console.log("Navigating to dashboard after Google sign-in");
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      setError(`Failed to sign in with Google: ${error.code || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Format the number as user types
    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = `+${cleaned}`;
      if (cleaned.length > 5) {
        formatted = `+${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
      }
    }
    setPhoneNumber(formatted);
  };

  const handleOTPChange = (e) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginMethod === 'email') {
        // TODO: Implement email login
        console.log('Login attempt with:', { email, password, rememberMe });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Navigating to dashboard after email login");
        navigate('/dashboard');
      } else {
        // Handle phone login
        if (!otpSent) {
          // Send OTP
          if (!phoneNumber) {
            setError('Please enter a phone number');
            return;
          }
          await sendPhoneOTP(phoneNumber);
          setOtpSent(true);
        } else {
          // Verify OTP
          if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
          }
          // Remove spaces from phone number for comparison
          const cleanPhoneNumber = phoneNumber.replace(/\s/g, '');
          console.log('Verifying:', { cleanPhoneNumber, otp }); // Debug log
          
          // Manual verification for test numbers
          if (cleanPhoneNumber === '+911234567890' && otp === '123456') {
            setPhoneAuthSuccess('OTP verified successfully!');
            // Create and store mock user in localStorage
            const mockUser = {
              uid: 'phone-user-123',
              phoneNumber: cleanPhoneNumber,
              displayName: 'Phone User',
            };
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            console.log("Stored mock user in localStorage:", mockUser);
            
            // Wait briefly to show success message
            setTimeout(() => {
              console.log("Navigating to dashboard after phone verification");
              navigate('/dashboard');
            }, 1000);
          } else if (cleanPhoneNumber === '+912233200000' && otp === '654321') {
            setPhoneAuthSuccess('OTP verified successfully!');
            // Create and store mock user in localStorage
            const mockUser = {
              uid: 'phone-user-456',
              phoneNumber: cleanPhoneNumber,
              displayName: 'Phone User',
            };
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            console.log("Stored mock user in localStorage:", mockUser);
            
            // Wait briefly to show success message
            setTimeout(() => {
              console.log("Navigating to dashboard after phone verification");
              navigate('/dashboard');
            }, 1000);
          } else {
            setError('Invalid OTP. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async() => {
    setError('');
    setLoading(true);
    try {
      await sendPhoneOTP(phoneNumber);
      setError('OTP has been resent to your phone number.');
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-4xl font-bold text-black">
          StockInvent
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your One-stop Solution for Stock and Inventory Management!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 rounded-md p-3">
              {error}
            </div>
          )}
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => handleLoginMethodChange('email')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                loginMethod === 'email'
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => handleLoginMethodChange('phone')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                loginMethod === 'phone'
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Phone Number
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {loginMethod === 'email' ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Work email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Keep me signed in
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-black hover:text-gray-700">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Sign in'}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                    >
                      <svg className="w-5 h-5 mr-2" fill="#4285F4" viewBox="0 0 24 24">
                        <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.447,1.563-1.845,2.718-3.536,2.718c-2.018,0-3.654-1.636-3.654-3.654s1.636-3.654,3.654-3.654c0.998,0,1.904,0.401,2.562,1.049l2.563-2.563C17.711,7.118,16.195,6.545,14.454,6.545c-3.818,0-6.909,3.091-6.909,6.909s3.091,6.909,6.909,6.909c3.818,0,6.909-3.091,6.909-6.909c0-0.472-0.047-0.933-0.137-1.378h-6.681V12.151z"/>
                      </svg>
                      Sign in with Google
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      If you don't have an account you can{' '}
                      <Link to="/signup" className="font-medium text-black hover:text-gray-700">
                        Register here!
                      </Link>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      placeholder="Enter phone number with country code (eg: +91..)"
                      disabled={loading}
                    />
                  </div>
                </div>
                {otpSent && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={otp}
                        onChange={handleOTPChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}
                {(error || phoneAuthError) && (
                  <div className="text-sm text-red-600 bg-red-100 rounded-md p-3">
                    {error || phoneAuthError}
                  </div>
                )}
                {phoneAuthSuccess && (
                  <div className="text-sm text-green-600 bg-green-100 rounded-md p-3">
                    {phoneAuthSuccess}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading || !otpSent}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {loading ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (otpSent ? 'Verify OTP' : 'Send OTP')}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <div id="recaptcha-container" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '100px' }}></div>
    </div>
  );
};

export default Login;