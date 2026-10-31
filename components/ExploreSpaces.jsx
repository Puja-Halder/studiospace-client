
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import studios from "@/data/studios.json";
import categories from "@/data/categories.json";

export default function ExploreSpaces() {
  const searchParams = useSearchParams();

  const initialCategoryId = searchParams.get("category") || "all";

  const initialCategory =
    categories.find((category) => category.id === initialCategoryId)?.name ||
    "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState("default");

  const filteredStudios = studios
    .filter((studio) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        studio.name.toLowerCase().includes(searchValue) ||
        studio.location.toLowerCase().includes(searchValue) ||
        studio.category.toLowerCase().includes(searchValue);

      const matchesCategory =
        selectedCategory === "all" ||
        studio.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "low-high") {
        return a.price - b.price;
      }

      if (sortOrder === "high-low") {
        return b.price - a.price;
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
            Find inspiring photography studios, creative workspaces, and
            unique venues for your next project.
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
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
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
                      <Star
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
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
                      <span className="text-xl font-bold text-gray-900">
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
      </section>
    </main>
  );
}
