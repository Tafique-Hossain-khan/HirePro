"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router"
import gsap from "gsap"
import { ArrowLeft, MapPin, Building, Clock, Calendar, Briefcase, DollarSign, CheckCircle } from "lucide-react"

export default function JobDetailPage() {
    const params = useParams()
    // const router = useRouter()
    const [job, setJob] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [applied, setApplied] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const contentRef = useRef(null)
    const successRef = useRef(null)



    useEffect(() => {
        // Check if user is logged in
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
        setUserInfo(storedUserInfo)

        // Initialize GSAP animations
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }

        // Fetch job details
        const fetchJobDetails = () => {
            setIsLoading(true)
            try {
                const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
                const foundJob = allJobs.find((job) => job.id.toString() === params.id)

                if (foundJob) {
                    setJob(foundJob)

                    // Check if user has already applied
                    if (storedUserInfo.id) {
                        const hasApplied = foundJob.applicants?.some((app) => app.userId === storedUserInfo.id)
                        setApplied(hasApplied)
                    }

                    setError(null)
                } else {
                    setError("Job not found")
                }
            } catch (error) {
                console.error("Error fetching job details:", error)
                setError("Failed to load job details")
            } finally {
                setIsLoading(false)
            }
        }

        if (params.id) {
            fetchJobDetails()
        }
    }, [params.id])

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

            // Show success animation and update UI
            if (successRef.current) {
                gsap.to(".success-message", {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power3.out",
                })

                // Scroll to top
                window.scrollTo({ top: 0, behavior: "smooth" })
            }

            // Set applied state to true
            setApplied(true)

            // Show success message
            alert(`Successfully applied for ${job.title} at ${job.company}`)
        }
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

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">The job you&#39;re looking for doesn&#39;t exist or has been removed.</p>
                    <Link to="/user/jobs" className="inline-flex items-center gap-2 text-primary hover:underline">
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
                            <Link to="/user/jobs" className="text-gray-500 hover:text-gray-700 mr-4">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">Job Details</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8" ref={contentRef}>
                {/* Success message (hidden by default) */}
                {applied && (
                    <div className="success-message bg-green-50 text-green-700 p-4 rounded-md mb-6 opacity-0 transform translate-y-[-10px]">
                        Your application has been submitted successfully! The employer will contact you if your profile matches
                        their requirements.
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Job Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start gap-4">
                            {/* Company Logo */}
                            <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                {job.logo ? (
                                    <img src={job.logo || "/placeholder.svg"} alt={`${job.company} logo`} />
                                ) : (
                                    <div className="text-gray-400 text-2xl font-bold">{job.company?.charAt(0) || "?"}</div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Building className="h-4 w-4" />
                                        {job.company}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {job.postedTime || "Recently posted"}
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {job.workplaceType}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {job.jobType}
                                    </span>
                                    {job.easyApply && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            Easy Apply
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Job Type</p>
                                    <p className="font-medium">{job.jobType}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Salary Range</p>
                                    <p className="font-medium">{job.salary || "Not specified"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Application Deadline</p>
                                    <p className="font-medium">{job.deadline || "Not specified"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                            <div className="prose max-w-none">
                                {job.description.split("\n").map((paragraph, index) => (
                                    <p key={index} className="mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">Department</h3>
                            <p>{job.department || "Not specified"}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Posted {job.postedTime || "recently"} • {job.easyApply ? "Easy Apply" : "Regular Application"}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    to="/user/jobs"
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Back to Jobs
                                </Link>
                                {applied ? (
                                    <button
                                        disabled
                                        className="px-6 py-2 rounded-md text-white bg-green-500 cursor-not-allowed flex items-center"
                                    >
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Applied
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApply(job)}
                                        className="px-6 py-2 rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

