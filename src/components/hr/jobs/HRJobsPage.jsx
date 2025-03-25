"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Search, Filter } from "lucide-react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap" // Import GSAP

export default function HRJobsPage() {
    const router = useNavigate()
    const [jobs, setJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredJobs, setFilteredJobs] = useState([])
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

        // Load jobs from localStorage
        const loadJobs = () => {
            setIsLoading(true)
            try {
                const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
                // Filter jobs by HR ID
                const hrJobs = storedJobs.filter((job) => job.hrId === hrInfo.id)
                setJobs(hrJobs)
                setFilteredJobs(hrJobs)
            } catch (error) {
                console.error("Error loading jobs:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (isLoggedIn) {
            loadJobs()
        }
    }, [router, isLoggedIn])

    useEffect(() => {
        // Filter jobs based on search term
        if (searchTerm.trim() === "") {
            setFilteredJobs(jobs)
        } else {
            const filtered = jobs.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            setFilteredJobs(filtered)
        }
    }, [searchTerm, jobs])

    const handleDeleteJob = (jobId) => {
        // Remove job from localStorage and state
        const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
        const updatedJobs = allJobs.filter((job) => job.id !== jobId)
        localStorage.setItem("jobs", JSON.stringify(updatedJobs))

        // Update local state
        const hrInfo = JSON.parse(localStorage.getItem("hrInfo") || "{}")
        const hrJobs = updatedJobs.filter((job) => job.hrId === hrInfo.id)
        setJobs(hrJobs)
        setFilteredJobs(
            hrJobs.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        )
    }

    if (!isLoggedIn) {
        return null // Don't render anything while redirecting
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/hr" className="text-gray-500 hover:text-gray-700 mr-4">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">Manage Job Listings</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/hr/post-job"
                                className="inline-flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Post New Job
                            </Link>
                            <Link
                                to="/hr/profile"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white"
                            >
                                {JSON.parse(localStorage.getItem("hrInfo") || "{}").name?.charAt(0) || "H"}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 page-content">
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
                        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                            <Filter className="h-5 w-5" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Posted
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading jobs...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            {jobs.length === 0 ? (
                                <>
                                    No jobs have been posted yet.
                                    <div className="mt-2">
                                        <Link to="/hr/post-job" className="text-primary hover:underline">
                                            Post your first job
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                "No jobs match your search criteria."
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                                <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-x-2 text-sm text-gray-500">
                                            <span>{job.company}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{job.location}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{job.jobType}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {job.postedTime || "Recently posted"}
                                            </span>
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {job.workplaceType}
                                            </span>
                                            {job.applicants && job.applicants.length > 0 && (
                                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {job.applicants.length} Applicant{job.applicants.length !== 1 ? "s" : ""}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-center">
                                        <Link
                                            to={`/hr/jobs/${job.id}/applicants`}
                                            className="text-sm text-primary hover:text-primary/90 font-medium"
                                        >
                                            View Applicants
                                        </Link>
                                        <Link
                                            to={`/hr/jobs/${job.id}`}
                                            className="text-sm text-primary hover:text-primary/90 font-medium"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete
                                        </button>
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

