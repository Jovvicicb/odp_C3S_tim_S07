import { HeroSection } from "../../components/landing/HeroSection";
import { PublicCommunitiesSection } from "../../components/landing/PublicCommunitiesSection";

export default function LandingPage() {
  return (
    <div className="space-y-8">
      <HeroSection />

      <PublicCommunitiesSection />
    </div>
  );
}
