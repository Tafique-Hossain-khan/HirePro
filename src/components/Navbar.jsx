import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from "lucide-react";
import logo from '../../public/assets/images/logo.jpg'

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Contact', href: '/contact' },
];

const navVariants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    },
    hidden: {
        y: -100,
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    }
};

const mobileMenuVariants = {
    closed: {
        opacity: 0,
        x: "100%",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    }
};

export const Navbar = () => {
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollThreshold = 50;

            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                setIsScrollingDown(true);
            } else if (currentScrollY < lastScrollY) {
                setIsScrollingDown(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: isScrollingDown ? '-100%' : 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 max-w-full overflow-hidden"
        >
            <AnimatePresence>
                {/* Backdrop overlay when menu is open */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.nav
                animate={isScrollingDown ? "hidden" : "visible"}
                initial="visible"
                variants={navVariants}
                className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-full"
            >
                <div className="glass-panel rounded-full px-2 sm:px-4 overflow-hidden py-2 sm:py-3 flex items-center justify-between shadow-lg backdrop-blur-md w-full">
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <div className="">
                                <img src={logo} alt="HirePro Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                            </div>
                            <span className="text-lg sm:text-xl font-semibold">HirePro</span>
                        </div>
                    </Link>


                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        {
                            navigation.map((item) => (
                                <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary text-lg lg:text-base
                                        ${isActive ?
                                            'text-blue-600 after:w-full' :
                                            'text-neutral-600 hover:text-primary after:w-0 hover:after:w-full after:transition-all duration-300'

                                        }`
                                    }
                                    key={item.name}
                                >
                                    {item.name}
                                </NavLink>
                            ))
                        }
                    </div>

                    {/* <div className="hidden md:flex items-center gap-2 lg:gap-4">
                        <NavLink to="/login">
                            <button className="px-3 py-1 lg:px-4 lg:py-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm lg:text-base">
                                Log in
                            </button>
                        </NavLink>

                        <NavLink to="/register">
                            <button className="button-secondary text-sm lg:text-base">
                                Register
                            </button>
                        </NavLink>
                    </div> */}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-1 hover:bg-neutral-200/50 rounded-full transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="md:hidden mt-2 rounded-xl p-4 shadow-lg relative bg-white/70 backdrop-blur-md border border-white/20 mx-2"
                        >
                            <div className="flex flex-col gap-4">
                                {
                                    navigation.map((item) => (
                                        <NavLink
                                            to={item.href}
                                            className={({ isActive }) =>
                                                `relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary 
                                                ${isActive ?
                                                    'text-blue-600 after:w-full' :
                                                    'text-neutral-600 hover:text-primary after:w-0 hover:after:w-full after:transition-all after:duration-300'
                                                } px-4 py-2 hover:bg-neutral-200/50 rounded-lg`
                                            }
                                            key={item.name}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))
                                }
                                {/* <NavLink to="/login">
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-primary hover:text-primary/80 transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg text-left">
                                        Log in
                                    </button>
                                </NavLink>
                                <NavLink to="/register">
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="button-secondary w-full">
                                        Register
                                    </button>
                                </NavLink> */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </motion.header>
    )
}

export default Navbar