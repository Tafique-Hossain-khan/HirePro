// Code for the HR Portal home page
// This code snippet is for the HR Portal home page. It includes a hero section, features section, and a call-to-action section. The hero section introduces the platform and its benefits, the features section highlights the key features of the platform, and the call-to-action section encourages users to get started with the platform.

import { useEffect, useRef } from "react"
import { Link } from "react-router"
import { gsap } from "gsap"
import { FileText, Users, BarChart3 } from "lucide-react"

export default function HRHomePage() {
    const heroRef = useRef(null)
    const featuresRef = useRef(null)
    const ctaRef = useRef(null)

    useEffect(() => {
        // Hero section animation
        gsap.from(heroRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
        })

        // Features section animation
        gsap.from(".feature-card", {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: featuresRef.current,
                start: "top 80%",
            },
        })

        // CTA section animation
        gsap.from(ctaRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 80%",
            },
        })
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b">
            {/* Navigation */}
            <nav className=" shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-primary">HR Portal</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Check if HR is logged in */}
                            {localStorage.getItem("hrInfo") ? (
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("hrInfo"); // Clear HR user info
                                        window.location.reload(); // Reload to reflect changes
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/hr/login"
                                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8" ref={heroRef}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Streamline Your</span>
                            <span className="block text-primary">Recruitment Process</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Efficiently manage job postings, applicants, and implement a powerful ranking system to find the best
                            talent for your organization.
                        </p>
                        <div className="mt-10 flex justify-center">
                            <Link
                                to={localStorage.getItem("hrInfo") ? "/hr/jobs" : "/hr/login"} // Conditional redirection
                                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" ref={featuresRef}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Powerful HR Management Features</h2>
                        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                            Our platform provides everything you need to streamline your recruitment process
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="feature-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Post Job Listings</h3>
                            <p className="text-gray-500 mb-4">
                                Create and manage job postings with detailed descriptions, requirements, and application deadlines.
                            </p>
                            <Link to="/hr/login" className="text-primary font-medium flex items-center hover:underline">
                                Post a Job
                            </Link>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Applicants</h3>
                            <p className="text-gray-500 mb-4">
                                View and manage all applicants in one place. Filter, sort, and track application status efficiently.
                            </p>
                            <Link to="/hr/login" className="text-primary font-medium flex items-center hover:underline">
                                View Applicants
                            </Link>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ranking System</h3>
                            <p className="text-gray-500 mb-4">
                                Implement a customizable ranking system to evaluate and compare candidates based on your criteria.
                            </p>
                            <Link to="/hr/login" className="text-primary font-medium flex items-center hover:underline">
                                Explore Rankings
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8" ref={ctaRef}>
                <div className="max-w-7xl mx-auto bg-primary rounded-2xl overflow-hidden shadow-xl">
                    <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                <span className="block">Ready to streamline your hiring?</span>
                                <span className="block text-white/90">Start using our platform today.</span>
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-white/80">
                                Join thousands of HR professionals who have transformed their recruitment process.
                            </p>
                        </div>
                        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                <Link
                                    to="/hr/post-job"
                                    className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Post a Job
                                </Link>
                            </div>
                            <div className="ml-3 inline-flex rounded-md shadow">
                                <Link
                                    to="/jobs"
                                    className="bg-primary/20 text-white px-6 py-3 rounded-md font-medium border border-white/20 hover:bg-primary/30 transition-colors"
                                >
                                    Browse Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">HR Portal</h3>
                            <p className="text-gray-400">Streamlining recruitment processes for modern HR departments.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Features</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/hr/post-job" className="text-gray-400 hover:text-white transition-colors">
                                        Post Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/jobs" className="text-gray-400 hover:text-white transition-colors">
                                        Find Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/hr/jobs" className="text-gray-400 hover:text-white transition-colors">
                                        Manage Jobs
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/guides" className="text-gray-400 hover:text-white transition-colors">
                                        Guides
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2">
                                <li className="text-gray-400">contact@hrportal.com</li>
                                <li className="text-gray-400">+1 (555) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} HR Portal. All rights reserved.</p>
                    </div>
                </div>
            </footer> */}
        </div>
    )
}

