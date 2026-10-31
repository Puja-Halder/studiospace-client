
import Link from "next/link";
import { Search, CalendarCheck, Sparkles, ArrowRight } from "lucide-react";

const bookingSteps = [
  {
    id: 1,
    number: "01",
    title: "Find Your Space",
    description:
      "Explore different studios and creative workspaces. Use categories and filters to find the perfect space for your needs.",
    icon: Search,
  },
  {
    id: 2,
    number: "02",
    title: "Book Your Time",
    description:
      "Choose your preferred date and available time slot. Review the booking details before confirming your reservation.",
    icon: CalendarCheck,
  },
  {
    id: 3,
    number: "03",
    title: "Start Creating",
    description:
      "Once your booking is confirmed, visit your selected space and bring your creative ideas to life.",
    icon: Sparkles,
  },
];

export default function HowBookingWorks() {
  return (
    <section className="bg-gray-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[2px] text-violet-600">
            Simple and Convenient
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How Booking Works
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Finding and booking your ideal creative space is easy. Follow
            these three simple steps to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {bookingSteps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative text-center">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
                  <Icon size={38} strokeWidth={1.7} />

                  <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-3 rounded-full bg-violet-600 px-7 py-4 font-semibold text-white transition hover:bg-violet-700"
          >
            Find Your Space
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}
