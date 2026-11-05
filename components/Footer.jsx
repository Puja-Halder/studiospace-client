
import Link from "next/link";
import { Aperture, ArrowUpRight, Send, Mail } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Spaces", href: "/explore" },
  { name: "Become a Host", href: "/add-studio" },
  { name: "About Us", href: "/#about" },
];

const accountLinks = [
  { name: "Sign In", href: "/login" },
  { name: "Create Account", href: "/register" },
  { name: "My Bookings", href: "/my-bookings" },
  { name: "My Listings", href: "/my-listings" },
];

const categories = [
  { name: "Photography Studios", href: "/explore?category=photography" },
  { name: "Sound Stages", href: "/explore?category=sound-stage" },
  { name: "Podcast Rooms", href: "/explore?category=podcast" },
  { name: "Music Studios", href: "/explore?category=music" },
  { name: "Event Spaces", href: "/explore?category=event" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 px-5 pb-8 pt-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <Aperture size={25} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Studio<span className="text-violet-400">Space</span>
              </span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
              StudioSpace connects creators with inspiring spaces to bring
              their ideas to life. From photography studios to podcast rooms,
              discover and book the perfect creative environment.
            </p>

            <Link
              href="/explore"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-violet-400 transition hover:text-violet-300"
            >
              Discover Creative Spaces
              <ArrowUpRight size={17} />
            </Link>

            <div className="mt-8">
              <h3 className="text-sm font-bold">Follow Us</h3>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-gray-400 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                >
                  IG
                </a>

                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-gray-400 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                >
                  in
                </a>

                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-gray-400 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                >
                  YT
                </a>

                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-lg font-bold text-gray-400 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                >
                  𝕏
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold">Quick Links</h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-violet-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold">Your Account</h3>

            <ul className="mt-6 space-y-4">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-violet-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold">Popular Categories</h3>

            <ul className="mt-6 space-y-4">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-gray-400 transition hover:text-violet-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-b border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">
              Have a Space to <span className="text-violet-400">Share?</span>
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
              Turn your creative space into an opportunity. List your studio
              on StudioSpace and connect with creators looking for the perfect
              place to bring their ideas to life.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Become a Host
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} StudioSpace. All rights reserved.
            </p>

            <p className="mt-2 text-xs text-gray-600">
              All bookings are subject to applicable terms and conditions.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Made for creators, by StudioSpace.
          </p>
        </div>
      </div>
    </footer>
  );
}
