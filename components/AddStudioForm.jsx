
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, LoaderCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const categories = [
  { value: "photography", label: "Photography Studio" },
  { value: "workspace", label: "Creative Workspace" },
  { value: "event", label: "Event Space" },
  { value: "meeting", label: "Meeting Space" },
];

const initialForm = {
  name: "",
  description: "",
  category: "",
  city: "",
  address: "",
  pricePerHour: "",
  capacity: "",
  facilities: "",
};

export default function AddStudioForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      toast.error("Choose image files smaller than 5 MB each.");
      event.target.value = "";
      return;
    }

    setImages((previous) => [...previous, ...selectedFiles]);
    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const uploadImage = async (image) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const imageData = new FormData();
    imageData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Image upload failed. Please try again.");
    }

    return result.data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session?.user) {
      toast.error("Please log in before adding a studio.");
      router.push("/login");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one studio image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedImages = await Promise.all(
        images.map((image) => uploadImage(image))
      );

      const studioData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        location: {
          city: form.city.trim(),
          address: form.address.trim(),
        },
        pricePerHour: Number(form.pricePerHour),
        capacity: Number(form.capacity),
        facilities: form.facilities
          .split(",")
          .map((facility) => facility.trim())
          .filter(Boolean),
        images: uploadedImages,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(studioData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create studio.");
      }

      toast.success("Studio listed successfully!");
      setForm(initialForm);
      setImages([]);
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Login Required
        </h1>
        <p className="mt-3 text-gray-600">
          Please log in to list your creative studio.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Go to Login
        </button>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="font-semibold text-indigo-600">
            Become a Host
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            List Your Studio
          </h1>
          <p className="mt-3 text-gray-600">
            Share your creative space with people looking for the perfect place to work and create.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Studio Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Enter your studio name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              maxLength={2000}
              placeholder="Describe your studio and what makes it special"
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Studio Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Enter studio address"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price Per Hour
              </label>
              <input
                type="number"
                name="pricePerHour"
                value={form.pricePerHour}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 1500"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Maximum Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                required
                min="1"
                step="1"
                placeholder="e.g. 10"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Facilities
            </label>
            <input
              name="facilities"
              value={form.facilities}
              onChange={handleChange}
              placeholder="Wi-Fi, Air Conditioning, Lighting"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Separate each facility with a comma.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Studio Images
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50">
              <Upload className="mb-3 h-8 w-8 text-indigo-600" />
              <span className="font-semibold text-gray-700">
                Click to upload studio images
              </span>
              <span className="mt-2 text-xs text-gray-500">
                Maximum 5 images, 5 MB each
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="mt-4 space-y-2">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <span className="truncate pr-3 text-sm text-gray-700">
                      {image.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="shrink-0 rounded-md p-2 text-red-500 hover:bg-red-50"
                      aria-label={`Remove ${image.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Uploading and Creating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                List My Studio
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
