"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, Star, LanguagesIcon, ExternalLink, FileText, Award } from "lucide-react"
import gsap from "gsap"

export default function HRUserProfilePage() {
    const params = useParams()
    const router = useNavigate()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userApplications, setUserApplications] = useState([])

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

        // Load user profile
        const loadUserProfile = () => {
            setIsLoading(true)
            try {
                const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
                const foundUser = allUsers.find((user) => user.id.toString() === params.id)

                if (foundUser) {
                    setUser(foundUser)

                    // Get all jobs this user has applied to
                    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
                    const applications = []

                    allJobs.forEach((job) => {
                        const application = job.applicants?.find((app) => app.userId.toString() === params.id)
                        if (application) {
                            applications.push({
                                jobId: job.id,
                                jobTitle: job.title,
                                company: job.company,
                                applicationDate: application.applicationDate,
                                status: application.status,
                                ranking: application.ranking,
                            })
                        }
                    })

                    setUserApplications(applications)
                } else {
                    router("/hr/jobs")
                }
            } catch (error) {
                console.error("Error loading user profile:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (isLoggedIn && params.id) {
            loadUserProfile()
        }
    }, [params.id, router, isLoggedIn])

    if (!isLoggedIn) {
        return null // Don't render anything while redirecting
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

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-6">The user profile you&#39;re looking for doesn&#39;t exist.</p>
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
                            <button onClick={() => router(-1)} className="text-gray-500 hover:text-gray-700 mr-4">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Candidate Profile</h1>
                        </div>
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
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 page-content">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-primary/10 p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                                {user.name?.charAt(0) || "U"}
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-lg text-gray-600">{user.title || "Job Seeker"}</p>
                                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-3">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            {user.phone}
                                        </div>
                                    )}
                                    {user.location && (
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            {user.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6">
                        {/* About */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">About</h3>
                            <p className="text-gray-600">{user.bio || user.about || "No information provided."}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Skills</h3>
                            {user.skills && user.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No skills listed.</p>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Languages</h3>
                            {user.languages && user.languages.length > 0 ? (
                                <div className="space-y-2">
                                    {user.languages.map((lang, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <LanguagesIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    {typeof lang === "string" ? lang : lang.language}
                                                </span>
                                                {typeof lang !== "string" && lang.proficiency && (
                                                    <span className="ml-2 text-sm text-gray-500">({lang.proficiency})</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No languages listed.</p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Experience</h3>
                            {(user.experience || user.experiences) &&
                                (user.experience?.length > 0 || user.experiences?.length > 0) ? (
                                <div className="space-y-4">
                                    {(user.experience || user.experiences || []).map((exp, index) => (
                                        <div key={index} className="border-l-2 border-gray-200 pl-4">
                                            <div className="flex items-start gap-2">
                                                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{exp.position || exp.title}</h4>
                                                    <p className="text-sm text-gray-600">{exp.company}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {exp.start_date ? new Date(exp.start_date).toLocaleDateString() : exp.startDate} -
                                                        {exp.currently_working || exp.currentlyWorking
                                                            ? " Present"
                                                            : exp.end_date
                                                                ? " " + new Date(exp.end_date).toLocaleDateString()
                                                                : exp.endDate
                                                                    ? " " + exp.endDate
                                                                    : " " + exp.duration}
                                                    </p>
                                                    <p className="mt-1 text-gray-600">{exp.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No experience listed.</p>
                            )}
                        </div>

                        {/* Education */}
                        {/* <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Education</h3>
                            {user.education && user.education.length > 0 ? (
                                <div className="space-y-4">
                                    {user.education.map((edu, index) => (
                                        <div key={index} className="border-l-2 border-gray-200 pl-4">
                                            <div className="flex items-start gap-2">
                                                <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                                                    <p className="text-sm text-gray-600">{edu.institution}</p>
                                                    <p className="text-sm text-gray-500">{edu.duration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No education listed.</p>
                            )}
                        </div> */}

                        {/* Projects */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Projects</h3>
                            {user.projects && user.projects.length > 0 ? (
                                <div className="space-y-4">
                                    {user.projects.map((project, index) => (
                                        <div key={index} className="border-l-2 border-gray-200 pl-4">
                                            <div className="flex items-start gap-2">
                                                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                                                        {project.link && (
                                                            <a
                                                                to={project.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:text-primary/80"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-gray-600">{project.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No projects listed.</p>
                            )}
                        </div>

                        {/* Certifications */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Certifications</h3>
                            {user.certifications && user.certifications.length > 0 ? (
                                <div className="space-y-4">
                                    {user.certifications.map((cert, index) => (
                                        <div key={index} className="border-l-2 border-gray-200 pl-4">
                                            <div className="flex items-start gap-2">
                                                <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                                                        {(cert.certificate_link || cert.link) && (
                                                            <a
                                                                to={cert.certificate_link || cert.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:text-primary/80"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{cert.provider}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No certifications listed.</p>
                            )}
                        </div>

                        {/* Applications */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Job Applications</h3>
                            {userApplications.length > 0 ? (
                                <div className="border rounded-md overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Job
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Company
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Applied
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Ranking
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {userApplications.map((app) => (
                                                <tr key={app.jobId}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link to={`/hr/jobs/${app.jobId}`} className="text-primary hover:underline">
                                                            {app.jobTitle}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.company}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {app.applicationDate || "Recently"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === "Approved"
                                                                ? "bg-green-100 text-green-800"
                                                                : app.status === "Rejected"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                        >
                                                            {app.status || "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-4 w-4 ${star <= app.ranking ? "text-yellow-400" : "text-gray-300"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600">No job applications found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}


