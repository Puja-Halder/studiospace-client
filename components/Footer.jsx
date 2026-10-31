
import Link from "next/link";
import { Aperture, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Spaces", href: "/explore" },
  { name: "Become a Host", href: "/add-studio" },
];

const accountLinks = [
  { name: "Sign In", href: "/login" },
  { name: "Create Account", href: "/register" },
  { name: "My Bookings", href: "/my-bookings" },
  { name: "My Listings", href: "/my-listings" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 px-5 pb-8 pt-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
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
              Discover inspiring photography studios, creative workspaces,
              and unique venues. Find the perfect space and bring your
              creative ideas to life with StudioSpace.
            </p>

            <Link
              href="/explore"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-violet-400 transition hover:text-violet-300"
            >
              Discover Creative Spaces
              <ArrowUpRight size={17} />
            </Link>
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
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-gray-500">
            © StudioSpace. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Made for creators, by StudioSpace.
          </p>
        </div>
      </div>
    </footer>
  );
}
