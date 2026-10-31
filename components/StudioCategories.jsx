
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Palette,
  CalendarDays,
  Users,
} from "lucide-react";
import categories from "@/data/categories.json";

const categoryIcons = {
  camera: Camera,
  palette: Palette,
  calendar: CalendarDays,
  users: Users,
};

export default function StudioCategories() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[2px] text-violet-600">
            Find Your Space
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Spaces by Category
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Whether you're creating, collaborating, or celebrating, discover a
            space that fits your purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon];

            return (
              <Link
                key={category.id}
                href={`/explore?category=${category.id}`}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {category.name}
                </h3>

                <p className="mt-3 min-h-20 text-sm leading-7 text-gray-600">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5 text-sm font-semibold text-violet-600">
                  <span>{category.spaces}</span>
                  <ArrowUpRight
                    size={19}
                    className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
