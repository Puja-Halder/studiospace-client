
import { notFound } from "next/navigation";
import studios from "@/data/studios.json";
import StudioDetails from "@/components/StudioDetails";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const studio = studios.find((item) => item.id === id);

  if (!studio) {
    return {
      title: "Studio Not Found",
    };
  }

  return {
    title: studio.name,
    description: studio.description,
  };
}

export default async function StudioDetailsPage({ params }) {
  const { id } = await params;

  const studio = studios.find((item) => item.id === id);

  if (!studio) {
    notFound();
  }

  return <StudioDetails studio={studio} />;
}
