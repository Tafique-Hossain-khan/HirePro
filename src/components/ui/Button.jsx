import PropTypes from "prop-types"
import { motion } from "motion/react"

export const Button = ({ children }) => {
    return (
        <div className="[perspective::1000px] [transform-style:preserve-3d] rounded-lg"
            style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6,182,212,0.1) 1px, transparent 0)`,
                backgroundSize: `8px 8px`,
                backgroundRepeat: `repeat`,
            }}>
            <motion.button
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                whileHover={
                    {
                        rotateX: 25,
                        rotateY: 10,
                        boxShadow: `0px 0px 10px 0px rgba(8,112,184,0.1)`,
                        y: -5
                    }
                }
                whileTap={{
                    y: 0
                }}
                whileFocus={{
                    y: -5
                }}
                style={{
                    translateZ: 100
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
                className="group relative bg-black text-neutral-500 px-12 rounded-lg py-4 shadow-[0px_1px_2px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset] hover:text-white transition-all duration-300">

                <span className="group-hover:text-cyan-500 transition-colors duration-300">{children}</span>

                <span className="absolute inset-x-0 bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px w-3/4 mx-auto"></span>

                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 inset-x-0 bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[4px] w-full mx-auto blur-sm"></span>
            </motion.button>
        </div>

    )
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
}
