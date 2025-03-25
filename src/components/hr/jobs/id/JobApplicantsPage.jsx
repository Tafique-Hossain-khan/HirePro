"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft, Search, Filter, Star, User } from "lucide-react"
import gsap from "gsap"

export default function JobApplicantsPage() {
    const params = useParams()
    const router = useNavigate()
    const [job, setJob] = useState(null)
    const [applicants, setApplicants] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredApplicants, setFilteredApplicants] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // Check if HR is logged in
        const hrInfo = JSON.parse(localStorage.getItem("hrInfo") || "{}")
        if (!hrInfo.id) {
            router("/hr/login")
            return
        }
        setIsLoggedIn(true)

        // Initialize GSAP animations safely
        const pageContent = document.querySelector(".page-content")
        if (pageContent) {
            gsap.fromTo(pageContent, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }

        // Load job and applicants
        const loadJobAndApplicants = () => {
            setIsLoading(true)
            try {
                const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
                const foundJob = allJobs.find((job) => job.id.toString() === params.id)

                if (foundJob) {
                    setJob(foundJob)

                    // Get applicants data
                    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
                    const jobApplicants = foundJob.applicants || []

                    // Map applicant IDs to full user data
                    const applicantsData = jobApplicants.map((applicant) => {
                        const userData = allUsers.find((user) => user.id === applicant.userId) || {}
                        return {
                            ...userData,
                            applicationDate: applicant.applicationDate,
                            status: applicant.status || "Pending",
                            ranking: applicant.ranking || 0,
                        }
                    })

                    setApplicants(applicantsData)
                    setFilteredApplicants(applicantsData)
                } else {
                    router("/hr/jobs")
                }
            } catch (error) {
                console.error("Error loading job and applicants:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (isLoggedIn && params.id) {
            loadJobAndApplicants()
        }
    }, [params.id, router, isLoggedIn])

    useEffect(() => {
        // Filter applicants based on search term
        if (searchTerm.trim() === "") {
            setFilteredApplicants(applicants)
        } else {
            const filtered = applicants.filter(
                (applicant) =>
                    applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    applicant.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
            )
            setFilteredApplicants(filtered)
        }
    }, [searchTerm, applicants])

    const handleUpdateRanking = (userId, newRanking) => {
        // Update applicant ranking in localStorage
        const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
        const jobIndex = allJobs.findIndex((job) => job.id.toString() === params.id)

        if (jobIndex !== -1) {
            const applicantIndex = allJobs[jobIndex].applicants.findIndex((app) => app.userId === userId)

            if (applicantIndex !== -1) {
                allJobs[jobIndex].applicants[applicantIndex].ranking = newRanking
                localStorage.setItem("jobs", JSON.stringify(allJobs))

                // Update local state
                setApplicants((prev) => prev.map((app) => (app.id === userId ? { ...app, ranking: newRanking } : app)))

                // Update filtered applicants as well
                setFilteredApplicants((prev) => prev.map((app) => (app.id === userId ? { ...app, ranking: newRanking } : app)))
            }
        }
    }

    const handleUpdateStatus = (userId, newStatus) => {
        // Update applicant status in localStorage
        const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
        const jobIndex = allJobs.findIndex((job) => job.id.toString() === params.id)

        if (jobIndex !== -1) {
            const applicantIndex = allJobs[jobIndex].applicants.findIndex((app) => app.userId === userId)

            if (applicantIndex !== -1) {
                allJobs[jobIndex].applicants[applicantIndex].status = newStatus
                localStorage.setItem("jobs", JSON.stringify(allJobs))

                // Update local state
                setApplicants((prev) => prev.map((app) => (app.id === userId ? { ...app, status: newStatus } : app)))

                // Update filtered applicants as well
                setFilteredApplicants((prev) => prev.map((app) => (app.id === userId ? { ...app, status: newStatus } : app)))
            }
        }
    }

    if (!isLoggedIn) {
        return null // Don't render anything while redirecting
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading applicants...</p>
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
                            <h1 className="text-xl font-bold text-gray-900">Applicants</h1>
                        </div>
                        {/* hr profile icon */}
                        <Link
                            to="/hr/profile"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white"
                        >

                            {JSON.parse(localStorage.getItem("hrInfo") || "{}").name?.charAt(0) || "H"}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 page-content">
                {/* Job Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{job?.title}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                        <span>{job?.company}</span>
                        <span>•</span>
                        <span>{job?.location}</span>
                        <span>•</span>
                        <span>{job?.jobType}</span>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search applicants by name, email, or skills"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                            <Filter className="h-5 w-5" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Applicants List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {filteredApplicants.length} {filteredApplicants.length === 1 ? "Applicant" : "Applicants"}
                        </h2>
                    </div>

                    {filteredApplicants.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No applicants found for this job.</div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredApplicants.map((applicant) => (
                                <div key={applicant.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                            {applicant.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{applicant.name}</h3>
                                            <p className="text-sm text-gray-500">{applicant.email}</p>
                                            <div className="mt-1">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${applicant.status === "Approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : applicant.status === "Rejected"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {applicant.status}
                                                </span>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    Applied {applicant.applicationDate || "recently"}
                                                </span>
                                            </div>
                                            {applicant.skills && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {applicant.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 self-end sm:self-center">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleUpdateRanking(applicant.id, star)}
                                                    className={`text-${star <= applicant.ranking ? "yellow-400" : "gray-300"} hover:text-yellow-400`}
                                                >
                                                    <Star className="h-5 w-5" />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/hr/user-profile/${applicant.id}`}
                                                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/90 font-medium"
                                            >
                                                <User className="h-4 w-4" />
                                                View Profile
                                            </Link>
                                            <select
                                                value={applicant.status}
                                                onChange={(e) => handleUpdateStatus(applicant.id, e.target.value)}
                                                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}


