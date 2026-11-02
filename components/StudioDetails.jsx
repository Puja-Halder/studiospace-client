"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import BookingForm from "@/components/BookingForm";

export default function StudioDetails({ studio }) {
  const price = Number(studio.pricePerHour || 0);
  const securityDeposit = Number(studio.securityDeposit ?? 0);
  const image = studio.images?.[0];

  const location = [
    studio.location?.address,
    studio.location?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const categoryName = {
    photography: "Photography Studio",
    "sound-stage": "Sound Stage / Film Studio",
    podcast: "Podcast Room",
    music: "Music Suite",
    "art-workshop": "Art Workshop",
    workspace: "Creative Workspace",
    event: "Event Space",
    meeting: "Meeting Room",
  };

  return (
    <main className="min-h-screen flex-1 bg-gray-50">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Back to Explore
        </Link>

        <div className="mt-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="inline-block rounded-full bg-violet-100 px-4 py-2 text-xs font-semibold text-violet-700">
                {categoryName[studio.category] || studio.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {studio.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={17} />
                    {location}
                  </span>
                )}

                {studio.rating != null && (
                  <span className="flex items-center gap-2">
                    <Star
                      size={17}
                      className="fill-amber-400 text-amber-400"
                    />
                    <span className="font-semibold text-gray-800">
                      {studio.rating}
                    </span>
                    ({studio.reviews || 0} reviews)
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
              <p className="text-sm text-gray-500">Rental price</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                ৳{price.toLocaleString("en-BD")}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  / hour
                </span>
              </p>

              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500">Security deposit</p>
                <p className="mt-1 font-semibold text-gray-900">
                  ৳{securityDeposit.toLocaleString("en-BD")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 h-[280px] overflow-hidden rounded-2xl bg-gray-200 sm:h-[400px] lg:h-[500px]">
            {image ? (
              <Image
                src={image}
                alt={studio.name}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No studio image available
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                About This Space
              </h2>

              <p className="mt-4 text-base leading-8 text-gray-600">
                {studio.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Facilities and Amenities
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(studio.facilities || []).map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-violet-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {facility}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Space Information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white p-5">
                  <div className="flex items-center gap-3 text-violet-600">
                    <Users size={22} />
                    <span className="font-semibold text-gray-800">
                      Capacity
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Up to {studio.capacity} people
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5">
                  <div className="flex items-center gap-3 text-violet-600">
                    <Clock size={22} />
                    <span className="font-semibold text-gray-800">
                      Rental Duration
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Hourly rental
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Hosted By
              </h2>

              <div className="mt-5 flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">
                  H
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    StudioSpace Host
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Verified listing information
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Price per hour
                </span>
                <ShieldCheck className="text-violet-600" size={23} />
              </div>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                ৳{price.toLocaleString("en-BD")}
              </p>

              <div className="mt-4 rounded-xl bg-violet-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Security deposit
                  </span>
                  <span className="font-bold text-violet-700">
                    ৳{securityDeposit.toLocaleString("en-BD")}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-600">
                  This deposit is separate from the hourly rental price.
                  Its return is subject to the host&apos;s agreed deposit policy.
                </p>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Choose your preferred booking time.
              </p>

              <div className="my-6 border-t border-gray-100" />

              <BookingForm studio={studio} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
