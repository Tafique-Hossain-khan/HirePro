"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap"
import { Search, Filter, ExternalLink, X, ChevronDown, ChevronUp, Menu } from "lucide-react"

export default function UserJobsPage() {
    const router = useNavigate()
    const [userInfo, setUserInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [jobs, setJobs] = useState([])
    const [appliedJobs, setAppliedJobs] = useState([])
    const [visibleJobs, setVisibleJobs] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({
        jobType: "",
        workplaceType: "",
        location: "",
    })
    const [showFilters, setShowFilters] = useState(false)
    const [activeTab, setActiveTab] = useState("available")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const initialDisplayCount = 3
    const containerRef = useRef(null)

    useEffect(() => {
        // Check if user is logged in
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
        if (!storedUserInfo.id) {
            router("/user/login")
            return
        }

        setUserInfo(storedUserInfo)

        // Initialize GSAP animations safely
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }

        // Fetch jobs from localStorage
        const fetchJobs = () => {
            setIsLoading(true)
            try {
                const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]")

                // Get user applications
                const userApplications = []
                storedJobs.forEach((job) => {
                    const application = job.applicants?.find((app) => app.userId === storedUserInfo.id)
                    if (application) {
                        userApplications.push({
                            ...job,
                            applicationStatus: application.status || "Pending",
                            applicationDate: application.applicationDate,
                        })
                    }
                })

                setAppliedJobs(userApplications)

                if (storedJobs.length === 0) {
                    // Fallback to mock data if no jobs in localStorage
                    const mockJobs = [
                        {
                            id: 1,
                            title: "Frontend Developer Intern",
                            company: "Matrice.ai",
                            location: "India (Remote)",
                            workplaceType: "Remote",
                            jobType: "Internship",
                            logo: null,
                            postedTime: "2 days ago",
                            easyApply: true,
                        },
                        {
                            id: 2,
                            title: "Frontend Developer Intern",
                            company: "Raniac",
                            location: "India (Remote)",
                            workplaceType: "Remote",
                            jobType: "Internship",
                            postedTime: "7 hours ago",
                            logo: null,
                            easyApply: false,
                        },
                        {
                            id: 3,
                            title: "Frontend Developer",
                            company: "Sors Co",
                            location: "India (Remote)",
                            workplaceType: "Remote",
                            jobType: "Full-time",
                            postedTime: "7 hours ago",
                            logo: null,
                            easyApply: true,
                        },
                    ]
                    setJobs(mockJobs)
                    setVisibleJobs(mockJobs.slice(0, initialDisplayCount))
                } else {
                    setJobs(storedJobs)
                    setVisibleJobs(storedJobs.slice(0, initialDisplayCount))
                }
            } catch (error) {
                console.error("Error fetching jobs:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchJobs()
    }, [router])

    useEffect(() => {
        // Apply filters and search
        const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")

        // If no stored jobs, use mock data
        const jobsToFilter = allJobs.length > 0 ? allJobs : jobs

        let filtered = jobsToFilter

        // Apply search term
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        // Apply filters
        if (filters.jobType) {
            filtered = filtered.filter((job) => job.jobType === filters.jobType)
        }

        if (filters.workplaceType) {
            filtered = filtered.filter((job) => job.workplaceType === filters.workplaceType)
        }

        if (filters.location) {
            filtered = filtered.filter((job) => job.location.includes(filters.location))
        }

        if (activeTab === "available") {
            setJobs(filtered)
            setVisibleJobs(showAll ? filtered : filtered.slice(0, initialDisplayCount))
        }
    }, [searchTerm, filters, showAll, activeTab])

    const handleShowAll = () => {
        if (showAll) {
            setVisibleJobs(jobs.slice(0, initialDisplayCount))
        } else {
            setVisibleJobs(jobs)
        }
        setShowAll(!showAll)
    }

    const handleCloseJob = (jobId) => {
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
        setVisibleJobs((prevVisibleJobs) => prevVisibleJobs.filter((job) => job.id !== jobId))
    }

    const handleApply = (job) => {
        // Check if user is logged in
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")

        if (!userInfo.id) {
            alert("Please log in to apply for jobs")
            return
        }

        // Add user to job applicants
        const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
        const jobIndex = allJobs.findIndex((j) => j.id === job.id)

        if (jobIndex !== -1) {
            // Check if user already applied
            const alreadyApplied = allJobs[jobIndex].applicants?.some((app) => app.userId === userInfo.id)

            if (alreadyApplied) {
                alert("You have already applied for this job")
                return
            }

            // Add user to applicants
            if (!allJobs[jobIndex].applicants) {
                allJobs[jobIndex].applicants = []
            }

            allJobs[jobIndex].applicants.push({
                userId: userInfo.id,
                applicationDate: new Date().toLocaleDateString(),
                status: "Pending",
                ranking: 0,
            })

            localStorage.setItem("jobs", JSON.stringify(allJobs))
            alert(`Successfully applied for ${job.title} at ${job.company}`)

            // Refresh applied jobs
            const newAppliedJob = {
                ...job,
                applicationStatus: "Pending",
                applicationDate: new Date().toLocaleDateString(),
            }
            setAppliedJobs([...appliedJobs, newAppliedJob])
        }
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const clearFilters = () => {
        setFilters({
            jobType: "",
            workplaceType: "",
            location: "",
        })
    }

    const handleLogout = () => {
        localStorage.removeItem("userInfo")
        router("/")
    }

    const filteredJobs = activeTab === "available" ? visibleJobs : appliedJobs

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-primary">
                                HR Portal
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-4">
                            <Link to="/user" className="text-gray-600 hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/user/jobs" className="text-primary font-medium">
                                Jobs
                            </Link>
                            <Link to="/user/applications" className="text-gray-600 hover:text-primary transition-colors">
                                Applications
                            </Link>
                            <Link to="/user/profile" className="text-gray-600 hover:text-primary transition-colors">
                                Profile
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                                    {userInfo?.name?.charAt(0) || "U"}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                                    <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <Menu className="h-6 w-6 text-gray-700" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-2 border-t border-gray-200">
                            <nav className="flex flex-col space-y-2">
                                <Link
                                    to="/user"
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link to="/user/jobs" className="px-4 py-2 bg-gray-50 text-primary font-medium">
                                    Jobs
                                </Link>
                                <Link
                                    to="/user/applications"
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    Applications
                                </Link>
                                <Link
                                    to="/user/profile"
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-left text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    Logout
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8" ref={containerRef}>
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
                    <p className="mt-2 text-gray-600">Browse through our curated list of job opportunities</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("available")}
                            className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm ${activeTab === "available"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Available Jobs
                        </button>
                        <button
                            onClick={() => setActiveTab("applied")}
                            className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm ${activeTab === "applied"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Applied Jobs
                            {appliedJobs.length > 0 && (
                                <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                    {appliedJobs.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search jobs by title, company, or location"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <Filter className="h-5 w-5" />
                            <span>Filter</span>
                            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 p-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                    <select
                                        name="jobType"
                                        value={filters.jobType}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                                    >
                                        <option value="">All Types</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Temporary">Temporary</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Workplace Type</label>
                                    <select
                                        name="workplaceType"
                                        value={filters.workplaceType}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                                    >
                                        <option value="">All Workplaces</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="Enter location"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Jobs List */}
                <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-md shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{activeTab === "available" ? "Available Jobs" : "Applied Jobs"}</h2>
                    </div>

                    {isLoading ? (
                        <div className="p-4 text-center">Loading jobs...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {activeTab === "available"
                                ? jobs.length === 0
                                    ? "No jobs available at this time."
                                    : "No jobs match your search criteria."
                                : "You haven't applied to any jobs yet."}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                                <div key={job.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            {/* Company Logo */}
                                            <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {job.logo ? (
                                                    <img src={job.logo || "/placeholder.svg"} alt={`${job.company} logo`} />
                                                ) : (
                                                    <div className="text-gray-400 text-lg font-bold">{job.company?.charAt(0) || "?"}</div>
                                                )}
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex flex-col">
                                                <Link to={`/user/jobs/${job.id}`} className="text-blue-600 font-medium hover:underline">
                                                    {job.title}
                                                </Link>
                                                <p className="text-sm">{job.company}</p>
                                                <p className="text-sm text-gray-600">{job.location}</p>

                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    {job.workplaceType && (
                                                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                                                            {job.workplaceType}
                                                        </span>
                                                    )}
                                                    {job.jobType && (
                                                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                                                            {job.jobType}
                                                        </span>
                                                    )}
                                                    {job.postedTime && <span className="text-xs text-gray-500">{job.postedTime}</span>}
                                                    {job.easyApply && (
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#0077B5">
                                                                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                                            </svg>
                                                            Easy Apply
                                                        </span>
                                                    )}
                                                    {activeTab === "applied" && job.applicationStatus && (
                                                        <span
                                                            className={`inline-block text-xs px-2 py-0.5 rounded ${job.applicationStatus === "Approved"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : job.applicationStatus === "Rejected"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                        >
                                                            {job.applicationStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                            {activeTab === "available" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleCloseJob(job.id)}
                                                        className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                                                        aria-label="Close job listing"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApply(job)}
                                                        className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
                                                    >
                                                        Apply <ExternalLink size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <Link
                                                    to={`/user/jobs/${job.id}`}
                                                    className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
                                                >
                                                    View Details <ExternalLink size={16} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "available" && jobs.length > initialDisplayCount && (
                        <div className="flex justify-center p-4">
                            <button
                                onClick={handleShowAll}
                                className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                            >
                                {showAll ? "Show less" : "Show all"}
                                {!showAll && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <polyline points="19 12 12 19 5 12"></polyline>
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

