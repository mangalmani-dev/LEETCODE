import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";

const SignupPage = () => {
  const signUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const { signUp, isSigninUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signUp(data);
    } catch (error) {
      console.log("Signup failed", error);
    }
  };

  return (
    <div className="min-h-screen relative bg-white dark:bg-[#020617] transition-colors duration-300">
      <LandingNavbar />

      {/* Gradient background */}
      <div className="
        absolute inset-0
        bg-gradient-to-br from-yellow-50 via-white to-yellow-100
        dark:from-[#0f111a] dark:via-[#020617] dark:to-[#020617]
        overflow-hidden transition-colors duration-300
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

      {/* Centered Signup Form */}
      <div className="relative flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg p-10 rounded-3xl shadow-xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-sm transition-colors duration-300">
          
          <div className="text-center mb-8">
            <img src="/leetlab.svg" className="w-24 mx-auto mb-4" alt="logo" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">Create Your Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              Sign up to start your coding journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Mangalmani Tiwari"
                  className={`w-full border rounded-xl px-10 py-3 focus:ring-2 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors.name ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-yellow-400"
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`w-full border rounded-xl px-10 py-3 focus:ring-2 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-yellow-400"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full border rounded-xl px-10 py-3 focus:ring-2 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-yellow-400"
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isSigninUp}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2 shadow-md transition-transform hover:-translate-y-1"
            >
              {isSigninUp ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6 transition-colors duration-300">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 dark:text-yellow-400 font-medium">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
