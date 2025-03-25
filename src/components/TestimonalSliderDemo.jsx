import { FancyTestimonialsSlider } from "./eldoraui/testimonalslider";

export function TestimonalSliderDemo() {
  const testimonials = [
    {
      img: "https://avatars.githubusercontent.com/u/126356359?v=4",
    //   quote: "Make building UIs effortless great work!",
      name: "Mrutyunjaya Sahoo",
      role: "Front-end Developer",
    },
    {
      img: "https://i.postimg.cc/pV9FRqq9/SAVE-20240804-113849.jpg",
    //   quote:
    //     "EldoraUI simplifies complex designs with ready-to-use components.",
      name: "Tafique Hossain Khan",
      role: "Back-end Developer",
    }
  ];
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg border bg-background">
      <div className="mt-[64px] px-12 flex justify-center">
        <FancyTestimonialsSlider testimonials={testimonials} />
      </div>
    </div>
  );
}
