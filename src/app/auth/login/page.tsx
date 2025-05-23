"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials with your backend
    login({
      name: 'John Doe', // This would come from your login response
      email: email || 'user@example.com',
      phoneNumber,
      defaultAddress: {
        id: '1',
        name: 'Home',
        address: '123 Main St',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        isDefault: true
      }
    });
    router.push('/');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signing up with:", { name, email, phoneNumber, password });
  };

  const handleSendOtp = () => {
    if (phoneNumber && phoneNumber.length === 10) {
      setOtpSent(true);
      // In a real app, you would make an API call to send the OTP
      console.log("Sending OTP to:", phoneNumber);
    }
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP verification and login
    console.log("Verifying OTP:", { phoneNumber, otp });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <Image
                src="/images/logo.png"
                alt="TenderCuts"
                width={150}
                height={50}
                className="mx-auto mb-4"
                priority
              />
              <h1 className="text-2xl font-bold text-gray-800">Welcome to TenderCuts</h1>
              <p className="text-gray-600 text-sm">
                Sign in to order fresh meat and seafood
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
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
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-tendercuts-red hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90"
                  >
                    Login
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters long.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Login Tab */}
              <TabsContent value="otp">
                <form onSubmit={handleOtpLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="otp-phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="otp-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full"
                      required
                      disabled={otpSent}
                    />
                  </div>

                  {!otpSent ? (
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90"
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <>
                      <div>
                        <label
                          htmlFor="otp-code"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          OTP
                        </label>
                        <Input
                          id="otp-code"
                          type="text"
                          maxLength={6}
                          placeholder="Enter the OTP sent to your phone"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>

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

                      <Button
                        type="submit"
                        className="w-full bg-tendercuts-red hover:bg-tendercuts-red/90"
                      >
                        Verify & Login
                      </Button>
                    </>
                  )}
                </form>
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
