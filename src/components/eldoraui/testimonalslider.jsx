"use client";

import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import PropTypes from 'prop-types';

export function FancyTestimonialsSlider({ testimonials }) {
    const testimonialsRef = useRef(null);
    const [active, setActive] = useState(0);
    const [autorotate, setAutorotate] = useState(true);
    const autorotateTiming = 7000;

    useEffect(() => {
        if (!autorotate) return;
        const interval = setInterval(() => {
            setActive(
                active + 1 === testimonials.length ? 0 : (active) => active + 1,
            );
        }, autorotateTiming);
        return () => clearInterval(interval);
    }, [active, autorotate, testimonials.length]);

    const heightFix = () => {
        if (testimonialsRef.current && testimonialsRef.current.parentElement)
            testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
    };

    useEffect(() => {
        heightFix();
    }, []);

    return (
        <div className="mx-auto w-full max-w-3xl text-center">
            {/* Testimonial image */}
            <div className="relative h-32">
                <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-textColor/25 before:via-textColor/5 before:via-25% before:to-textColor/0 before:to-75%">
                    <div className="h-32 [mask-image:_linear-gradient(0deg,transparent,theme(colors.white)_20%,theme(colors.white))]">
                        {testimonials.map((testimonial, index) => (
                            <Transition
                                as="div"
                                key={index}
                                show={active === index}
                                className="absolute inset-0 -z-10 h-full"
                                enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                                enterFrom="opacity-0 -rotate-[60deg]"
                                enterTo="opacity-100 rotate-0"
                                leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                                leaveFrom="opacity-100 rotate-0"
                                leaveTo="opacity-0 rotate-[60deg]"
                                beforeEnter={() => heightFix()}
                            >
                                <img
                                    className="relative left-1/2 top-11 -translate-x-1/2 rounded-full w-14 h-14 object-cover"
                                    src={testimonial.img}
                                    alt={testimonial.name}
                                />
                            </Transition>
                        ))}
                    </div>
                </div>
            </div>
            {/* Text */}
            <div className="mb-9 transition-all delay-300 duration-150 ease-in-out">
                <div className="relative flex flex-col items-center" ref={testimonialsRef}>
                    {testimonials.map((testimonial, index) => (
                        <Transition
                            key={index}
                            show={active === index}
                            enter="transition ease-in-out duration-500 delay-200 order-first"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-out duration-300 delay-300 absolute"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                            beforeEnter={() => heightFix()}
                        >
                            <div className="text-2xl font-bold text-cyan-900 absolute left-1/2 -translate-x-1/2 w-full before:content-['\201C'] after:content-['\201D']">
                                {testimonial.role}
                            </div>
                        </Transition>
                    ))}
                </div>
            </div>
            {/* Buttons */}
            <div className="-m-1.5 flex flex-wrap justify-center">
                {testimonials.map((testimonial, index) => (
                    <button
                        key={index}
                        className={`m-1.5 inline-flex justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring focus-visible:ring-fuchsia-300 dark:focus-visible:ring-fuchsia-600 ${active === index ? "bg-textColor-bgText text-textColor shadow-fuchsia-950/10" : "bg-white text-fuchsia-900 hover:bg-fuchsia-100"}`}
                        onClick={() => {
                            setActive(index);
                            setAutorotate(false);
                        }}
                    >
                        <span>{testimonial.name}</span>{" "}
                        <span
                            className={`${active === index ? "text-fuchsia-200" : "text-fuchsia-300"}`}
                        >
                            
                        </span>{" "}
                        {/* <span>{testimonial.role}</span> */}
                    </button>
                ))}
            </div>
        </div>
    );
}

FancyTestimonialsSlider.propTypes = {
    testimonials: PropTypes.arrayOf(PropTypes.shape({
        img: PropTypes.string.isRequired,
        quote: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    })).isRequired
};