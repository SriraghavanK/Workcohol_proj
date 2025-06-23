"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { FadeIn, ScaleIn } from "../../components/LightweightAnimations"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    user_type: "mentee",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register, error, clearError } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submission triggered!') // Debug log
    console.log('Form data:', formData) // Debug log
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    
    setIsLoading(true)
    clearError()
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_type: formData.user_type,
      })
      
      // Redirect to dashboard on successful registration
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
      // Error is handled by the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleButtonClick = () => {
    console.log('Button clicked!') // Debug log
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
      
      {/* Register Form */}
      <FadeIn className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-purple-500/20">
          {/* Header */}
          <FadeIn className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Join MentorConnect
            </h1>
            <p className="text-slate-400">Create your account and start your mentorship journey</p>
          </FadeIn>

          {/* Error Message */}
          {error && (
            <FadeIn className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </FadeIn>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <FadeIn>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_type: "mentee" })}
                  className={`p-3 rounded-xl border transition-all ${
                    formData.user_type === "mentee"
                      ? "bg-purple-500/20 border-purple-400 text-purple-300"
                      : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">🎓</div>
                    <div className="font-semibold">Mentee</div>
                    <div className="text-xs opacity-75">Find mentors</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_type: "mentor" })}
                  className={`p-3 rounded-xl border transition-all ${
                    formData.user_type === "mentor"
                      ? "bg-purple-500/20 border-purple-400 text-purple-300"
                      : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">👨‍🏫</div>
                    <div className="font-semibold">Mentor</div>
                    <div className="text-xs opacity-75">Share knowledge</div>
                  </div>
                </button>
              </div>
            </FadeIn>

            {/* Username Field */}
            <FadeIn>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                placeholder="Choose a username"
                required
              />
            </FadeIn>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FadeIn>
                <label htmlFor="first_name" className="block text-sm font-semibold text-slate-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  placeholder="First name"
                  required
                />
              </FadeIn>

              <FadeIn>
                <label htmlFor="last_name" className="block text-sm font-semibold text-slate-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  placeholder="Last name"
                  required
                />
              </FadeIn>
            </div>

            {/* Email Field */}
            <FadeIn>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </FadeIn>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FadeIn>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  placeholder="Create password"
                  required
                />
              </FadeIn>

              <FadeIn>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  placeholder="Confirm password"
                  required
                />
              </FadeIn>
            </div>

            {/* Terms and Conditions */}
            <FadeIn className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-white/30 bg-white/20"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-400">
                I agree to the{" "}
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </FadeIn>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleButtonClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <ScaleIn className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 backdrop-blur-sm text-slate-400">Or continue with</span>
            </div>
          </ScaleIn>

          {/* Social Login */}
          <ScaleIn className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/20 transition-all">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </ScaleIn>

          {/* Sign In Link */}
          <FadeIn className="text-center mt-6">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </FadeIn>
        </div>
      </FadeIn>
    </div>
  )
}
