
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function StudioDetails({ studio }) {
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
                {studio.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {studio.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <MapPin size={17} />
                  {studio.location}
                </span>

                <span className="flex items-center gap-2">
                  <Star
                    size={17}
                    className="fill-amber-400 text-amber-400"
                  />
                  <span className="font-semibold text-gray-800">
                    {studio.rating}
                  </span>
                  ({studio.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
              <p className="text-sm text-gray-500">Rental price</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                ৳{studio.price.toLocaleString("en-BD")}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  / hour
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl">
            <img
              src={studio.image}
              alt={studio.name}
              className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[500px]"
            />
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
                {studio.facilities.map((facility) => (
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
                  {studio.host.charAt(0)}
                </div>

                <div>
                  <p className="font-bold text-gray-900">{studio.host}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    StudioSpace Host
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price per hour</span>
                <ShieldCheck className="text-violet-600" size={23} />
              </div>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                ৳{studio.price.toLocaleString("en-BD")}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                No booking has been made yet.
              </p>

              <div className="my-6 border-t border-gray-100" />

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between gap-3">
                  <span>Studio</span>
                  <span className="font-semibold text-gray-900">
                    {studio.name}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Category</span>
                  <span className="font-semibold text-gray-900">
                    {studio.category}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Capacity</span>
                  <span className="font-semibold text-gray-900">
                    {studio.capacity} people
                  </span>
                </div>
              </div>

              <Link
                href="/login"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Sign In to Book
                <ArrowRight size={18} />
              </Link>

              <p className="mt-4 text-center text-xs leading-6 text-gray-500">
                Sign in to continue with your booking.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
