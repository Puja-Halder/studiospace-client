
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import studios from "@/data/studios.json";

export default function FeaturedStudios() {
  return (
    <section className="bg-gray-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-[2px] text-violet-600">
              Explore Our Collection
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Creative Spaces
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-gray-600">
              Discover inspiring studios and workspaces selected to help bring
              your next creative project to life.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex w-fit items-center gap-2 font-semibold text-violet-600 transition hover:text-violet-800"
          >
            Explore All Spaces
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <article
              key={studio.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={studio.image}
                  alt={studio.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm">
                  {studio.category}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {studio.name}
                  </h3>

                  <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-800">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    {studio.rating}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {studio.location}
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {studio.reviews} reviews
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ৳{studio.price.toLocaleString("en-BD")}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      / hour
                    </span>
                  </div>

                  <Link
                    href={`/studio/${studio.id}`}
                    className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
