
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
  Trash2,
  AlertTriangle,
  RotateCcw,
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
  securityDeposit: "0",
  capacity: "",
  facilities: "",
  images: "",
};

const categories = [
  { value: "photography", label: "Photography Studio" },
  { value: "sound-stage", label: "Sound Stage / Film Studio" },
  { value: "podcast", label: "Podcast Room" },
  { value: "music", label: "Music Suite" },
  { value: "art-workshop", label: "Art Workshop" },
  { value: "workspace", label: "Workspace" },
  { value: "event", label: "Event Space" },
  { value: "meeting", label: "Meeting Room" },
];

const getCategoryName = (category) => {
  return (
    categories.find((item) => item.value === category)?.label ||
    category
  );
};

export default function MyListings() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudio, setEditingStudio] = useState(null);
  const [deletingStudio, setDeletingStudio] = useState(null);
  const [permanentDeletingStudio, setPermanentDeletingStudio] =
    useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [permanentDeleting, setPermanentDeleting] = useState(false);
  const [reactivatingStudioId, setReactivatingStudioId] = useState(null);

  useEffect(() => {
    if (sessionLoading || !session?.user) return;

    const fetchMyListings = async () => {
      try {
        setError("");

        const response = await fetch(
          `${""}/api/studios/mine`,
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
      pricePerHour: String(studio.pricePerHour ?? ""),
      securityDeposit: String(studio.securityDeposit ?? 0),
      capacity: String(studio.capacity ?? ""),
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

    if (
      !Number.isFinite(Number(form.pricePerHour)) ||
      Number(form.pricePerHour) < 1
    ) {
      toast.error("Please provide a valid hourly price.");
      return;
    }

    if (
      !Number.isFinite(Number(form.securityDeposit)) ||
      Number(form.securityDeposit) < 0
    ) {
      toast.error("Please provide a valid security deposit.");
      return;
    }

    if (
      !Number.isInteger(Number(form.capacity)) ||
      Number(form.capacity) < 1
    ) {
      toast.error("Please provide a valid studio capacity.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${""}/api/studios/${editingStudio._id}`,
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
            securityDeposit: Number(form.securityDeposit || 0),
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

      setStudios((previous) =>
        previous.map((studio) =>
          studio._id === editingStudio._id ? result.data : studio
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

  const handleDelete = async () => {
    if (!deletingStudio) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${""}/api/studios/${deletingStudio._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete studio.");
      }

      setStudios((previous) =>
        previous.map((studio) =>
          studio._id === deletingStudio._id ? result.data : studio
        )
      );

      toast.success("Studio removed from public listings.");
      setDeletingStudio(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleReactivate = async (studio) => {
    try {
      setReactivatingStudioId(studio._id);

      const response = await fetch(
        `${""}/api/studios/${studio._id}/reactivate`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to reactivate studio."
        );
      }

      setStudios((previous) =>
        previous.map((item) =>
          item._id === studio._id ? result.data : item
        )
      );

      toast.success("Studio reactivated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setReactivatingStudioId(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeletingStudio) return;

    try {
      setPermanentDeleting(true);

      const response = await fetch(
        `${""}/api/studios/${permanentDeletingStudio._id}/permanent`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to permanently delete studio."
        );
      }

      setStudios((previous) =>
        previous.filter(
          (studio) => studio._id !== permanentDeletingStudio._id
        )
      );

      toast.success("Studio permanently deleted.");
      setPermanentDeletingStudio(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPermanentDeleting(false);
    }
  };

  if (sessionLoading || (session?.user && loading)) {
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

                  <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-semibold shadow">
                    {getCategoryName(studio.category)}
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        Security deposit: ৳
                        {Number(studio.securityDeposit ?? 0).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users size={16} />
                      {studio.capacity} guests
                    </p>
                  </div>

                  {studio.isActive ? (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openEditForm(studio)}
                        className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition hover:bg-muted"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeletingStudio(studio)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleReactivate(studio)}
                        disabled={
                          reactivatingStudioId !== null ||
                          permanentDeleting
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {reactivatingStudioId === studio._id ? (
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <RotateCcw size={17} />
                        )}
                        {reactivatingStudioId === studio._id
                          ? "Reactivating..."
                          : "Reactivate"}
                      </button>

                      <button
                        onClick={() =>
                          setPermanentDeletingStudio(studio)
                        }
                        disabled={
                          reactivatingStudioId !== null ||
                          permanentDeleting
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={16} />
                        Delete Forever
                      </button>
                    </div>
                  )}
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
                  {categories.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
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
                    Security Deposit (৳)
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={form.securityDeposit}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter 0 if no deposit is required.
                  </p>
                </div>
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

      {deletingStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Remove this studio?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deletingStudio.name}
              </span>{" "}
              from public listings? Customers will no longer be able to
              discover or book this studio. Existing booking records will
              be preserved.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingStudio(null)}
                disabled={deleting}
                className="rounded-lg border px-5 py-3 font-semibold transition hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-5 py-3 font-semibold text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <LoaderCircle size={18} className="animate-spin" />
                )}
                {deleting ? "Removing..." : "Yes, Remove Studio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {permanentDeletingStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Permanently delete this studio?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              You are about to permanently delete{" "}
              <span className="font-semibold text-foreground">
                {permanentDeletingStudio.name}
              </span>
              . This studio listing cannot be recovered after deletion.
              Existing booking records will not be automatically deleted.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPermanentDeletingStudio(null)}
                disabled={permanentDeleting}
                className="rounded-lg border px-5 py-3 font-semibold transition hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePermanentDelete}
                disabled={permanentDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-5 py-3 font-semibold text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {permanentDeleting && (
                  <LoaderCircle size={18} className="animate-spin" />
                )}
                {permanentDeleting
                  ? "Deleting Permanently..."
                  : "Yes, Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
