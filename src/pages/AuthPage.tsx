import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/EnhancedAuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Shield,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
  Star,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    signUp, 
    signIn, 
    signInWithGoogle, 
    signInWithPhone, 
    verifyPhoneOTP,
    resetPassword,
    error,
    clearError,
    loading 
  } = useAuth();

  // Form states
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phoneNumber: '',
    otp: ''
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Refs
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<any>(null);


  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Clear errors when switching tabs
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [activeTab, clearError]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (validationTimer.current) {
        clearTimeout(validationTimer.current);
      }
    };
  }, []);


  // Initialize reCAPTCHA
  useEffect(() => {
    if (activeTab === 'phone' && recaptchaRef.current && !recaptchaVerifierRef.current) {
      const { RecaptchaVerifier } = require('firebase/auth');
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        recaptchaRef.current,
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          }
        }
      );
    }
  }, [activeTab]);

  // Form validation with smooth error handling
  const validateForm = (forceShow = false) => {
    const errors: Record<string, string> = {};
    const newErrors: Record<string, string> = {};

    if (activeTab === 'signin') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (activeTab === 'signup') {
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (activeTab === 'phone') {
      if (phoneStep === 'phone') {
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = 'Please enter a valid phone number with country code (e.g., +1234567890)';
        }
      } else if (phoneStep === 'otp') {
        if (!formData.otp) {
          newErrors.otp = 'OTP is required';
        } else if (formData.otp.length !== 6) {
          newErrors.otp = 'OTP must be 6 digits';
        }
      }
    }

    // Smart error display logic
    Object.keys(newErrors).forEach(field => {
      const currentError = validationErrors[field];
      const newError = newErrors[field];
      
      // Show error if:
      // 1. Force show is true (on submit)
      // 2. Field has content and is invalid (user has typed something)
      // 3. Error message has changed (smooth transition)
      if (forceShow || 
          (formData[field as keyof typeof formData] && newError) ||
          (currentError && currentError !== newError)) {
        errors[field] = newError;
      }
    });

    setValidationErrors(errors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  // Debounced validation timer
  const validationTimer = useRef<NodeJS.Timeout>();

  // Update form data and validate
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous timer
    if (validationTimer.current) {
      clearTimeout(validationTimer.current);
    }
    
    // Set new timer for smooth validation
    validationTimer.current = setTimeout(() => {
      validateForm(false); // Smart error display
    }, 500); // Slightly longer delay for smoother experience
  };

  // Validate form on tab/step change
  useEffect(() => {
    validateForm(false);
  }, [activeTab, phoneStep]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show all errors when user tries to submit
    validateForm(true);
    
    // Check if form is valid after showing errors
    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      if (activeTab === 'signin') {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else if (activeTab === 'signup') {
        await signUp(formData.email, formData.password, formData.displayName);
        toast.success('Account created successfully! Please check your email for verification.');
        setActiveTab('signin');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else if (activeTab === 'phone') {
        if (phoneStep === 'phone') {
          const result = await signInWithPhone(formData.phoneNumber, recaptchaVerifierRef.current);
          setConfirmationResult(result);
          setPhoneStep('otp');
          toast.success('OTP sent to your phone number');
        } else if (phoneStep === 'otp') {
          await verifyPhoneOTP(confirmationResult, formData.otp);
          toast.success('Phone number verified successfully!');
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    clearError();

    try {
      await signInWithGoogle();
      toast.success('Signed in with Google successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(formData.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset phone form
  const resetPhoneForm = () => {
    setPhoneStep('phone');
    setFormData(prev => ({ ...prev, phoneNumber: '', otp: '' }));
    setConfirmationResult(null);
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Enhanced Philosophical Fog Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Enhanced Fog Layer 1 */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-200/30 to-transparent animate-pulse"></div>
          <div className="absolute top-1/4 left-0 w-full h-1/2 bg-gradient-to-r from-transparent via-blue-300/25 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-0 w-full h-1/3 bg-gradient-to-l from-transparent via-blue-200/35 to-transparent animate-pulse delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent via-blue-300/30 to-transparent animate-pulse delay-3000"></div>
        </div>
        
        {/* Enhanced Fog Layer 2 */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 bg-gradient-radial from-blue-300/40 via-blue-200/30 to-transparent rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-2/3 right-1/4 w-1/3 h-1/4 bg-gradient-radial from-blue-400/35 via-blue-300/25 to-transparent rounded-full animate-pulse delay-1500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2/5 h-1/5 bg-gradient-radial from-blue-200/45 via-blue-100/30 to-transparent rounded-full animate-pulse delay-2500"></div>
        </div>
        
        {/* Enhanced Moving Fog */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-300/20 to-transparent animate-pulse" style={{
            animation: 'fogDrift 20s ease-in-out infinite alternate'
          }}></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-blue-200/25 to-transparent animate-pulse" style={{
            animation: 'fogDrift 25s ease-in-out infinite alternate-reverse'
        }}></div>
        </div>
        
        {/* Enhanced Particles */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-300/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-200/35 to-blue-300/35 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 bg-gradient-to-r from-blue-400/25 to-blue-500/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-r from-blue-300/30 to-blue-200/30 rounded-full blur-2xl animate-pulse delay-3000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-blue-200/40 to-blue-300/40 rounded-full blur-xl animate-pulse delay-1500"></div>
        </div>
        
        {/* Philosophical Floating Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-blue-500 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-3000"></div>
          <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-blue-500 rounded-full animate-ping delay-1500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-start justify-center p-4 pt-20 pb-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side - Branding & Features */}
          <div className="text-center lg:text-left space-y-8 lg:sticky lg:top-24">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                  DisastroScope
                </h1>
                
                {/* Philosophical Quote */}
                <div className="mt-12">
                  {/* Top Line */}
                  <div className="w-16 h-px bg-gray-400/40 mx-auto mb-4"></div>
                  
                  <blockquote className="text-lg text-gray-500/80 leading-relaxed">
                    "In the dance between chaos and order, wisdom lies not in predicting the storm, but in understanding its nature and preparing the soul for its passage."
                  </blockquote>
                  
                  <cite className="block mt-3 text-sm text-gray-400/70 text-right">
                    — Ancient Wisdom
                  </cite>
                  
                  {/* Bottom Line */}
                  <div className="w-16 h-px bg-gray-400/40 mx-auto mt-4"></div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">Real-time Alerts</h3>
                    <p className="text-gray-600 text-sm">The whisper of change</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">Global Coverage</h3>
                    <p className="text-gray-600 text-sm">Eyes across the cosmos</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">AI Predictions</h3>
                    <p className="text-gray-600 text-sm">Divining the patterns</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">Community</h3>
                    <p className="text-gray-600 text-sm">Unity in adversity</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side - Authentication Form */}
          <div className="w-full max-w-md mx-auto lg:sticky lg:top-24">

            {/* Main Auth Card */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl border border-blue-100 mt-4">
              <CardHeader className="space-y-1 pb-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Welcome, Seeker</CardTitle>
                  <CardDescription className="text-gray-600">
                    Begin your journey into the realm of foresight
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-blue-50 border border-blue-200">
                  <TabsTrigger 
                    value="signin" 
                    className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-600 data-[state=inactive]:hover:text-blue-600"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-600 data-[state=inactive]:hover:text-blue-600"
                  >
                    Register
                  </TabsTrigger>
                  <TabsTrigger 
                    value="phone" 
                    className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-600 data-[state=inactive]:hover:text-blue-600"
                  >
                    Phone
                  </TabsTrigger>
                </TabsList>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.email ? 'border-red-400' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    <div className={`error-message ${validationErrors.email ? 'show' : ''}`}>
                    {validationErrors.email && (
                        <p className="text-sm text-red-500">{validationErrors.email}</p>
                    )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.password ? 'border-red-400' : ''}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <div className={`error-message ${validationErrors.password ? 'show' : ''}`}>
                    {validationErrors.password && (
                        <p className="text-sm text-red-500">{validationErrors.password}</p>
                    )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-700 font-medium">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your display name"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        className={`pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.displayName ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    <div className={`error-message ${validationErrors.displayName ? 'show' : ''}`}>
                    {validationErrors.displayName && (
                      <p className="text-sm text-red-500">{validationErrors.displayName}</p>
                    )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.email ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    <div className={`error-message ${validationErrors.email ? 'show' : ''}`}>
                    {validationErrors.email && (
                      <p className="text-sm text-red-500">{validationErrors.email}</p>
                    )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.password ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <div className={`error-message ${validationErrors.password ? 'show' : ''}`}>
                    {validationErrors.password && (
                      <p className="text-sm text-red-500">{validationErrors.password}</p>
                    )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <div className={`error-message ${validationErrors.confirmPassword ? 'show' : ''}`}>
                    {validationErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                    )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Phone Tab */}
              <TabsContent value="phone" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {phoneStep === 'phone' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="phone-number" className="text-gray-700 font-medium">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone-number"
                            type="tel"
                            placeholder="+1234567890"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className={`pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.phoneNumber ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                          />
                        </div>
                        <div className={`error-message ${validationErrors.phoneNumber ? 'show' : ''}`}>
                        {validationErrors.phoneNumber && (
                          <p className="text-sm text-red-500">{validationErrors.phoneNumber}</p>
                        )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Include country code (e.g., +1 for US, +44 for UK)
                        </p>
                      </div>

                      <div ref={recaptchaRef}></div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={!isFormValid || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          'Send OTP'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          We sent a 6-digit code to <strong>{formData.phoneNumber}</strong>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-gray-700 font-medium">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={formData.otp}
                          onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className={`text-center text-lg tracking-widest bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 focus:outline-none ${validationErrors.otp ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                          maxLength={6}
                        />
                        <div className={`error-message ${validationErrors.otp ? 'show' : ''}`}>
                        {validationErrors.otp && (
                          <p className="text-sm text-red-500">{validationErrors.otp}</p>
                        )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetPhoneForm}
                          className="flex-1"
                          disabled={isLoading}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                          disabled={!isFormValid || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify OTP'
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 py-3 rounded-xl shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link to="/support" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Contact Support
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AuthPage;
