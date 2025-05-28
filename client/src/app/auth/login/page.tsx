"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast-notification";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newUser, setNewUser] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();
  const { login, register, sendOtp, loginWithOtp } = useAuth();
  const { showToast } = useToast();

  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    console.log('Login attempt with:', { phoneNumber });
    
    try {
      // Check if credentials are valid
      if (!phoneNumber || !password) {
        setLoginError('Phone number and password are required');
        setIsLoading(false);
        return;
      }
      
      // Try to log in
      console.log('Calling login API...');
      const result = await login(phoneNumber, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        // Show success toast notification
        if (result.message) {
          showToast({
            message: result.message,
            type: 'success',
            duration: 5000
          });
        } else {
          showToast({
            message: 'Welcome to Kadal Thunai! You have successfully logged in.',
            type: 'success',
            duration: 5000
          });
        }
        
        // Get the redirect URL from query parameters or default to account page
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/account';
        
        console.log('Login successful, redirecting to:', redirectUrl);
        
        // Add a small delay to ensure the auth state is updated before redirect
        setTimeout(() => {
          // Use window.location for a full page refresh to ensure auth state is recognized
          window.location.href = redirectUrl;
        }, 800);
      } else {
        console.log('Login failed:', result.message);
        setLoginError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [signupError, setSignupError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  const handleSendOtp = async () => {
    setOtpError('');
    setIsLoading(true);

    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      setOtpError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    try {
      const result = await sendOtp(phoneNumber);
      
      if (result.success) {
        setOtpSent(true);
        setNewUser(!result.userExists);
        showToast({
          message: 'OTP sent successfully to your phone',
          type: 'success'
        });
      } else {
        setOtpError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setOtpError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [otpLoginError, setOtpLoginError] = useState<string>('');

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoginError('');
    setIsLoading(true);

    try {
      // If this is a new user, we need to collect name and email
      const userData = newUser ? { name, email } : undefined;
      
      const result = await loginWithOtp(phoneNumber, otp, userData);
      
      if (result.success) {
        showToast({
          message: result.message || 'Login successful!',
          type: 'success'
        });
        router.push('/account');
        
        // Add a small delay to ensure the auth state is updated before redirect
        setTimeout(() => {
          window.location.href = '/account';
        }, 500);
      } else {
        setOtpLoginError(result.message || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      setOtpLoginError('An unexpected error occurred. Please try again.');
      console.error('OTP login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Kadal Thunai Logo"
                width={150}
                height={50}
                className="mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Welcome to Kadal Thunai
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fresh seafood delivered to your doorstep
            </p>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="otp">OTP Login</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="login-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pr-10"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-tendercuts-red focus:ring-tendercuts-red border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-tendercuts-red hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  {loginError && (
                    <div className="text-red-500 text-sm mt-2">
                      {loginError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Login Tab */}
              <TabsContent value="otp">
                <div className="space-y-4">
                  {!otpSent ? (
                    <div>
                      <label
                        htmlFor="otp-phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <div className="flex">
                        <Input
                          id="otp-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full rounded-r-none"
                          required
                          disabled={otpSent || isLoading}
                        />
                        <Button
                          type="button"
                          className="rounded-l-none bg-tendercuts-red hover:bg-tendercuts-red/90"
                          onClick={handleSendOtp}
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        We'll send a 6-digit code to verify your phone number
                      </p>
                      {otpError && (
                        <div className="text-red-500 text-sm mt-1">
                          {otpError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="otp-code"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Enter OTP
                        </label>
                        <Input
                          id="otp-code"
                          type="text"
                          placeholder="Enter the 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full"
                          maxLength={6}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* If this is a new user, collect name and email */}
                      {newUser && (
                        <>
                          <div>
                            <label
                              htmlFor="otp-name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Full Name
                            </label>
                            <Input
                              id="otp-name"
                              type="text"
                              placeholder="Enter your full name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full"
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="otp-email"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Email Address
                            </label>
                            <Input
                              id="otp-email"
                              type="email"
                              placeholder="Enter your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full"
                              required
                              disabled={isLoading}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex justify-between items-center">
                        <Button
                          type="button"
                          variant="outline"
                          className="text-tendercuts-red"
                          onClick={() => setOtpSent(false)}
                        >
                          Change Number
                        </Button>
                        <button
                          type="button"
                          className="text-sm text-tendercuts-red hover:underline"
                          onClick={handleSendOtp}
                        >
                          Resend OTP
                        </button>
                      </div>

                      {otpLoginError && (
                        <div className="text-red-500 text-sm">
                          {otpLoginError}
                        </div>
                      )}

                      <Button
                        type="button"
                        className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90"
                        disabled={isLoading}
                        onClick={handleOtpLogin}
                      >
                        {isLoading ? 'Verifying...' : 'Verify & Login'}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              By continuing, you agree to our{" "}
              <Link
                href="/terms-and-conditions"
                className="text-tendercuts-red hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-tendercuts-red hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
