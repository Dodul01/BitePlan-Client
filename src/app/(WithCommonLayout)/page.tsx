import Banner from "@/components/shared/Banner";
import BenefitsSection from "@/components/shared/BenefitsSection";
import FeaturedMealsSection from "@/components/shared/FeaturedMealsSection";
import HowItWorksSection from "@/components/shared/HowItWorksSection";
import Testimonials from "@/components/shared/Testimonials";

export default function Home() {
  return (
    <div>
      <Banner />
      <HowItWorksSection />
      <FeaturedMealsSection />
      <BenefitsSection />
      <Testimonials />
    </div>
  );
}
