
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  MapPin,
  Users,
  ImageIcon,
  LoaderCircle,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const initialForm = {
  name: "",
  description: "",
  category: "photography",
  city: "",
  address: "",
  pricePerHour: "",
  capacity: "",
  facilities: "",
  images: "",
};

export default function MyListings() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudio, setEditingStudio] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const fetchMyListings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios/mine`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load your listings."
          );
        }

        setStudios(result.data || []);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [session, sessionLoading]);

  const openEditForm = (studio) => {
    setEditingStudio(studio);

    setForm({
      name: studio.name || "",
      description: studio.description || "",
      category: studio.category || "photography",
      city: studio.location?.city || "",
      address: studio.location?.address || "",
      pricePerHour: String(studio.pricePerHour || ""),
      capacity: String(studio.capacity || ""),
      facilities: (studio.facilities || []).join(", "),
      images: (studio.images || []).join("\n"),
    });
  };

  const closeEditForm = () => {
    if (saving) return;

    setEditingStudio(null);
    setForm(initialForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingStudio) return;

    const images = form.images
      .split("\n")
      .map((image) => image.trim())
      .filter(Boolean);

    const facilities = form.facilities
      .split(",")
      .map((facility) => facility.trim())
      .filter(Boolean);

    if (images.length < 1 || images.length > 5) {
      toast.error("Please provide between 1 and 5 image URLs.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${editingStudio._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            city: form.city.trim(),
            address: form.address.trim(),
            pricePerHour: Number(form.pricePerHour),
            capacity: Number(form.capacity),
            facilities,
            images,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio.");
      }

      const updatedStudio = result.data;

      setStudios((previous) =>
        previous.map((studio) =>
          studio._id === editingStudio._id
            ? updatedStudio
            : studio
        )
      );

      toast.success("Studio updated successfully!");
      closeEditForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading || loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your listings...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="mt-3 text-muted-foreground">
            Please sign in to view your studio listings.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Host Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              My Listings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage and keep track of the studios you have listed.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus size={19} />
            Add New Studio
          </Link>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Listed Studios
          </p>
          <p className="mt-1 text-3xl font-bold">{studios.length}</p>
        </div>

        {studios.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-card px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No studios listed yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              You have not added any studios. Create your first listing
              and let creators discover your space.
            </p>

            <Link
              href="/add-studio"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Plus size={18} />
              Add Your First Studio
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-52 w-full bg-muted">
                  {studio.images?.[0] ? (
                    <Image
                      src={studio.images[0]}
                      alt={studio.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-semibold capitalize shadow">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold">{studio.name}</h2>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        studio.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {studio.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    {studio.location?.city}
                  </p>

                  <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                    {studio.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-xl font-bold">
                        ৳{Number(studio.pricePerHour).toLocaleString("en-BD")}
                        <span className="text-sm font-normal text-muted-foreground">
                          /hr
                        </span>
                      </p>
                    </div>

                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users size={16} />
                      {studio.capacity} guests
                    </p>
                  </div>

                  <button
                    onClick={() => openEditForm(studio)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-semibold transition hover:bg-muted"
                  >
                    <Pencil size={16} />
                    Edit Studio
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {editingStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Studio</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your studio listing information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditForm}
                disabled={saving}
                className="rounded-full p-2 transition hover:bg-muted disabled:opacity-50"
                aria-label="Close edit form"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Studio Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="photography">Photography</option>
                  <option value="workspace">Workspace</option>
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Address
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price Per Hour (৳)
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={form.pricePerHour}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Capacity (Guests)
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Facilities
                </label>
                <input
                  name="facilities"
                  value={form.facilities}
                  onChange={handleChange}
                  placeholder="Wi-Fi, Lighting, Air Conditioning"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Separate facilities with commas.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Image URLs
                </label>
                <textarea
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter one image URL per line. Use between 1 and 5 URLs.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditForm}
                  disabled={saving}
                  className="rounded-lg border px-5 py-3 font-semibold transition hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle size={18} className="animate-spin" />
                  )}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
