
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  ArrowRight,
  ImageIcon,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedStudios = async () => {
      setLoading(true);
      setError("");

      const maxRetries = 2;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch("/api/studios?limit=6", {
            cache: "no-store",
          });

          const contentType = response.headers.get("content-type") || "";
          const responseText = await response.text();

          if (!contentType.includes("application/json")) {
            throw new Error(
              response.status >= 500
                ? "The server is temporarily unavailable. Please try again."
                : "The server returned an unexpected response."
            );
          }

          let result;

          try {
            result = JSON.parse(responseText);
          } catch {
            throw new Error("The server returned an invalid response.");
          }

          if (!response.ok || !result.success) {
            throw new Error(
              result.message || "Failed to load featured studios."
            );
          }

          if (!Array.isArray(result.data)) {
            throw new Error("Invalid studio data received from the server.");
          }

          if (isMounted) {
            setStudios(result.data);
            setError("");
          }

          return;
        } catch (err) {
          if (attempt < maxRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1500 * (attempt + 1))
            );
          } else if (isMounted) {
            const message =
              err.message || "Failed to load featured studios.";

            setError(message);
            toast.error(message);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    fetchFeaturedStudios().finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((previous) => previous + 1);
  };

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Discover Spaces
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Studios
            </h2>

            <p className="mt-3 max-w-xl text-muted-foreground">
              Explore creative spaces where your next great idea can
              come to life.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 font-semibold text-primary transition hover:gap-3"
          >
            Explore All Spaces
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <LoaderCircle className="h-9 w-9 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading featured studios...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="font-medium text-destructive">{error}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-primary px-5 py-2 text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        ) : studios.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />

            <h3 className="mt-4 text-xl font-semibold">
              No studios available yet
            </h3>

            <p className="mt-2 text-muted-foreground">
              Be the first to list a creative space on StudioSpace.
            </p>

            <Link
              href="/add-studio"
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              List Your Studio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden bg-muted">
                  {studio.images?.[0] ? (
                    <Image
                      src={studio.images[0]}
                      alt={studio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1.5 text-xs font-semibold capitalize shadow">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold">{studio.name}</h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    {studio.location?.city},{" "}
                    {studio.location?.address}
                  </p>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {studio.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <p className="text-xl font-bold text-primary">
                      ৳{Number(studio.pricePerHour).toLocaleString("en-BD")}
                      <span className="text-sm font-normal text-muted-foreground">
                        /hour
                      </span>
                    </p>

                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users size={16} />
                      {studio.capacity} guests
                    </p>
                  </div>

                  <Link
                    href={`/studio/${studio._id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
