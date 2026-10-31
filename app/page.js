
import HeroSlider from "@/components/HeroSlider";
import FeaturedStudios from "@/components/FeaturedStudios";
import StudioCategories from "@/components/StudioCategories";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSlider />
      <StudioCategories />
      <FeaturedStudios />
    </main>
  );
}
