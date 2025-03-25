import { Button } from "./ui/button";
import { motion } from "framer-motion";

const CTA = () => {
    return (
        <section className="relative overflow-hidden mt-10">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b -z-10"></div>

            {/* Abstract shapes */}
            <motion.div
                className="absolute top-0 right-64 w-96 h-96 bg-textColor rounded-full blur-3xl -z-10"
                animate={{
                    x: [0, 10, 0],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            ></motion.div>
            <motion.div
                className="absolute bottom-1/4 left-64 w-96 h-96 bg-purple-500 rounded-full blur-3xl -z-10"
                animate={{
                    x: [0, -10, 0],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            ></motion.div>

            <div className="container mx-auto px-4 md:px-8 mb-10">
                <motion.div
                    className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-primary to-purple-600 p-1"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                                    Ready to transform your hiring experience?
                                </h2>

                                <p className="text-muted-foreground text-lg text-gray-300">
                                    Join thousands of companies and job seekers who are already benefiting from HirePro&apos;s AI-powered platform.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" >
                                        Get Started
                                    </Button>
                                </div>
                            </motion.div>

                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="rounded-xl overflow-hidden">
                                    <div className="aspect-square md:aspect-video bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl flex items-center justify-center">
                                        <div className="w-full max-w-xs mx-auto p-6 space-y-6">
                                            <motion.div
                                                className="space-y-4 text-center"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.6 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                            >
                                                <motion.div
                                                    className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                    </svg>
                                                </motion.div>

                                                <div className="space-y-2">
                                                    <p className="font-medium text-gray-100">Join our growing community</p>
                                                    {/* <p className="text-sm text-muted-foreground">
                                                        100+ companies and 1 million+ job seekers
                                                    </p> */}
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                className="space-y-2"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.8 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                            >
                                                <div className="flex -space-x-2 justify-center">
                                                    {[...Array(6)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-10 h-10 rounded-full border-2 border-white  bg-gray-200 "
                                                            initial={{ opacity: 0, x: -10 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.8 + (i * 0.1), duration: 0.3 }}
                                                            viewport={{ once: true, margin: "-100px" }}
                                                        ></motion.div>
                                                    ))}
                                                </div>

                                                <div className="h-2 w-full bg-gray-100  rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-primary rounded-full"
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: '75%' }}
                                                        transition={{ delay: 1.2, duration: 0.8 }}
                                                        viewport={{ once: true, margin: "-100px" }}
                                                    ></motion.div>
                                                </div>

                                                <p className="text-center text-sm text-muted-foreground">
                                                    75% faster hiring process
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating elements */}
                                <motion.div
                                    className="absolute top-4 -right-4 w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-lg rotate-12"
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
                                    className="absolute -bottom-2 -left-4 w-16 h-16 bg-primary/10 rounded-lg -rotate-12"
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
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
