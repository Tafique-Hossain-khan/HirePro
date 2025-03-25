import { Button } from "../components/ui/button"
import { motion } from 'framer-motion';
import { MorphingTextDemo } from "./MorphingTextDemo";
import ShinyText from "./ui/ShinyText";

const Hero = () => {
    console.log("Hero component rendering");

    return (
        <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-16 sm:pt-20 lg:pt-24 pb-16 overflow-hidden ">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent -z-10"></div>
            {/* Abstract shapes - made responsive */}
            <motion.div
                className="absolute top-1/3 -left-16 sm:-left-32 lg:-left-48 w-32 sm:w-64 lg:w-80 h-32 sm:h-64 lg:h-80 bg-primary/5 rounded-full blur-3xl -z-10"
                animate={{
                    x: [0, 10, 0],
                    opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            ></motion.div>
            <motion.div
                className="absolute bottom-1/4 -right-16 sm:-right-32 lg:-right-48 w-32 sm:w-64 lg:w-80 h-32 sm:h-64 lg:h-80 bg-purple-500/5 rounded-full blur-3xl -z-10"
                animate={{
                    x: [0, -10, 0],
                    opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            ></motion.div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    {/* Left content */}
                    <motion.div
                        className="space-y-6 sm:space-y-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="space-y-4">
                            <motion.p
                                className="text-xs sm:text-sm md:text-base font-medium text-primary inline-flex items-center gap-2 justify-center lg:justify-start"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <span className="bg-textColor-bgText text-textColor px-2 sm:px-3 py-1 rounded-full">New</span>

                                {/* Shiny Text */}
                                <span className="hidden sm:inline text-textColor">
                                    <ShinyText text="The future of hiring is here" disabled={false} speed={3} className='custom-class' />
                                </span>
                            </motion.p>

                            <div className="h-16 sm:h-20 md:h-24 lg:h-36 pt-10 lg:pt-20 pb-20 lg:pb-36 relative flex items-center justify-center lg:justify-start overflow-hidden">
                                <MorphingTextDemo />
                            </div>

                            <motion.p
                                className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Connect talent with opportunity using AI-powered tools for smarter hiring decisions and faster career advancement.
                            </motion.p>
                        </div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <Button className="w-full sm:w-auto text-sm sm:text-base">Get Started</Button>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm text-textColor-bgText justify-center lg:justify-start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <div className="flex -space-x-1 sm:-space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center border border-background"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + (i * 0.1), duration: 0.3 }}
                                    >
                                        <span className="text-xs text-green-500 font-bold">{i + 1}</span>
                                    </motion.div>
                                ))}
                            </div>
                            {/* <span className="text-center lg:text-left">Trusted by 10,000+ organizations worldwide</span> */}
                        </motion.div>
                    </motion.div>

                    {/* Right content - Hero image */}
                    <motion.div
                        className="relative h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mt-8 lg:mt-0"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10"
                            animate={{
                                background: [
                                    'linear-gradient(to bottom right, rgba(37, 99, 235, 0.1), rgba(168, 85, 247, 0.1))',
                                    'linear-gradient(to bottom right, rgba(37, 99, 235, 0.15), rgba(168, 85, 247, 0.15))',
                                    'linear-gradient(to bottom right, rgba(37, 99, 235, 0.1), rgba(168, 85, 247, 0.1))'
                                ]
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                        ></motion.div>

                        {/* Hero image container with glass effect */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <motion.div
                                className="h-full w-full overflow-hidden rounded-xl glass"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                    <div className="absolute w-full max-w-md mx-auto p-2 sm:p-4 lg:p-6 space-y-2 sm:space-y-4 lg:space-y-6">
                                        <motion.div
                                            className="h-8 sm:h-10 lg:h-12 w-16 sm:w-20 lg:w-24 bg-primary/10 rounded-lg mb-2 sm:mb-4 lg:mb-6"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.8, duration: 0.5 }}
                                        ></motion.div>

                                        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                            {[...Array(4)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`h-${i === 0 ? '6 sm:h-8' : '3 sm:h-4'} bg-${i === 0 ? 'primary/10' : 'gray-200'} rounded w-${i === 0 ? '2/3 sm:w-3/4' : i === 1 ? 'full' : i === 2 ? '4/5 sm:w-5/6' : '3/5 sm:w-4/6'}`}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.9 + (i * 0.1), duration: 0.5 }}
                                                ></motion.div>
                                            ))}
                                        </div>

                                        <motion.div
                                            className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 sm:pt-4"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.3, duration: 0.5 }}
                                        >
                                            <div className="h-8 sm:h-10 bg-primary rounded-lg"></div>
                                            <div className="h-8 sm:h-10 bg-gray-200 rounded-lg"></div>
                                        </motion.div>

                                        <motion.div
                                            className="pt-4 sm:pt-6 lg:pt-8 space-y-2 sm:space-y-3 lg:space-y-4"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.5, duration: 0.5 }}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200"></div>
                                                <div>
                                                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-24"></div>
                                                    <div className="h-2 sm:h-3 bg-gray-100 rounded w-20 sm:w-32 mt-1"></div>
                                                </div>
                                            </div>

                                            <div className="h-12 sm:h-16 lg:h-20 bg-gray-100 rounded-lg"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            className="absolute top-8 sm:top-12 -right-4 sm:-right-6 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-purple-100 dark:bg-purple-900/20 rounded-lg rotate-12"
                            animate={{
                                y: [0, -10, 0],
                                rotate: [12, 8, 12]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        ></motion.div>
                        <motion.div
                            className="absolute bottom-12 sm:bottom-16 lg:bottom-20 -left-4 sm:-left-6 w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-primary/10 rounded-lg -rotate-12"
                            animate={{
                                y: [0, 10, 0],
                                rotate: [-12, -8, -12]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 1
                            }}
                        ></motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;