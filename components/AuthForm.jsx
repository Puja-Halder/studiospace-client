
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Aperture, ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegister) {
      if (formData.password.length < 6) {
        toast.error("Password must contain at least 6 characters.");
        return;
      }

      if (!/[A-Z]/.test(formData.password)) {
        toast.error("Password must contain at least one uppercase letter.");
        return;
      }

      if (!/[a-z]/.test(formData.password)) {
        toast.error("Password must contain at least one lowercase letter.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    toast.info("Authentication will be connected in a later step.");
  };

  const handleGoogleSignIn = () => {
    toast.info("Google sign-in will be connected in a later step.");
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-5 py-16 sm:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-10">
          <Link href="/" className="flex items-center justify-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Aperture size={26} />
            </span>

            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Studio<span className="text-violet-600">Space</span>
            </span>
          </Link>

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isRegister ? "Create Your Account" : "Welcome Back"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {isRegister
                ? "Join StudioSpace and discover amazing creative spaces."
                : "Sign in to continue your creative journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {isRegister && (
                <p className="mt-2 text-xs text-gray-500">
                  At least 6 characters, including uppercase and lowercase letters.
                </p>
              )}
            </div>

            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-semibold text-white transition hover:bg-violet-700"
            >
              {isRegister ? "Create Account" : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-gray-500">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.6 6.1-14.7Z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.5-5c-1.8 1.2-4.1 2-7 2-5.4 0-10-3.7-11.6-8.7H5.7v5.2C9.1 39.5 16 44 24 44Z"
              />
              <path
                fill="#FBBC05"
                d="M12.4 27.5a12 12 0 0 1 0-7v-5.2H5.7a20 20 0 0 0 0 17.4l6.7-5.2Z"
              />
              <path
                fill="#EA4335"
                d="M24 11.8c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.8 29.5 4 24 4 16 4 9.1 8.5 5.7 15.3l6.7 5.2c1.6-5 6.2-8.7 11.6-8.7Z"
              />
            </svg>

            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-bold text-violet-600 hover:text-violet-800"
            >
              {isRegister ? "Sign In" : "Create Account"}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to use StudioSpace responsibly.
        </p>
      </div>
    </main>
  );
}
