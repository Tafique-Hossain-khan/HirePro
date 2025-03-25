"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Briefcase, CheckCircle, User, LogOut, MessageSquare, Menu, X } from "lucide-react"
import placeholder from '../../../public/assets/images/placeholder.svg'

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}


export default function UserHomePage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ id: "", name: "" }); // Initialize with default values
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || '{"id":"","name":"Guest"}');

        if (!storedUserInfo.id) {
            // For now, we'll keep the user on this page even if not logged in
            // In a real app, you might redirect: navigate("/user/login");
        }

        setUserInfo(storedUserInfo);

        // Initialize GSAP animations
        const tl = gsap.timeline();

        // Hero section animations
        if (heroRef.current) {
            tl.fromTo(
                heroRef.current.querySelector(".hero-content"),
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );

            tl.fromTo(
                heroRef.current.querySelector(".hero-image"),
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
                "-=0.5"
            );
        }

        // Stats section animations
        if (statsRef.current) {
            gsap.fromTo(
                statsRef.current.querySelectorAll(".stat-item"),
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 80%",
                    },
                }
            );
        }

        // Features section animations
        if (featuresRef.current) {
            gsap.fromTo(
                featuresRef.current.querySelectorAll(".feature-card"),
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: "top 80%",
                    },
                }
            );
        }

        // CTA section animations
        if (ctaRef.current) {
            gsap.fromTo(
                ctaRef.current,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top 80%",
                    },
                }
            );
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/user/login");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
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
                            <Link to="/user" className="text-primary font-medium">
                                Dashboard
                            </Link>

                            <Link to={localStorage.getItem("userInfo") ? "/user/jobs" : "/user/login"}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                Browse Jobs
                            </Link>
                            <Link to={localStorage.getItem("userInfo") ? "/user/applications" : "/user/login"}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                My Application
                            </Link>
                            <Link to={localStorage.getItem("userInfo") ? "/user/profile" : "/user/login"}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                My Profile
                            </Link>


                        </nav>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                                    {userInfo.name?.charAt(0) || "U"}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <User className="inline-block w-4 h-4 mr-2" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut className="inline-block w-4 h-4 mr-2" />
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
                                <Link to="/user" className="px-4 py-2 bg-gray-50 text-primary font-medium">
                                    Dashboard
                                </Link>
                                <Link to={localStorage.getItem("userInfo") ? "/user/jobs" : "/user/login"}
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
                                    Browse Jobs
                                </Link>
                                <Link to={localStorage.getItem("userInfo") ? "/user/applications" : "/user/login"}
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
                                    My Application
                                </Link>
                                <Link to={localStorage.getItem("userInfo") ? "/user/profile" : "/user/login"}
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
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

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16" ref={heroRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-x-12">
                        <div className="md:w-1/2 mb-10 md:mb-0 hero-content">
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4">
                                Welcome back, <span className="text-primary">{userInfo.name}</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Find your dream job and take the next step in your career journey.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to={localStorage.getItem("userInfo") ? "/user/jobs" : "/user/login"}
                                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-"
                                >
                                    Browse Jobs
                                </Link>
                                <Link
                                    to="/user/login"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <MessageSquare className="mr-2 h-5 w-5" />
                                    AI Mock Interview
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 hero-image">
                            <img
                                src={placeholder}
                                alt="Job search illustration"
                                className="w-full h-auto rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>


            {/* Stats Section */}
            <section className="py-16 bg-gray-50" ref={statsRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Platform Statistics</h2>
                        <p className="mt-4 text-xl text-gray-600">Join thousands of professionals finding their dream jobs</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md stat-item">
                            <div className="text-primary text-4xl font-bold mb-2">5,000+</div>
                            <div className="text-gray-600">Active Job Listings</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md stat-item">
                            <div className="text-primary text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-gray-600">Registered Users</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md stat-item">
                            <div className="text-primary text-4xl font-bold mb-2">2,500+</div>
                            <div className="text-gray-600">Companies Hiring</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md stat-item">
                            <div className="text-primary text-4xl font-bold mb-2">85%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white" ref={featuresRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
                        <p className="mt-4 text-xl text-gray-600">Everything you need to advance your career</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow feature-card">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Search</h3>
                            <p className="text-gray-600 mb-4">
                                Browse thousands of job listings from top companies across various industries.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow feature-card">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Mock Interviews</h3>
                            <p className="text-gray-600 mb-4">
                                Practice with our AI-powered mock interviews to prepare for your real interviews.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow feature-card">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <CheckCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Application Tracking</h3>
                            <p className="text-gray-600 mb-4">
                                Keep track of all your job applications and their statuses in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gray-50" ref={ctaRef}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                    <span className="block">Ready to ace your next interview?</span>
                                    <span className="block text-indigo-100">Try our AI Mock Interview tool.</span>
                                </h2>
                                <p className="mt-4 text-lg leading-6 text-white/80">
                                    Practice with realistic interview questions tailored to your industry and get instant feedback.
                                </p>
                            </div>
                            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                                <div className="inline-flex rounded-md shadow">
                                    <Link
                                        to="/user/login"
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50"
                                    >
                                        Start Practice
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};



