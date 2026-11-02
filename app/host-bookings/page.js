"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  MapPin,
  ClipboardList,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatPrice = (amount) => {
  return Number(amount || 0).toLocaleString("en-BD");
};

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-rose-100 text-rose-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function HostBookingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (isPending || !session?.user) return;

    const fetchHostBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bookings/host`, {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load booking requests."
          );
        }

        setBookings(result.data || []);
      } catch (error) {
        console.error("Fetch host bookings error:", error);
        toast.error(error.message || "Unable to load booking requests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostBookings();
  }, [isPending, session]);

  const handleBookingAction = async (bookingId, action) => {
    const actionLabel = action === "confirm" ? "confirm" : "reject";

    const shouldContinue = window.confirm(
      `Are you sure you want to ${actionLabel} this booking?`
    );

    if (!shouldContinue) return;

    setProcessingId(bookingId);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Unable to ${actionLabel} booking.`
        );
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: result.data.status }
            : booking
        )
      );

      toast.success(
        result.message || `Booking ${actionLabel}ed successfully.`
      );
    } catch (error) {
      console.error(`Booking ${actionLabel} error:`, error);
      toast.error(error.message || `Unable to ${actionLabel} booking.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isPending || (session?.user && isLoading)) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <Loader2 className="h-9 w-9 animate-spin text-violet-600" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-5">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <ClipboardList className="mx-auto h-12 w-12 text-violet-600" />

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Sign In to View Requests
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Sign in to view booking requests received for your studios.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Sign In
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold text-violet-600">
              HOST DASHBOARD
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Booking Requests
            </h1>

            <p className="mt-3 text-gray-500">
              View and manage the booking requests received for your studios.
            </p>
          </div>

          <Link
            href="/my-listings"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            My Studios
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {bookings.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <p className="text-sm text-gray-500">Confirmed Bookings</p>
            <p className="mt-1 text-3xl font-bold text-green-600">
              {confirmedCount}
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
            <ClipboardList className="mx-auto h-14 w-14 text-gray-300" />

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Booking Requests Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              When customers request to book one of your studios, their
              booking details will appear here.
            </p>

            <Link
              href="/my-listings"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              View My Studios
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {bookings.map((booking) => {
              const studio = booking.studioId;
              const isProcessing = processingId === booking._id;

              const rentalCost = Number(booking.totalPrice || 0);
              const securityDeposit = Number(booking.securityDeposit ?? 0);
              const estimatedAmountDue = rentalCost + securityDeposit;

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="relative h-56 bg-gray-100 md:h-full md:min-h-64">
                      {studio?.images?.[0] ? (
                        <Image
                          src={studio.images[0]}
                          alt={studio.name || "Studio"}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-56 items-center justify-center text-sm text-gray-400">
                          No image available
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                            statusStyles[booking.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.status}
                        </span>

                        <span className="text-xs text-gray-400">
                          Request ID: {booking._id.slice(-8)}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold text-gray-900">
                        {studio?.name || "Unavailable Studio"}
                      </h2>

                      <p className="mt-1 text-sm capitalize text-gray-500">
                        {studio?.category || "Studio"}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <CalendarDays
                            size={19}
                            className="mt-0.5 shrink-0 text-violet-600"
                          />

                          <div>
                            <p className="text-xs text-gray-500">
                              Start Time
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                              {formatDate(booking.startTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock
                            size={19}
                            className="mt-0.5 shrink-0 text-violet-600"
                          />

                          <div>
                            <p className="text-xs text-gray-500">
                              End Time
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                              {formatDate(booking.endTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin
                            size={19}
                            className="mt-0.5 shrink-0 text-violet-600"
                          />

                          <div>
                            <p className="text-xs text-gray-500">
                              Studio Location
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                              {studio?.location?.address ||
                                "Address unavailable"}
                              {studio?.location?.city
                                ? `, ${studio.location.city}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Booking Duration
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {booking.totalHours} hours
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Booking Cost Breakdown
                        </h3>

                        <div className="mt-4 space-y-3 text-sm">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">
                              Rental Cost
                            </span>
                            <span className="font-medium text-gray-800">
                              ৳{formatPrice(rentalCost)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">
                              Security Deposit
                            </span>
                            <span className="font-medium text-gray-800">
                              ৳{formatPrice(securityDeposit)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                            <span className="font-semibold text-gray-800">
                              Estimated Total Amount Due
                            </span>
                            <span className="text-xl font-bold text-violet-700">
                              ৳{formatPrice(estimatedAmountDue)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-gray-500">
                          The security deposit is separate from the rental
                          cost. Its return depends on the deposit policy agreed
                          between the host and customer.
                        </p>
                      </div>

                      <div className="mt-5 flex flex-col justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
                        <div className="text-sm text-gray-500">
                          Customer ID:{" "}
                          <span className="font-medium text-gray-700">
                            {booking.userId}
                          </span>
                        </div>
                      </div>

                      {booking.status === "pending" && (
                        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                          <button
                            type="button"
                            onClick={() =>
                              handleBookingAction(booking._id, "confirm")
                            }
                            disabled={isProcessing}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={17} />
                            )}
                            Confirm Booking
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleBookingAction(booking._id, "reject")
                            }
                            disabled={isProcessing}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <XCircle size={17} />
                            )}
                            Reject Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}