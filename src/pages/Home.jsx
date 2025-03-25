import CTA from "../components/CTA";
import Features from "../components/Features";
import Hero from "../components/Hero";
import { TestimonalSliderDemo } from "../components/TestimonalSliderDemo";
import HorizontalScrollTextAnimation from "../components/ui/HorizontalScrollTextAnimation";
import UserSections from "../components/UserSections";

function Home() {
    console.log("Home component rendering");
    return (
        <>

            <Hero />
            <UserSections />
            <Features />
            <HorizontalScrollTextAnimation/>
            <CTA />
            <TestimonalSliderDemo />
        </>

    );
}

export default Home;
