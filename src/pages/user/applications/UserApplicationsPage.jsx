"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap"
import { ArrowLeft, Search, Filter, CheckCircle, Clock, XCircle, Building, MapPin } from "lucide-react"

export default function UserApplicationsPage() {
  const router = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const containerRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    if (!storedUserInfo.id) {
      router("/user/login")
      return
    }

    setUserInfo(storedUserInfo)

    // Get user applications
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const userApplications = []

    allJobs.forEach((job) => {
      const application = job.applicants?.find((app) => app.userId === storedUserInfo.id)
      if (application) {
        userApplications.push({
          ...job,
          applicationStatus: application.status || "Pending",
          applicationDate: application.applicationDate,
          coverLetter: application.coverLetter,
          resumeHighlights: application.resumeHighlights,
        })
      }
    })

    setApplications(userApplications)
    setFilteredApplications(userApplications)
    setIsLoading(false)

    // Initialize GSAP animations
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    }
  }, [router])

  useEffect(() => {
    // Filter applications based on search term and status filter
    let filtered = applications

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.applicationStatus.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredApplications(filtered)
  }, [searchTerm, statusFilter, applications])

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
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
              <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8" ref={containerRef}>
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by job title or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredApplications.length} {filteredApplications.length === 1 ? "Application" : "Applications"}
            </h2>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {applications.length === 0 ? (
                <>
                  <p>You haven&#39;t applied to any jobs yet.</p>
                  <div className="mt-4">
                    <Link to="/jobs" className="text-primary hover:underline">
                      Browse available jobs
                    </Link>
                  </div>
                </>
              ) : (
                <p>No applications match your search criteria.</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                        <div className="text-gray-500 text-lg font-bold">{application.company?.charAt(0) || "?"}</div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{application.title}</h3>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Building className="h-4 w-4" />
                          <span>{application.company}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{application.location}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus)}`}
                          >
                            {getStatusIcon(application.applicationStatus)}
                            {application.applicationStatus}
                          </span>
                          <span className="text-xs text-gray-500">Applied on {application.applicationDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/user/applications/${application.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/user/jobs/${application.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                      >
                        View Job
                      </Link>
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

