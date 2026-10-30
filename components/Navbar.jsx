
"use client";

import { useState } from "react";
import Link from "next/link";
import { Aperture, Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Spaces", href: "/explore" },
  { name: "Become a Host", href: "/add-studio" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Aperture size={25} />
          </span>

          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Studio<span className="text-violet-600">Space</span>
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition hover:text-violet-600"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-700 transition hover:text-violet-600"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Get Started
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700 hover:text-violet-600"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
              <Link
                href="/login"
                onClick={closeMenu}
                className="text-sm font-semibold text-gray-700"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Get Started
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
