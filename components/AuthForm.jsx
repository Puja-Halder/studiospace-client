
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Aperture,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#17251F] dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-500";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        const result = await authClient.signUp.email({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        if (result.error) {
          toast.error(
            result.error.message || "Registration failed. Please try again."
          );
          return;
        }

        toast.success(
          "Account created! Please check your email for verification."
        );
      } else {
        const result = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (result.error) {
          toast.error(
            result.error.message || "Login failed. Please try again."
          );
          return;
        }

        toast.success("Welcome back to StudioSpace!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/login`,
        ...(isRegister
          ? {
              additionalData: {
                role: formData.role,
              },
            }
          : {}),
      });

      if (result.error) {
        toast.error(
          result.error.message || "Google sign-in failed. Please try again."
        );
        setIsGoogleLoading(false);
      }
    } catch (error) {
      toast.error(
        error.message || "Google sign-in failed. Please try again."
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5] px-4 py-12">
      <div className="mx-auto grid min-h-[650px] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-between bg-[#17251F] p-8 text-white md:p-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-[#D5F36A] p-2 text-[#17251F]">
              <Aperture size={25} />
            </div>

            <span className="text-2xl font-bold">StudioSpace</span>
          </Link>

          <div className="my-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#D5F36A]">
              Create. Connect. Collaborate.
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
              {isRegister
                ? "Find the space where creativity happens."
                : "Welcome back to your creative space."}
            </h1>

            <p className="max-w-md leading-7 text-gray-300">
              {isRegister
                ? "Join a community of creators and discover inspiring spaces for your next project."
                : "Sign in to manage your bookings, explore studios, and continue creating."}
            </p>
          </div>

          <p className="text-sm text-gray-400">
            Your creative journey starts here.
          </p>
        </div>

        <div className="flex items-center justify-center bg-white p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-[#17251F]">
                {isRegister ? "Create an account" : "Welcome back"}
              </h2>

              <p className="text-gray-500">
                {isRegister
                  ? "Enter your details to join StudioSpace."
                  : "Enter your details to access your account."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      I want to join as
                    </label>

                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#17251F] dark:bg-white dark:text-gray-900"
                    >
                      <option value="customer">
                        Customer — Find studios
                      </option>
                      <option value="host">
                        Host — List my studio
                      </option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    minLength={6}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                style={{
                  backgroundColor: "#17251F",
                  color: "#FFFFFF",
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold transition hover:bg-[#293D32] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Please wait..."
                  : isRegister
                    ? "Create Account"
                    : "Sign In"}

                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 48 48"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 37.96 46.98 31.8 46.98 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            <p className="mt-8 text-center text-sm text-gray-500">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                href={isRegister ? "/login" : "/register"}
                className="font-semibold text-[#17251F] hover:underline"
              >
                {isRegister ? "Sign in" : "Create account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
