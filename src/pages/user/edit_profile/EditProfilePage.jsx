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
    X,
} from "lucide-react"


export default function EditProfilePage() {
    const router = useNavigate()
    const [userInfo, setUserInfo] = useState(null)
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
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const formRef = useRef(null)

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
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: user.password || "",
                location: user.location || "",
                phone: user.phone || "",
                bio: user.bio || "",
                skills: user.skills || [],
                languages: user.languages?.length > 0 ? user.languages : [{ language: "", proficiency: "Beginner" }],
                experience:
                    user.experience?.length > 0
                        ? user.experience
                        : [
                            {
                                company: "",
                                position: "",
                                startDate: "",
                                endDate: "",
                                currentlyWorking: false,
                                description: "",
                            },
                        ],
                projects: user.projects?.length > 0 ? user.projects : [{ name: "", description: "", link: "" }],
                certifications: user.certifications?.length > 0 ? user.certifications : [{ name: "", provider: "", link: "" }],
            })
        } else {
            router("/user/register")
            return
        }

        setIsLoading(false)

        // Initialize GSAP animations
        if (formRef.current) {
            gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        }
    }, [router])

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

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.bio.trim()) newErrors.bio = "Bio is required"
        if (formData.skills.length === 0) newErrors.skills = "At least one skill is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            setIsSaving(true)

            // Simulate API call
            setTimeout(() => {
                // Update user in localStorage
                const users = JSON.parse(localStorage.getItem("users") || "[]")
                const userIndex = users.findIndex((u) => u.id === userInfo.id)

                if (userIndex !== -1) {
                    users[userIndex] = {
                        ...users[userIndex],
                        ...formData,
                    }

                    localStorage.setItem("users", JSON.stringify(users))

                    // Update userInfo
                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify({
                            id: userInfo.id,
                            name: formData.name,
                            email: formData.email,
                        }),
                    )

                    // Show success animation
                    if (formRef.current) {
                        gsap.to(formRef.current, {
                            scale: 1.02,
                            duration: 0.2,
                            onComplete: () => {
                                gsap.to(formRef.current, {
                                    scale: 1,
                                    duration: 0.2,
                                    onComplete: () => {
                                        // Redirect to profile page
                                        router("/user/profile")
                                    },
                                })
                            },
                        })
                    } else {
                        router("/user/profile")
                    }
                }
            }, 1500)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/user/profile" className="text-gray-500 hover:text-gray-700 mr-4">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md" ref={formRef}>
                        <form onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>

                                <div className="space-y-4">
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
                            </div>

                            {/* Bio & Skills */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Bio & Skills</h2>

                                <div className="space-y-4">
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
                            </div>

                            {/* Languages */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Languages</h2>

                                {formData.languages.map((lang, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium">Language #{index + 1}</h3>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
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

                            {/* Work Experience */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h2>

                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium">Experience #{index + 1}</h3>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
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

                            {/* Projects */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Projects</h2>

                                {formData.projects.map((project, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium">Project #{index + 1}</h3>
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

                            {/* Certifications */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Certifications</h2>

                                {formData.certifications.map((cert, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium">Certification #{index + 1}</h3>
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

                            {/* Submit Button */}
                            <div className="mt-8 flex justify-end">
                                <Link
                                    to="/user/profile"
                                    className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors ${isSaving ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {isSaving ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}


