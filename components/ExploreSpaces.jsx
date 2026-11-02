"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  ArrowUpDown,
  SlidersHorizontal,
  Users,
  ImageIcon,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import categories from "@/data/categories.json";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categoryNames = Object.fromEntries(
  categories.map((category) => [category.id, category.name])
);

export default function ExploreSpaces() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("category") || "all";

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState(initialCategoryId);
  const [previousCategory, setPreviousCategory] =
    useState(initialCategoryId);
  const [sortOrder, setSortOrder] = useState("default");

  if (initialCategoryId !== previousCategory) {
    setPreviousCategory(initialCategoryId);
    setSelectedCategory(initialCategoryId);
  }

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await fetch(`${API_URL}/api/studios`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load studios."
          );
        }

        setStudios(result.data || []);
        setError("");
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  const filteredStudios = studios
    .filter((studio) => {
      const searchValue = searchTerm.trim().toLowerCase();
      const studioName = (studio.name || "").toLowerCase();

      const studioLocation = [
        studio.location?.city,
        studio.location?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const studioCategory =
        categoryNames[studio.category] || studio.category || "";

      const matchesSearch =
        studioName.includes(searchValue) ||
        studioLocation.includes(searchValue) ||
        studioCategory.toLowerCase().includes(searchValue);

      const matchesCategory =
        selectedCategory === "all" ||
        studio.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "low-high") {
        return a.pricePerHour - b.pricePerHour;
      }

      if (sortOrder === "high-low") {
        return b.pricePerHour - a.pricePerHour;
      }

      return 0;
    });

  return (
    <main className="min-h-screen flex-1 bg-gray-50">
      <section className="bg-violet-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <span className="text-sm font-semibold uppercase tracking-[2px] text-violet-300">
            Discover Your Next Creative Space
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Explore Creative Spaces
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-violet-100">
            Discover photography studios, sound stages, podcast rooms,
            music suites, art workshops, and other creative spaces
            for your next project.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="studio-search"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <Search size={17} />
                Search Spaces
              </label>

              <input
                id="studio-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, location..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <SlidersHorizontal size={17} />
                Studio Category
              </label>

              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="price-sort"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <ArrowUpDown size={17} />
                Sort by Price
              </label>

              <select
                id="price-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="default">Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <LoaderCircle className="h-9 w-9 animate-spin text-violet-600" />
              <p className="text-sm text-gray-500">
                Loading available spaces...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="font-medium text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Spaces
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Showing {filteredStudios.length} of {studios.length} spaces
                </p>
              </div>
            </div>

            {filteredStudios.length > 0 ? (
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudios.map((studio) => (
                  <article
                    key={studio._id}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-60 overflow-hidden bg-gray-100">
                      {studio.images?.[0] ? (
                        <Image
                          src={studio.images[0]}
                          alt={studio.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon
                            size={40}
                            className="text-gray-400"
                          />
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm">
                        {categoryNames[studio.category] || studio.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900">
                        {studio.name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        {studio.location?.city},{" "}
                        {studio.location?.address}
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {studio.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            ৳
                            {Number(studio.pricePerHour).toLocaleString(
                              "en-BD"
                            )}
                          </span>

                          <span className="ml-1 text-sm text-gray-500">
                            / hour
                          </span>
                        </div>

                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <Users size={16} />
                          {studio.capacity} guests
                        </p>
                      </div>

                      <Link
                        href={`/studio/${studio._id}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
                <Search className="mx-auto text-gray-400" size={40} />

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  No Spaces Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search term or selecting another category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSortOrder("default");
                  }}
                  className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
