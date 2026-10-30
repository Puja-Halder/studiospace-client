
"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const slides = [
  {
    id: 1,
    label: "DISCOVER YOUR CREATIVE SPACE",
    title: "Find the Perfect Space to Create Something Amazing.",
    description:
      "Discover inspiring photography studios, creative workspaces, and unique venues designed to bring your ideas to life.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 2,
    label: "MAKE YOUR IDEAS HAPPEN",
    title: "Your Next Creative Project Starts Here.",
    description:
      "From professional photography studios to flexible creative spaces, find a place that matches your vision.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 3,
    label: "SHARE YOUR SPACE WITH THE WORLD",
    title: "Turn Your Creative Space into an Opportunity.",
    description:
      "List your studio, connect with talented creators, and make your space part of someone's next big idea.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=85",
  },
];

export default function HeroSlider() {
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="hero-slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative flex min-h-[560px] items-center bg-cover bg-center md:min-h-[650px]"
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

              <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-16 sm:px-8 lg:px-10">
                <div className="max-w-3xl">
                  <span className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-semibold tracking-[2px] text-white backdrop-blur-sm">
                    {slide.label}
                  </span>

                  <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="mt-6 max-w-2xl text-base leading-8 text-gray-200 sm:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="/explore"
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-violet-600 px-7 py-4 font-semibold text-white transition hover:bg-violet-700"
                    >
                      Explore Spaces
                      <ArrowRight size={19} />
                    </Link>

                    <Link
                      href="/add-studio"
                      className="inline-flex items-center justify-center gap-3 rounded-full border border-white/60 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-gray-900"
                    >
                      Become a Host
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

