// Code for HR Login Page

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import gsap from "gsap"

export default function HRLoginPage() {
    const router = useNavigate()
    const formRef = useRef(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Check if already logged in
        const hrInfo = JSON.parse(localStorage.getItem("hrInfo") || "{}")
        if (hrInfo.id) {
            router("/hr/profile")
            return
        }

        // Initialize GSAP animations safely
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

        // Simulate API call
        setTimeout(() => {
            // Check if HR exists
            const hrs = JSON.parse(localStorage.getItem("hrs") || "[]")
            const hr = hrs.find((hr) => hr.email === email)

            if (hr && hr.password === password) {
                // Login successful
                localStorage.setItem(
                    "hrInfo",
                    JSON.stringify({
                        id: hr.id,
                        name: hr.name,
                        email: hr.email,
                        company: hr.company,
                    }),
                )
                router("/hr/jobs")
            } else if (hr) {
                // HR exists but password is incorrect
                setError("Invalid password")
                setIsLoading(false)
            } else {
                // HR doesn't exist, create new account
                const newHr = {
                    id: Date.now(),
                    name: email.split("@")[0],
                    email: email,
                    password: password,
                    company: "Company Name",
                }

                localStorage.setItem("hrs", JSON.stringify([...hrs, newHr]))
                localStorage.setItem(
                    "hrInfo",
                    JSON.stringify({
                        id: newHr.id,
                        name: newHr.name,
                        email: newHr.email,
                        company: newHr.company,
                    }),
                )

                router("/hr/jobs")
            }
        }, 1000)
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className=" shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-12 items-center">
                        <div className="flex items-center">
                            <Link to="/hr" className="text-gray-500 hover:text-gray-700 mr-4">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">HR Login</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md" ref={formRef}>
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your HR account</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Or{" "}
                            <Link to="/hr/register" className="font-medium text-primary hover:text-primary/90">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative">
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10"
                                    placeholder="Email address"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10"
                                    placeholder="Password"
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
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
                                        Processing...
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

