"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { ArrowLeft, User, Building, Mail, Edit, LogOut } from "lucide-react"
import gsap from "gsap" // Import GSAP

export default function HRProfilePage() {
    const router = useNavigate()
    const [hrInfo, setHrInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
    })

    useEffect(() => {
        // Check if HR is logged in
        const storedHrInfo = JSON.parse(localStorage.getItem("hrInfo") || "{}")
        if (!storedHrInfo.id) {
            router("/hr/login")
            return
        }

        setHrInfo(storedHrInfo)
        setFormData({
            name: storedHrInfo.name || "",
            email: storedHrInfo.email || "",
            company: storedHrInfo.company || "",
        })
        setIsLoading(false)

        // Initialize GSAP animations safely
        const pageContent = document.querySelector(".page-content")
        if (pageContent) {
            gsap.fromTo(pageContent, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("hrInfo")
        router("/hr")
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Update HR info in localStorage
        const updatedHrInfo = {
            ...hrInfo,
            name: formData.name,
            email: formData.email,
            company: formData.company,
        }

        localStorage.setItem("hrInfo", JSON.stringify(updatedHrInfo))

        // Update HR in the hrs array
        const hrs = JSON.parse(localStorage.getItem("hrs") || "[]")
        const hrIndex = hrs.findIndex((hr) => hr.id === hrInfo.id)

        if (hrIndex !== -1) {
            hrs[hrIndex] = {
                ...hrs[hrIndex],
                name: formData.name,
                email: formData.email,
                company: formData.company,
            }
            localStorage.setItem("hrs", JSON.stringify(hrs))
        }

        setHrInfo(updatedHrInfo)
        setIsEditing(false)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/hr/jobs" className="text-gray-500 hover:text-gray-700 mr-4">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">HR Profile</h1>
                        </div>
                        <button onClick={handleLogout} className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 page-content">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-primary/10 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                                {hrInfo.name?.charAt(0) || "H"}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{hrInfo.name}</h2>
                                <p className="text-gray-600">HR Manager</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="inline-flex items-center gap-1 text-primary hover:text-primary/90"
                        >
                            <Edit className="h-5 w-5" />
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                            Company
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                required
                                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                                        <p className="mt-1 text-gray-900">{hrInfo.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                                        <p className="mt-1 text-gray-900">{hrInfo.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Company</h3>
                                        <p className="mt-1 text-gray-900">{hrInfo.company}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Link
                                            to="/hr/post-job"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                        >
                                            Post a New Job
                                        </Link>
                                        <Link
                                            to="/hr/jobs"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            Manage Job Listings
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

