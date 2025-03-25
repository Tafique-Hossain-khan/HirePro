"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap"
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  LanguagesIcon,
  Edit,
  ExternalLink,
  Menu,
  X,
  FileText,
  Github,
} from "lucide-react"

export default function UserProfilePage() {
  const router = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [activeCertId, setActiveCertId] = useState(null)

  const profileRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    if (!storedUserInfo.id) {
      router("/user/login")
      return
    }

    setUserInfo(storedUserInfo)

    // Get full user data
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.id === storedUserInfo.id)

    if (user) {
      setUserData(user)
    } else {
      router("/user/register")
      return
    }

    setIsLoading(false)

    // Initialize GSAP animations
    if (profileRef.current) {
      // Animate profile sections
      const sections = profileRef.current.querySelectorAll(".profile-section")

      gsap.fromTo(
        sections,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
      )
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    router("/user/login")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleProjectDetails = (id) => {
    setActiveProjectId(activeProjectId === id ? null : id)
  }

  const toggleCertDetails = (id) => {
    setActiveCertId(activeCertId === id ? null : id)
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/user" className="text-xl font-bold text-primary">
                User Portal
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/user" className="text-gray-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/user/jobs" className="text-gray-600 hover:text-primary transition-colors">
                Browse Jobs
              </Link>
              <Link to="/user/profile" className="text-primary font-medium">
                My Profile
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  {userData.name?.charAt(0) || "U"}
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
              <button className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 border-t border-gray-200">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/user"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="user/jobs"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/user/applications"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  My Applications
                </Link>
                <Link to="/user/profile" className="px-4 py-2 bg-gray-50 text-primary font-medium">
                  My Profile
                </Link>
                <Link
                  to="/user/mock-interview"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  Mock Interview
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
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8" ref={profileRef}>
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
            <div className="bg-primary/10 p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                  {userData.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                  <p className="text-gray-600">{userData.skills?.[0] || "Professional"}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                  </div>
                </div>
              </div>
              <div>
                <Link
                  to="/user/edit-profile"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-gray-900">{userData.email}</p>
                  </div>
                </div>

                {userData.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="mt-1 text-gray-900">{userData.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 whitespace-pre-line">{userData.bio || userData.about}</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userData.skills?.map((skill, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Languages Section */}
          {userData.languages?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <LanguagesIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{typeof lang === "string" ? lang : lang.language}</p>
                        {typeof lang !== "string" && lang.proficiency && (
                          <p className="text-sm text-gray-500">{lang.proficiency}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {userData.experience?.length > 0 && userData.experience[0].company && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h3>
                <div className="space-y-6">
                  {userData.experience.map(
                    (exp, index) =>
                      exp.company && (
                        <div key={index} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">{exp.position}</h4>
                              <p className="text-sm text-gray-600">{exp.company}</p>
                              <p className="text-sm text-gray-500">
                                {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                              </p>
                              {exp.description && <p className="mt-2 text-gray-600">{exp.description}</p>}
                            </div>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Education Section */}
          {userData.education && userData.education.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                <div className="space-y-6">
                  {userData.education.map((edu, index) => (
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
              </div>
            </div>
          )}

          {/* Projects Section */}
          {userData.projects && userData.projects.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Projects</h3>
                <div className="space-y-4">
                  {userData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleProjectDetails(index)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.link && (
                            <a
                              to={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button className="text-gray-500">
                            {activeProjectId === index ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-medium">View</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {activeProjectId === index && (
                        <div className="p-4 border-t border-gray-200">
                          <p className="text-gray-600">{project.description}</p>
                          {project.link && (
                            <div className="mt-3">
                              <a
                                to={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-primary hover:underline"
                              >
                                <Github className="mr-1 h-4 w-4" />
                                View Project Repository
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {userData.certifications && userData.certifications.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 profile-section">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-4">
                  {userData.certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleCertDetails(index)}
                      >
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-gray-400" />
                          <h4 className="font-medium text-gray-900">{cert.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {(cert.certificate_link || cert.link) && (
                            <a
                              to={cert.certificate_link || cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button className="text-gray-500">
                            {activeCertId === index ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-medium">View</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {activeCertId === index && (
                        <div className="p-4 border-t border-gray-200">
                          <p className="text-gray-600">Issued by: {cert.provider}</p>
                          {(cert.certificate_link || cert.link) && (
                            <div className="mt-3">
                              <a
                                to={cert.certificate_link || cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-primary hover:underline"
                              >
                                <Award className="mr-1 h-4 w-4" />
                                View Certificate
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center profile-section">
            <Link
              to="user/jobs"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90"
            >
              Browse Jobs
            </Link>
            <Link
              to="/user/edit-profile"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

