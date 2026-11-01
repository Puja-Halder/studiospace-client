
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getLocalDateTime = (date) => {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
};

export default function BookingForm({ studio }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minimumDateTime, setMinimumDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricePerHour = Number(studio.pricePerHour || 0);

  useEffect(() => {
    setMinimumDateTime(getLocalDateTime(new Date()));
  }, []);

  const startDate = startTime ? new Date(startTime) : null;
  const endDate = endTime ? new Date(endTime) : null;

  const totalHours =
    startDate && endDate && endDate > startDate
      ? (endDate.getTime() - startDate.getTime()) / 3600000
      : 0;

  const estimatedPrice =
    totalHours >= 1 ? totalHours * pricePerHour : 0;

  const minimumEndTime =
    startDate && !Number.isNaN(startDate.getTime())
      ? getLocalDateTime(
          new Date(startDate.getTime() + 3600000)
        )
      : minimumDateTime;

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    setEndTime("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in before booking a studio.");
      router.push("/login");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Please select your booking start and end times.");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      toast.error("Please select valid booking dates.");
      return;
    }

    if (start <= new Date()) {
      toast.error("Please select a future booking time.");
      return;
    }

    if (end <= start) {
      toast.error("End time must be after start time.");
      return;
    }

    if (totalHours < 1) {
      toast.error("Minimum booking duration is one hour.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          studioId: studio._id,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Booking response status:", response.status);
        console.log("Booking response data:", result);

        throw new Error(
          result.message || "Booking request failed."
        );
      }

      toast.success(
        "Your booking request was submitted successfully!"
      );

      setStartTime("");
      setEndTime("");

      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      console.error("Booking submission error:", error);
      toast.error(error.message || "Unable to submit your booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="rounded-xl border border-violet-100 bg-violet-50 p-5 text-center">
        <h3 className="font-bold text-gray-900">
          Ready to book this space?
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Sign in to select your preferred date and time.
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Sign In to Book
          <ArrowRight size={17} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="booking-start"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
        >
          <CalendarDays size={17} className="text-violet-600" />
          Booking Start
        </label>

        <input
          id="booking-start"
          type="datetime-local"
          value={startTime}
          min={minimumDateTime}
          onChange={handleStartTimeChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-violet-600"
        />
      </div>

      <div>
        <label
          htmlFor="booking-end"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
        >
          <Clock size={17} className="text-violet-600" />
          Booking End
        </label>

        <input
          id="booking-end"
          type="datetime-local"
          value={endTime}
          min={minimumEndTime}
          onChange={(event) => setEndTime(event.target.value)}
          disabled={!startTime}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-violet-600 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Hourly price</span>
          <span>৳{pricePerHour.toLocaleString("en-BD")}</span>
        </div>

        <div className="mt-3 flex justify-between text-sm text-gray-600">
          <span>Duration</span>
          <span>
            {totalHours >= 1
              ? `${totalHours.toFixed(2)} hours`
              : "Not selected"}
          </span>
        </div>

        <div className="my-3 border-t border-gray-200" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">
            Estimated Total
          </span>

          <span className="text-xl font-bold text-violet-700">
            ৳{estimatedPrice.toLocaleString("en-BD")}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-gray-500">
          Final booking price is calculated and verified by the server.
        </p>
      </div>

      <button
        type="submit"
        disabled={
          isSubmitting ||
          !startTime ||
          !endTime ||
          totalHours < 1
        }
        className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting Request...
          </>
        ) : (
          <>
            Request Booking
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
