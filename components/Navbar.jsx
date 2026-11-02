
"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  Plus,
  Sun,
  Moon,
  Compass,
  Info,
  CircleHelp,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = Boolean(session?.user);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      closeMenu();
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  const userName = session?.user?.name || "My Account";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session?.user?.image;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/explore", icon: Compass },
    { name: "How It Works", href: "/#how-it-works", icon: CircleHelp },
    { name: "About Us", href: "/#about", icon: Info },
  ];

  const profileLinks = [
    {
      name: "Dashboard",
      href: "/host-bookings",
      icon: LayoutDashboard,
    },
    {
      name: "Add New Studio",
      href: "/add-studio",
      icon: Plus,
    },
    {
      name: "My Studio Listings",
      href: "/my-listings",
      icon: Aperture,
    },
    {
      name: "My Bookings",
      href: "/my-bookings",
      icon: CalendarDays,
    },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderThemeIcon = () => {
    if (!mounted) {
      return <span className="h-[19px] w-[19px]" />;
    }

    return resolvedTheme === "dark" ? (
      <Sun size={19} />
    ) : (
      <Moon size={19} />
    );
  };

  const themeButtonLabel = mounted
    ? resolvedTheme === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Change theme";

  const renderAvatar = (size = "h-9 w-9") => (
    <div
      className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground`}
    >
      {userImage ? (
        <Image
          src={userImage}
          alt={userName}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        userInitial
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Aperture size={25} strokeWidth={2.2} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}

                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            disabled={!mounted}
            aria-label={themeButtonLabel}
            title={themeButtonLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:bg-muted disabled:opacity-50"
          >
            {renderThemeIcon()}
          </button>

          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                onMouseEnter={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1.5 transition hover:bg-muted"
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
              >
                {renderAvatar()}

                <span className="max-w-28 truncate text-sm font-semibold">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div
                  onMouseLeave={() => setIsProfileOpen(false)}
                  className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-border bg-background p-2 shadow-xl"
                >
                  <div className="flex items-center gap-3 border-b border-border px-3 py-3">
                    {renderAvatar("h-10 w-10")}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {userName}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    {profileLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenu}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                            isActive(link.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon size={17} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-border pt-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Register
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            disabled={!mounted}
            aria-label={themeButtonLabel}
            title={themeButtonLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:bg-muted disabled:opacity-50"
          >
            {renderThemeIcon()}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 transition hover:bg-muted"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  {link.name}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-border pt-4">
              {isPending ? (
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              ) : isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center gap-3 px-3 py-2">
                    {renderAvatar("h-11 w-11")}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {userName}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  {profileLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                          isActive(link.href)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold transition hover:bg-muted"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Register
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
