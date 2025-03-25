"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Minus,
  Calendar,
  Briefcase,
  Award,
  Languages,
  Check,
  X,
} from "lucide-react"

export default function UserRegisterPage() {
  const router = useNavigate()
  const formRef = useRef(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone: "",
    bio: "",
    skills: [],
    languages: [{ language: "", proficiency: "Beginner" }],
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
      },
    ],
    projects: [{ name: "", description: "", link: "" }],
    certifications: [{ name: "", provider: "", link: "" }],
  })
  const [skillInput, setSkillInput] = useState("")
  const [availableSkills] = useState([
    "JavaScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "HTML",
    "CSS",
    "TypeScript",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Git",
    "Agile",
    "Scrum",
    "Project Management",
    "UI/UX Design",
    "Figma",
    "Adobe XD",
    "Photoshop",
  ])
  const [filteredSkills, setFilteredSkills] = useState([])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize GSAP animations
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    }
  }, [])

  useEffect(() => {
    // Filter skills based on input
    if (skillInput.trim() === "") {
      setFilteredSkills([])
    } else {
      const filtered = availableSkills.filter(
        (skill) => skill.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(skill),
      )
      setFilteredSkills(filtered)
    }
  }, [skillInput, formData.skills, availableSkills])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...formData.languages]
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }))
  }

  const addLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "", proficiency: "Beginner" }],
    }))
  }

  const removeLanguage = (index) => {
    if (formData.languages.length > 1) {
      const updatedLanguages = [...formData.languages]
      updatedLanguages.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        languages: updatedLanguages,
      }))
    }
  }

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience]

    if (field === "currentlyWorking") {
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value,
        endDate: value ? "" : updatedExperience[index].endDate,
      }
    } else {
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value,
      }
    }

    setFormData((prev) => ({
      ...prev,
      experience: updatedExperience,
    }))
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (index) => {
    if (formData.experience.length > 1) {
      const updatedExperience = [...formData.experience]
      updatedExperience.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        experience: updatedExperience,
      }))
    }
  }

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      projects: updatedProjects,
    }))
  }

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", link: "" }],
    }))
  }

  const removeProject = (index) => {
    if (formData.projects.length > 1) {
      const updatedProjects = [...formData.projects]
      updatedProjects.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        projects: updatedProjects,
      }))
    }
  }

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...formData.certifications]
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }))
  }

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", provider: "", link: "" }],
    }))
  }

  const removeCertification = (index) => {
    if (formData.certifications.length > 1) {
      const updatedCertifications = [...formData.certifications]
      updatedCertifications.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        certifications: updatedCertifications,
      }))
    }
  }

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const validateStep = (stepNumber) => {
    const newErrors = {}

    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.password.trim()) newErrors.password = "Password is required"
      if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
      if (!formData.location.trim()) newErrors.location = "Location is required"
    } else if (stepNumber === 2) {
      if (!formData.bio.trim()) newErrors.bio = "Bio is required"
      if (formData.skills.length === 0) newErrors.skills = "At least one skill is required"
    } else if (stepNumber === 3) {
      const hasEmptyLanguage = formData.languages.some((lang) => !lang.language.trim())
      if (hasEmptyLanguage) newErrors.languages = "All language fields must be filled"
    } else if (stepNumber === 4) {
      const hasEmptyExperience = formData.experience.some(
        (exp) =>
          !exp.company.trim() || !exp.position.trim() || !exp.startDate || (!exp.endDate && !exp.currentlyWorking),
      )
      if (hasEmptyExperience) newErrors.experience = "All required experience fields must be filled"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      // Animate form transition
      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            setStep((prev) => prev + 1)
            gsap.to(formRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.3,
            })
          },
        })
      } else {
        setStep((prev) => prev + 1)
      }
    }
  }

  const handleBack = () => {
    // Animate form transition
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          setStep((prev) => prev - 1)
          gsap.to(formRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.3,
          })
        },
      })
    } else {
      setStep((prev) => prev - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateStep(step)) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const emailExists = users.some((user) => user.email === formData.email)

        if (emailExists) {
          setErrors({ email: "Email already exists" })
          setIsLoading(false)
          return
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          ...formData,
        }

        localStorage.setItem("users", JSON.stringify([...users, newUser]))

        // Set user as logged in
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          }),
        )

        // Show success animation
        if (formRef.current) {
          gsap.to(formRef.current, {
            scale: 1.05,
            duration: 0.2,
            onComplete: () => {
              gsap.to(formRef.current, {
                scale: 1,
                duration: 0.2,
                onComplete: () => {
                  // Redirect to profile page using Next.js router
                  router("/user/profile")
                },
              })
            },
          })
        } else {
          // Fallback direct navigation if animation fails
          router("/user/profile")
        }
      }, 1500)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4, 5].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNumber === step
                  ? "bg-primary text-white"
                  : stepNumber < step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber < step ? <Check className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < 5 && <div className={`w-10 h-1 ${stepNumber < step ? "bg-green-500" : "bg-gray-200"}`}></div>}
          </div>
        ))}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`pl-10 pr-4 py-2 w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 pr-4 py-2 w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`px-4 py-2 w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className={`pl-10 pr-4 py-2 w-full border ${errors.location ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Bio & Skills</h3>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Professional Bio*
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write a short professional bio about yourself..."
                className={`px-4 py-2 w-full border ${errors.bio ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
              ></textarea>
              {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills*</label>
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Search and add skills..."
                  className={`px-4 py-2 w-full border ${errors.skills ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-primary focus:border-primary`}
                />
                {filteredSkills.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}

              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-primary hover:text-primary/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Languages</h3>

            {errors.languages && <p className="text-sm text-red-600">{errors.languages}</p>}

            {formData.languages.map((lang, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Language #{index + 1}</h4>
                  {formData.languages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language*</label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => handleLanguageChange(index, "language", e.target.value)}
                        placeholder="e.g. English, Spanish, etc."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level*</label>
                    <select
                      value={lang.proficiency}
                      onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)}
                      className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addLanguage}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Language
            </button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>

            {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}

            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name*</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position*</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                      className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        disabled={exp.currentlyWorking}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`currentlyWorking-${index}`}
                        checked={exp.currentlyWorking}
                        onChange={(e) => handleExperienceChange(index, "currentlyWorking", e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor={`currentlyWorking-${index}`} className="ml-2 block text-sm text-gray-700">
                        I currently work here
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    rows="3"
                    placeholder="Describe your responsibilities and achievements..."
                    className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Experience
            </button>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Projects & Certifications</h3>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Projects</h4>

              {formData.projects.map((project, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Project #{index + 1}</h5>
                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                        className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                        rows="2"
                        className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                        placeholder="https://..."
                        className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addProject}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Another Project
              </button>
            </div>

            <div>
              <h4 className="font-medium mb-2">Certifications</h4>

              {formData.certifications.map((cert, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Certification #{index + 1}</h5>
                    {formData.certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                      <input
                        type="text"
                        value={cert.provider}
                        onChange={(e) => handleCertificationChange(index, "provider", e.target.value)}
                        placeholder="e.g. Coursera, Udemy, etc."
                        className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Link</label>
                      <input
                        type="url"
                        value={cert.link}
                        onChange={(e) => handleCertificationChange(index, "link", e.target.value)}
                        placeholder="https://..."
                        className="px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addCertification}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Another Certification
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/user/login" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Create Your Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md" ref={formRef}>
            {renderStepIndicator()}

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Profile...
                      </>
                    ) : (
                      "Create Profile"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

