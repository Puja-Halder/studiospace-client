
import HeroSlider from "@/components/HeroSlider";
import StudioCategories from "@/components/StudioCategories";
import FeaturedStudios from "@/components/FeaturedStudios";
import HowBookingWorks from "@/components/HowBookingWorks";
import HostGuarantee from "@/components/HostGuarantee";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSlider />
      <StudioCategories />
      <FeaturedStudios />
      <HowBookingWorks />
      <HostGuarantee />
    </main>
  );
}
