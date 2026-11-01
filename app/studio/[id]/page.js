
import { notFound } from "next/navigation";
import StudioDetails from "@/components/StudioDetails";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getStudio(id) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured.");
    }

    const response = await fetch(
      `${API_URL}/api/studios/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch studio:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    return {
      title: "Studio Not Found | StudioSpace",
    };
  }

  return {
    title: `${studio.name} | StudioSpace`,
    description: studio.description,
  };
}

export default async function StudioDetailsPage({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    notFound();
  }

  return <StudioDetails studio={studio} />;
}
