
import Link from "next/link";
import {
  ShieldCheck,
  CalendarCheck,
  Headset,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const benefits = [
  {
    id: 1,
    title: "Transparent Listings",
    description:
      "View studio photos, facilities, locations, and hourly prices before making a booking decision.",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Simple Booking Experience",
    description:
      "Find a suitable creative space and manage your booking details from one convenient platform.",
    icon: CalendarCheck,
  },
  {
    id: 3,
    title: "Helpful Support",
    description:
      "Get assistance with questions about finding spaces, managing listings, and booking experiences.",
    icon: Headset,
  },
];

export default function HostGuarantee() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-[2px] text-violet-600">
              Create With Confidence
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              A Better Experience for Creators and Hosts
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-gray-600">
              StudioSpace brings creative people and inspiring spaces
              together. Discover useful information, manage your bookings,
              and share your workspace with a growing community of creators.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/add-studio"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-4 font-semibold text-white transition hover:bg-violet-700"
              >
                Become a Host
                <ArrowUpRight size={18} />
              </Link>

              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-7 py-4 font-semibold text-gray-800 transition hover:border-violet-600 hover:text-violet-600"
              >
                Explore Spaces
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.id}
                  className="flex gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:border-violet-200 hover:shadow-md sm:p-7"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <Icon size={27} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

