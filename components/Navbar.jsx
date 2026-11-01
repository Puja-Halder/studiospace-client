
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Aperture,
  Menu,
  X,
  ArrowUpRight,
  UserRound,
  ChevronDown,
  LogOut,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = Boolean(session?.user);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      closeMenu();
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  const userName = session?.user?.name || "My Account";
  const userInitial = userName.charAt(0).toUpperCase();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Spaces", href: "/explore" },
    { name: "Become a Host", href: "/add-studio" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Aperture size={23} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />
          ) : isLoggedIn ? (
            <>
              <Link
                href="/my-bookings"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                <CalendarDays size={17} />
                My Bookings
              </Link>

              <Link
                href="/my-listings"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                <LayoutDashboard size={17} />
                My Listings
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full border px-3 py-2 transition hover:bg-muted"
                  aria-expanded={isProfileOpen}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {userInitial}
                  </div>

                  <span className="max-w-28 truncate text-sm font-medium">
                    {userName}
                  </span>

                  <ChevronDown size={16} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl border bg-background p-2 shadow-lg">
                    <div className="border-b px-3 py-2">
                      <p className="truncate text-sm font-semibold">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>

                    <Link
                      href="/my-listings"
                      onClick={closeMenu}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                    >
                      <UserRound size={16} />
                      My Account
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition hover:bg-muted"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold transition hover:text-primary"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Get Started
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 transition hover:bg-muted md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t bg-background px-4 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t pt-4">
              {isPending ? (
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              ) : isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                      {userInitial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/my-bookings"
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <CalendarDays size={17} />
                    My Bookings
                  </Link>

                  <Link
                    href="/my-listings"
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <LayoutDashboard size={17} />
                    My Listings
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-left text-sm font-medium text-destructive"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-lg border px-4 py-3 text-center text-sm font-semibold"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Get Started
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
