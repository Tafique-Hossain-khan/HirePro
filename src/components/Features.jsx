import { CheckCircle, Key, Shield, Sparkles, Zap } from "lucide-react";
function Features() {


    return (
        <>

            {/* Key Features */}
            <section className="section" id="features">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-bgText text-textColor mb-4">
                            <Sparkles size={16} />
                            <span>Key Features</span>
                        </div>
                        <h2 className="font-bold">Powered by cutting-edge technology</h2>
                        <p className="text-muted-foreground text-lg">
                            HirePro uses advanced AI and data-driven insights to transform the hiring process
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-300 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-bgText flex items-center justify-center mb-5 group-hover:bg-bgText transition-colors">
                                <Zap className="h-6 w-6 text-textColor" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">AI-Powered Matching</h3>
                            <p className="text-muted-foreground mb-4">
                                Intelligent algorithms match candidates to jobs based on skills, experience, and culture fit.
                            </p>
                            <ul className="space-y-2">
                                {['Smart skill analysis', 'Personality insights', 'Cultural fit evaluation'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-textColor shrink-0 mt-0.5" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white  rounded-xl p-6 shadow-sm border border-gray-300 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-bgText flex items-center justify-center mb-5 group-hover:bg-bgText transition-colors">
                                <Shield className="h-6 w-6 text-textColor" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Bias-Free Hiring</h3>
                            <p className="text-muted-foreground mb-4">
                                Eliminate unconscious bias with AI tools designed to focus on skills and potential.
                            </p>
                            <ul className="space-y-2">
                                {['Anonymous resume screening', 'Skill-based assessments', 'Structured interviews'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-textColor shrink-0 mt-0.5" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white  rounded-xl p-6 shadow-sm border border-gray-300  hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-bgText flex items-center justify-center mb-5 group-hover:bg-bgText transition-colors">
                                <Key className="h-6 w-6 text-textColor" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Career Growth Tools</h3>
                            <p className="text-muted-foreground mb-4">
                                Personalized development plans and learning recommendations for continuous improvement.
                            </p>
                            <ul className="space-y-2">
                                {['Skill gap analysis', 'Learning recommendations', 'Career path planning'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-textColor shrink-0 mt-0.5" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Feature 4 - Video Interview */}
                        <div className="bg-gradient-to-br from-textColor to-textColor backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-1 hover:shadow-md transition-all group">
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-5 bg-gray-100 ">
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-textColor/15 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-textColor/25 flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-textColor flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="white"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-center text-sm font-medium">Watch how HirePro works</p>
                                </div>
                            </div>
                            <h3 className="text-xl text-bgText font-bold  mb-2">Smart Video Interviews</h3>
                            <p className="text-muted">
                                Conduct and analyze video interviews with AI-powered insights on candidate responses and engagement.
                            </p>
                        </div>

                        {/* Feature 5 - Testimonial */}
                        <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2 hover:shadow-md transition-all group">
                            <blockquote className="font-medium text-lg mb-6">
                                &quot;HirePro has revolutionized our hiring process. We&apos;ve reduced time-to-hire by 40% while finding better candidates who stay longer.&quot;
                            </blockquote>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 "></div>
                                <div>
                                    <p className="font-medium">Sarah Johnson</p>
                                    <p className="text-sm text-muted-foreground">HR Director, TechCorp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Features;
