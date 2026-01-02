import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8080/api/v1/auth/google";
};

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/home"); // redirect after login
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen relative bg-white dark:bg-[#020617] transition-colors duration-300">
      <LandingNavbar />

      {/* Gradient background */}
      <div className="
        absolute inset-0
        bg-gradient-to-br
        from-yellow-50 via-white to-yellow-100
        dark:from-[#0f111a] dark:via-[#020617] dark:to-[#020617]
        transition-colors duration-300
        overflow-hidden
      ">
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#fbbf24" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Centered form */}
      <div className="relative flex items-center justify-center py-20 px-4">
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl p-10 w-full max-w-lg backdrop-blur-sm bg-white/90 dark:bg-[#111827]/90 transition-colors duration-300">
          <div className="text-center mb-8">
            <img src="/leetlab.svg" className="w-24 mx-auto mb-4" alt="logo" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Sign in to continue your coding journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`w-full border rounded-xl px-10 py-3 focus:ring-2 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-yellow-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full border rounded-xl px-10 py-3 focus:ring-2 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-yellow-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <div className="text-right mt-1">
                <Link className="text-yellow-500 dark:text-yellow-400 text-sm hover:underline">
                  Forgot Password?
                </Link>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2 shadow-md transition-transform hover:-translate-y-1"
            >
              {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log In"}
            </button>
          </form>

          {/* Google Login Only */}
          <div className="flex flex-col gap-4 mt-6">
           <button
  type="button"
  onClick={handleGoogleLogin}
  className="border rounded-xl py-3 w-full flex justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-transform hover:-translate-y-1"
>
  <img src="/google.jpg" className="w-5" alt="Google" />
  Continue with Google
</button>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link className="text-yellow-500 dark:text-yellow-400 font-medium" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
