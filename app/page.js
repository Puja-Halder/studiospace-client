
import HeroSlider from "@/components/HeroSlider";
import StudioCategories from "@/components/StudioCategories";
import FeaturedStudios from "@/components/FeaturedStudios";
import HowBookingWorks from "@/components/HowBookingWorks";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSlider />
      <StudioCategories />
      <FeaturedStudios />
      <HowBookingWorks />
    </main>
  );
}
