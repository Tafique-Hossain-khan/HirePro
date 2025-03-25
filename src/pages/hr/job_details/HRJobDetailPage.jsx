
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { gsap } from "gsap"
import { ArrowLeft, MapPin, Building, Clock, Calendar, Briefcase, Edit, Users, Trash } from "lucide-react"

export default function JobDetailsPage() {
    const params = useParams()
    const router = useNavigate()
    const [job, setJob] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // Check if HR is logged in
        const hrInfo = JSON.parse(localStorage.getItem("hrInfo") || "{}")
        if (!hrInfo.id) {
            router("/hr/login")
            return
        }
        setIsLoggedIn(true)

        // Initialize GSAP animations
        const pageContent = document.querySelector(".page-content")
        if (pageContent) {
            gsap.fromTo(pageContent, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }

        // Load job details
        const loadJobDetails = () => {
            setIsLoading(true)
            try {
                const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
                const foundJob = allJobs.find((j) => j.id.toString() === params.id)

                if (foundJob && foundJob.hrId === hrInfo.id) {
                    setJob(foundJob)
                } else {
                    router("/hr/jobs")
                }
            } catch (error) {
                console.error("Error loading job details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (isLoggedIn && params.id) {
            loadJobDetails()
        }
    }, [params.id, router, isLoggedIn])

    const handleDeleteJob = () => {
        if (confirm("Are you sure you want to delete this job posting?")) {
            // Remove job from localStorage
            const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
            const updatedJobs = allJobs.filter((j) => j.id.toString() !== params.id)
            localStorage.setItem("jobs", JSON.stringify(updatedJobs))

            // Redirect to jobs page
            router("/hr/jobs")
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
                    <p className="mt-4 text-gray-600">Loading job details...</p>
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The job listing you&#39;re looking for doesn&#39;t exist or you don&#39;t have permission to view it.
                    </p>
                    <Link to="/hr/jobs" className="inline-flex items-center gap-2 text-primary hover:underline">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Jobs
                    </Link>
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
                            <h1 className="text-xl font-bold text-gray-900">Job Details</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to={`/hr/jobs/${job.id}/applicants`}
                                className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                View Applicants
                                {job.applicants && job.applicants.length > 0 && (
                                    <span className="ml-1 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                        {job.applicants.length}
                                    </span>
                                )}
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
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 page-content">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Job Header */}
                    <div className="bg-primary/10 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Building className="h-4 w-4" />
                                        {job.company}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        {job.jobType}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/hr/post-job?edit=${job.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDeleteJob}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                                >
                                    <Trash className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Clock className="h-3 w-3 mr-1" />
                                {job.postedTime || "Recently posted"}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {job.workplaceType}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {job.department}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Calendar className="h-3 w-3 mr-1" />
                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Job Content */}
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Salary Range</h3>
                            <p className="text-gray-700">{job.salary || "Not specified"}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Job Description</h3>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{job.description}</div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Application Statistics</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-700">{job.applicants?.length || 0}</div>
                                    <div className="text-sm text-green-600">Total Applicants</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700">
                                        {job.applicants?.filter((app) => app.status === "Approved").length || 0}
                                    </div>
                                    <div className="text-sm text-blue-600">Approved</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-700">
                                        {job.applicants?.filter((app) => app.status === "Pending").length || 0}
                                    </div>
                                    <div className="text-sm text-yellow-600">Pending Review</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
