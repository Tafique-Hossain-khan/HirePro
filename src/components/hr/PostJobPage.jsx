"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router"
import { ArrowLeft, Bold, Italic, List, AlignJustify } from "lucide-react"
import gsap from "gsap"

export default function PostJobPage() {
  const formRef = useRef(null)
  const editorRef = useRef(null)
  const successRef = useRef(null)

  const [description, setDescription] = useState(`Job Description:
- Develop and maintain web applications using React.js
- Collaborate with back-end developers and designers
- Optimize applications for maximum speed and scalability
- Design and implement new features and functionality

Requirements:
- Strong proficiency in JavaScript and React.js
- Experience with responsive design and CSS frameworks
- Familiarity with RESTful APIs and modern front-end build pipelines
- Knowledge of modern front-end build pipelines and tools
- Understanding of server-side rendering and its benefits`)

  const [jobTitle, setJobTitle] = useState("Frontend Developer")
  const [company, setCompany] = useState("Acme Inc")
  const [workplaceType, setWorkplaceType] = useState("On-site")
  const [jobLocation, setJobLocation] = useState("Bhubaneswar, Odisha, India")
  const [jobType, setJobType] = useState("Full-time")
  const [salary, setSalary] = useState("₹80,000 - ₹100,000")
  const [department, setDepartment] = useState("Engineering")
  const [deadline, setDeadline] = useState("")
  const [successMessage, setSuccessMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Initialize GSAP animations safely
    const tl = gsap.timeline()

    if (formRef.current) {
      tl.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    }

    const formFields = document.querySelectorAll(".form-field")
    if (formFields.length) {
      tl.fromTo(
        formFields,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        "-=0.4",
      )
    }

    // Set editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = description.replace(/\n/g, "<br>")
    }

    // Set default deadline to 30 days from now
    const defaultDeadline = new Date()
    defaultDeadline.setDate(defaultDeadline.getDate() + 30)
    setDeadline(defaultDeadline.toISOString().split("T")[0])
  }, [])

  const handleInput = (e) => {
    const content = e.currentTarget.innerHTML
    setDescription(content.replace(/<br>/g, "\n"))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      document.execCommand("insertLineBreak")
    }
  }

  const handleFormat = (command) => {
    document.execCommand(command === "bold" ? "bold" : "italic", false, null)
  }

  const handleBullet = () => {
    document.execCommand("insertUnorderedList", false, null)
  }

  const handleAlign = () => {
    document.execCommand("justifyFull", false, null)
  }

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
      setDescription("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Get HR info from localStorage
    const hrInfo = JSON.parse(localStorage.getItem("hrInfo") || "{}")

    const jobData = {
      id: Date.now(), // Generate a unique ID
      title: jobTitle,
      company: company,
      workplaceType: workplaceType,
      location: jobLocation,
      jobType: jobType,
      description: description,
      salary: salary,
      department: department,
      deadline: deadline,
      postedTime: "Just now",
      easyApply: true,
      hrId: hrInfo.id || 1, // Associate job with HR
      applicants: [], // Initialize empty applicants array
    }

    try {
      // In a real app, this would be an API call
      // For now, we'll store in localStorage
      const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]")
      localStorage.setItem("jobs", JSON.stringify([...existingJobs, jobData]))

      // Show success message
      setSuccessMessage(true)

      // Scroll to success message
      if (successRef.current) {
        successRef.current.scrollIntoView({ behavior: "smooth" })
      }

      // Animate success message
      gsap.to(".success-message", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccessMessage(false)
        gsap.to(".success-message", {
          opacity: 0,
          y: -10,
          duration: 0.5,
        })
        setIsSubmitting(false)
      }, 3000)
    } catch (error) {
      console.error("Error posting job:", error)
      setIsSubmitting(false)
    }
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
              <h1 className="text-xl font-bold text-gray-900">Post a New Job</h1>
            </div>
            <Link to="/hr/jobs" className="text-primary hover:text-primary/90 font-medium">
              View Posted Jobs
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8" ref={formRef}>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create Job Listing</h2>
            <p className="text-gray-500">
              Fill out the form below to create a new job listing. All fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold">Job details*</h2>

              <div className="space-y-4">
                <div className="form-field">
                  <label className="flex items-center gap-2 text-sm md:text-base">
                    Job title*
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                      ?
                    </div>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                  />
                </div>

                <div className="form-field">
                  <label className="text-sm md:text-base">Company*</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                  />
                </div>

                <div className="form-field">
                  <label className="text-sm md:text-base">Department*</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label className="text-sm md:text-base">Workplace type*</label>
                    <select
                      value={workplaceType}
                      onChange={(e) => setWorkplaceType(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 bg-white text-sm md:text-base"
                    >
                      <option>On-site</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="flex items-center gap-2 text-sm md:text-base">
                      Job location*
                      <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                        ?
                      </div>
                    </label>
                    <input
                      type="text"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label className="text-sm md:text-base">Job type*</label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 bg-white text-sm md:text-base"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Temporary</option>
                      <option>Internship</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="text-sm md:text-base">Salary Range</label>
                    
                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                      placeholder="e.g. ₹80,000 - ₹100,000"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="text-sm md:text-base">Application Deadline*</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <h2 className="text-lg md:text-xl font-semibold">Description*</h2>

                <div className="border border-gray-300 rounded">
                  <div className="border-b border-gray-300 p-1.5 md:p-2 flex items-center gap-2 md:gap-4">
                    <button
                      type="button"
                      onClick={() => handleFormat("bold")}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold size={18} className="md:w-5 md:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("italic")}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic size={18} className="md:w-5 md:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleBullet}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Bullet List"
                    >
                      <List size={18} className="md:w-5 md:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleAlign}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Justify"
                    >
                      <AlignJustify size={18} className="md:w-5 md:h-5" />
                    </button>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    className="p-3 md:p-4 text-sm md:text-base min-h-[200px] sm:min-h-[300px] focus:outline-none whitespace-pre-wrap"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    style={{ lineHeight: "1.5" }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    We added a template to help you.
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-blue-600 hover:underline transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div>{description.replace(/<[^>]*>/g, "").length}/10,000</div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  to="/"
                  className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </div>
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
              {/* Success message (hidden by default) */}
              <div
                ref={successRef}
                className="success-message bg-green-50 text-green-700 p-4 rounded-md mb-6 opacity-0 transform translate-y-[-10px]"
              >
                Job listing created successfully! It will be published shortly.
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

