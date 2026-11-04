
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  category: "",
  city: "",
  address: "",
  pricePerHour: "",
  securityDeposit: "0",
  capacity: "",
  facilities: "",
};

export default function AddStudioForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState(initialForm);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length + selectedImages.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image.`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5 MB limit.`);
        return false;
      }

      return true;
    });

    setSelectedImages((previousImages) => [
      ...previousImages,
      ...validFiles,
    ]);

    event.target.value = "";
  };

  const removeImage = (index) => {
    setSelectedImages((previousImages) =>
      previousImages.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || "Image upload failed.");
    }

    return result.data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in before listing a studio.");
      router.push("/login");
      return;
    }

    if (selectedImages.length === 0) {
      toast.error("Please select at least one studio image.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.city.trim() ||
      !form.address.trim() ||
      !form.pricePerHour ||
      !form.capacity
    ) {
      toast.error("Please provide all required studio information.");
      return;
    }

    if (
      !Number.isFinite(Number(form.pricePerHour)) ||
      Number(form.pricePerHour) < 1
    ) {
      toast.error("Please enter a valid hourly price.");
      return;
    }

    if (
      !Number.isFinite(Number(form.securityDeposit)) ||
      Number(form.securityDeposit) < 0
    ) {
      toast.error("Please enter a valid security deposit.");
      return;
    }

    if (
      !Number.isInteger(Number(form.capacity)) ||
      Number(form.capacity) < 1
    ) {
      toast.error("Please enter a valid studio capacity.");
      return;
    }

    setIsSubmitting(true);

    try {
      toast.info("Uploading studio images...");

      const uploadedImages = await Promise.all(
        selectedImages.map((image) => uploadImage(image))
      );

      const studioData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        city: form.city.trim(),
        address: form.address.trim(),
        pricePerHour: Number(form.pricePerHour),
        securityDeposit: Number(form.securityDeposit || 0),
        capacity: Number(form.capacity),
        facilities: form.facilities
          .split(",")
          .map((facility) => facility.trim())
          .filter(Boolean),
        images: uploadedImages,
      };

      console.log("Studio data before sending:", studioData);

      const response = await fetch(
        `${""}/api/studios`,
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

      console.log("Backend response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create your studio listing."
        );
      }

      toast.success("Your studio has been listed successfully!");

      setForm(initialForm);
      setSelectedImages([]);

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Studio submission error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">
          Sign in to become a host
        </h2>
        <p className="mt-3 text-gray-600">
          Please sign in to add your creative space to StudioSpace.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label className="mb-2 block font-semibold text-gray-800">
          Studio Name *
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Modern Creative Workspace"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-800">
          Description *
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your studio and what makes it special..."
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-800">
          Studio Category *
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
        >
          <option value="">Select a category</option>
          <option value="photography">Photography Studio</option>
          <option value="sound-stage">Sound Stage / Film Studio</option>
          <option value="podcast">Podcast Room</option>
          <option value="music">Music Suite</option>
          <option value="art-workshop">Art Workshop</option>
          <option value="workspace">Creative Workspace</option>
          <option value="event">Event Space</option>
          <option value="meeting">Meeting Space</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-gray-800">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Dhaka"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-800">
            Full Address *
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. Banani, Road 11"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-gray-800">
            Price Per Hour (৳) *
          </label>
          <input
            type="number"
            name="pricePerHour"
            value={form.pricePerHour}
            onChange={handleChange}
            min="1"
            placeholder="e.g. 1200"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-800">
            Security Deposit (৳)
          </label>
          <input
            type="number"
            name="securityDeposit"
            value={form.securityDeposit}
            onChange={handleChange}
            min="0"
            placeholder="e.g. 2000"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter 0 if no security deposit is required.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-800">
          Capacity *
        </label>
        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          min="1"
          step="1"
          placeholder="e.g. 10"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-800">
          Facilities
        </label>
        <input
          type="text"
          name="facilities"
          value={form.facilities}
          onChange={handleChange}
          placeholder="Wi-Fi, Air Conditioning, Projector, Whiteboard"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
        />
        <p className="mt-2 text-sm text-gray-500">
          Separate each facility with a comma.
        </p>
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-800">
          Studio Images * (1–5 images, maximum 5 MB each)
        </label>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-gray-500">
          <Upload className="mb-3 h-8 w-8 text-gray-500" />
          <span className="font-medium text-gray-800">
            Click to upload images
          </span>
          <span className="mt-1 text-sm text-gray-500">
            PNG, JPG or JPEG
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {selectedImages.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedImages.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
              >
                <span className="truncate text-sm text-gray-700">
                  {image.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="ml-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                  aria-label={`Remove ${image.name}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading and Listing...
          </>
        ) : (
          "List My Studio"
        )}
      </button>
    </form>
  );
}
