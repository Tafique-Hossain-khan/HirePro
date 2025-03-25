"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap"
import { ArrowLeft, User, Mail, Building, Lock, Eye, EyeOff } from "lucide-react"

export default function HRRegisterPage() {
    const router = useNavigate()
    const formRef = useRef(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        company: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Check if already logged in
        const hrInfo = JSON.parse(localStorage.getItem("hrInfo") || "{}")
        if (hrInfo.id) {
            router("/hr")
            return
        }

        // Initialize GSAP animations
        if (formRef.current) {
            gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }
    }, [router])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.password.trim()) newErrors.password = "Password is required"
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        if (!formData.company.trim()) newErrors.company = "Company name is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            setIsLoading(true)

            // Simulate API call
            setTimeout(() => {
                // Check if email already exists
                const hrs = JSON.parse(localStorage.getItem("hrs") || "[]")
                const emailExists = hrs.some((hr) => hr.email === formData.email)

                if (emailExists) {
                    setErrors({ email: "Email already exists" })
                    setIsLoading(false)
                    return
                }

                // Create new HR account
                const newHR = {
                    id: Date.now(),
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    company: formData.company,
                }

                localStorage.setItem("hrs", JSON.stringify([...hrs, newHR]))

                // Set HR as logged in
                localStorage.setItem(
                    "hrInfo",
                    JSON.stringify({
                        id: newHR.id,
                        name: newHR.name,
                        email: newHR.email,
                        company: newHR.company,
                    }),
                )

                // Show success animation
                if (formRef.current) {
                    gsap.to(formRef.current, {
                        scale: 1.05,
                        duration: 0.2,
                        onComplete: () => {
                            gsap.to(formRef.current, {
                                scale: 1,
                                duration: 0.2,
                                onComplete: () => {
                                    // Redirect to HR dashboard
                                    router("/hr")
                                },
                            })
                        },
                    })
                } else {
                    router("/hr")
                }
            }, 1500)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/hr/login" className="text-gray-500 hover:text-gray-700 mr-4">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">HR Registration</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md" ref={formRef}>
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your HR account</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/hr/login" className="font-medium text-primary hover:text-primary/90">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name*
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-4 py-2 w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address*
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-4 py-2 w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name*
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-4 py-2 w-full border ${errors.company ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                                    />
                                </div>
                                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password*
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 py-2 w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password*
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 py-2 w-full border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
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
                                    "Create Account"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

