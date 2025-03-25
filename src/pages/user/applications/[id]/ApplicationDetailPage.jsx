"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useParams, useNavigate } from "react-router"
import gsap from "gsap"
import { ArrowLeft, Building, MapPin, Clock, CheckCircle, XCircle, FileText, User } from "lucide-react"

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [application, setApplication] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const containerRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    if (!storedUserInfo.id) {
      router("/user/login")
      return
    }

    setUserInfo(storedUserInfo)

    // Get application details
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const job = allJobs.find((job) => job.id.toString() === params.id)

    if (job) {
      const userApplication = job.applicants?.find((app) => app.userId === storedUserInfo.id)

      if (userApplication) {
        setApplication({
          ...job,
          applicationStatus: userApplication.status || "Pending",
          applicationDate: userApplication.applicationDate,
          coverLetter: userApplication.coverLetter,
          resumeHighlights: userApplication.resumeHighlights,
        })
      } else {
        router("/user/applications")
      }
    } else {
      router("/user/applications")
    }

    setIsLoading(false)

    // Initialize GSAP animations
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    }
  }, [params.id, router])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return 3
      case "rejected":
        return 3
      case "pending":
      default:
        return 2
    }
  }

  if (isLoading || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
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
              <Link to="/user/applications" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Application Details</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8" ref={containerRef}>
        {/* Job Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                <div className="text-gray-500 text-2xl font-bold">{application.company?.charAt(0) || "?"}</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{application.title}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {application.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {application.location}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {application.workplaceType}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {application.jobType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.applicationStatus)}`}
                >
                  {getStatusIcon(application.applicationStatus)}
                  {application.applicationStatus}
                </span>
                <span className="text-sm text-gray-500">Applied on {application.applicationDate}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200"></div>
              </div>
              <ol className="relative flex justify-between">
                <li className="flex items-center">
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${getStatusStep(application.applicationStatus) >= 1
                        ? "bg-primary text-white"
                        : "bg-white border-2 border-gray-300"
                      }`}
                  >
                    <CheckCircle
                      className={`h-5 w-5 ${getStatusStep(application.applicationStatus) >= 1 ? "text-white" : "text-gray-300"}`}
                    />
                    <span className="sr-only">Applied</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Applied</span>
                </li>
                <li className="flex items-center">
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${getStatusStep(application.applicationStatus) >= 2
                        ? "bg-primary text-white"
                        : "bg-white border-2 border-gray-300"
                      }`}
                  >
                    <Clock
                      className={`h-5 w-5 ${getStatusStep(application.applicationStatus) >= 2 ? "text-white" : "text-gray-300"}`}
                    />
                    <span className="sr-only">Under Review</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Under Review</span>
                </li>
                <li className="flex items-center">
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${getStatusStep(application.applicationStatus) >= 3
                        ? application.applicationStatus?.toLowerCase() === "approved"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-white border-2 border-gray-300"
                      }`}
                  >
                    {application.applicationStatus?.toLowerCase() === "approved" ? (
                      <CheckCircle
                        className={`h-5 w-5 ${getStatusStep(application.applicationStatus) >= 3 ? "text-white" : "text-gray-300"}`}
                      />
                    ) : (
                      <XCircle
                        className={`h-5 w-5 ${getStatusStep(application.applicationStatus) >= 3 && application.applicationStatus?.toLowerCase() === "rejected" ? "text-white" : "text-gray-300"}`}
                      />
                    )}
                    <span className="sr-only">Decision</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Decision</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Application Details */}
        {/* <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Cover Letter
                </h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-gray-500" />
                  Resume Highlights
                </h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-line">{application.resumeHighlights}</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Actions */}
        <div className="flex justify-between">
          <Link
            to="/user/applications"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Applications
          </Link>
          <Link
            to={`/user/jobs/${application.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            View Job Details
          </Link>
        </div>
      </main>
    </div>
  )
}

