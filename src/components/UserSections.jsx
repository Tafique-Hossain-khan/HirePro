import { useState } from 'react';
import { Briefcase, Users, LineChart, Clock, Search, Medal, BarChart } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router';

const UserSections = () => {
    const [activeTab, setActiveTab] = useState('hr');

    return (
        <section className="section bg-gradient-to-b" id="about">
            <div className="container mb-8 mx-auto px-4 md:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="font-bold text-4xl">Choose Your Path</h2>
                    <p className="text-muted-foreground text-lg">
                        HirePro offers specialized tools for both sides of the hiring equation
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-secondary/70 p-1 rounded-full">
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'hr'
                                ? 'bg-white dark:bg-gray-800 shadow-sm text-textColor'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setActiveTab('hr')}

                        >
                            For HR Professionals
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'jobseeker'
                                ? 'bg-white dark:bg-gray-800 shadow-sm text-emerald-400'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setActiveTab('jobseeker')}

                        >
                            For Job Seekers
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ">
                    {/* Image/Visual Side - Switches sides based on active tab */}
                    <div className={`order-1 ${activeTab === 'jobseeker' ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className="relative h-[400px] rounded-2xl overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${activeTab === 'hr'
                                ? 'from-textColor/10 to-purple-500/10'
                                : 'from-emerald-500/10 to-textColor/10'
                                } animate-pulse-slow`}></div>

                            <div className="absolute inset-0 flex items-center justify-center p-6">
                                <div className="h-full w-full overflow-hidden rounded-xl glass animate-scale-in">
                                    {activeTab === 'hr' ? (
                                        // HR Dashboard Preview
                                        <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6">
                                            <div className="h-8 w-32 bg-textColor/10 rounded mb-6"></div>

                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                                        <div className="h-4 w-12 bg-textColor/20 rounded mb-2"></div>
                                                        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 p-4">
                                                <div className="h-4 w-32 bg-textColor/20 rounded mb-3"></div>
                                                <div className="h-32 w-full bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                                            </div>

                                            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                                <div className="h-4 w-24 bg-textColor/20 rounded mb-3"></div>
                                                <div className="space-y-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                            <div className="ml-auto h-6 w-16 bg-textColor rounded"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Job Seeker Preview
                                        <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6">
                                            <div className="h-8 w-32 bg-emerald-500/10 rounded mb-6"></div>

                                            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 p-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                                                    <div>
                                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                                                        <div className="h-3 w-32 bg-gray-200/70 dark:bg-gray-600/70 rounded"></div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                                        <div className="flex justify-between mb-2">
                                                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                            <div className="h-5 w-16 bg-emerald-500/20 rounded"></div>
                                                        </div>
                                                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                                                        <div className="flex gap-2">
                                                            <div className="h-6 w-16 bg-gray-200/70 dark:bg-gray-600/70 rounded"></div>
                                                            <div className="h-6 w-16 bg-gray-200/70 dark:bg-gray-600/70 rounded"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className={`absolute top-10 -right-4 w-20 h-20 ${activeTab === 'hr' ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-emerald-100 dark:bg-emerald-900/20'
                                } rounded-lg rotate-12 animate-bounce-subtle`}></div>
                            <div className={`absolute bottom-16 -left-4 w-16 h-16 ${activeTab === 'hr' ? 'bg-textColor' : 'bg-emerald-500/10'
                                } rounded-lg -rotate-12 animate-bounce-subtle`} style={{ animationDelay: '0.5s' }}></div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className={`space-y-8 ${activeTab === 'jobseeker' ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'hr'
                                ? 'bg-textColor-bgText text-textColor '
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                }`}
                        >
                            {activeTab === 'hr' ? (
                                <>
                                    <Users size={16} />
                                    <span>For HR Professionals</span>
                                </>
                            ) : (
                                <>
                                    <Briefcase size={16} />
                                    <span>For Job Seekers</span>
                                </>
                            )}
                        </div>

                        <h2 className="font-bold text-3xl">
                            {activeTab === 'hr'
                                ? 'Post Jobs, Rank Candidates, and Streamline Hiring'
                                : 'Mock Interviews, Job Search, and Career Growth'
                            }
                        </h2>

                        <p className="text-muted-foreground text-lg">
                            {activeTab === 'hr'
                                ? 'Take control of your hiring process with AI-powered tools that help you find the right candidates faster and make smarter decisions.'
                                : 'Prepare for your next career move with personalized tools designed to help you stand out, practice interviews, and find the perfect job.'
                            }
                        </p>

                        <div className="space-y-6">
                            {activeTab === 'hr' ? (
                                // HR Features
                                <>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-textColor-bgText flex items-center justify-center shrink-0">
                                            <LineChart className="h-6 w-6 text-textColor" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">AI-driven Candidate Ranking</h3>
                                            <p className="text-muted-foreground">Identify top talent quickly with intelligent matching algorithms.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-textColor-bgText flex items-center justify-center shrink-0">
                                            <Briefcase className="h-6 w-6 text-textColor" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Seamless Job Posting & Dashboard</h3>
                                            <p className="text-muted-foreground">Manage your entire hiring pipeline from one intuitive interface.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-textColor-bgText flex items-center justify-center shrink-0">
                                            <Clock className="h-6 w-6 text-textColor" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Efficient Hiring Process</h3>
                                            <p className="text-muted-foreground">Reduce time-to-hire with automated screening and scheduling tools.</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Job Seeker Features
                                <>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <BarChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Mock Interviews with AI Feedback</h3>
                                            <p className="text-muted-foreground">Practice and improve with realistic interview simulations.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <Search className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Smart Job Search</h3>
                                            <p className="text-muted-foreground">Discover personalized job recommendations based on your skills and preferences.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <Medal className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Profile Builder</h3>
                                            <p className="text-muted-foreground">Showcase your skills, projects, and certifications to stand out to employers.</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {

                        }
                        <Link to={activeTab === 'hr' ? '/hr' : '/user'}>
                            <Button
                                className={activeTab === 'jobseeker' ? 'active-jobseeker' : 'active-hr'}
                            >
                                Register Now
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserSections;
