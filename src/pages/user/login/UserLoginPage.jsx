"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap"
import { ArrowLeft, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react"

export default function UserLoginPage() {
  const router = useNavigate()
  const formRef = useRef(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if already logged in
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    if (userInfo.id) {
      router("/user/jobs")
      return
    }

    // Initialize GSAP animations
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    }
  }, [router])

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      // Check if user exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((user) => user.email === email)

      if (user && user.password === password) {
        // Login successful
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
          }),
        )
        router("/user/jobs")
      } else if (user) {
        // User exists but password is incorrect
        setError("Invalid password")
        setIsLoading(false)
      } else {
        // User doesn't exist, create new account
        const newUser = {
          id: Date.now(),
          name: email.split("@")[0],
          email: email,
          password: password,
          skills: ["JavaScript", "React", "CSS"],
          location: "Remote",
          about: "I am a passionate job seeker looking for new opportunities.",
          experience: [],
          education: [],
        }

        localStorage.setItem("users", JSON.stringify([...users, newUser]))
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          }),
        )

        router("/user/jobs")
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/user" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Login</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-lg shadow-md" ref={formRef}>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back </h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/user/register" className="font-medium text-primary hover:text-primary/80">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

