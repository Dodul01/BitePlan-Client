"use client";

import { useEffect, useState } from "react";
import ProviderHome from "@/components/ProviderHome/ProviderHome";
import Banner from "@/components/shared/Banner";
import BenefitsSection from "@/components/shared/BenefitsSection";
import FeaturedMealsSection from "@/components/shared/FeaturedMealsSection";
import HowItWorksSection from "@/components/shared/HowItWorksSection";
import Testimonials from "@/components/shared/Testimonials";
import { getUserFromDB } from "@/services/User";
import Loading from "@/components/shared/Loading";

interface User {
  name: string;
  email: string;
  phone: string;
  role: "customer" | "seller";
  busisnessName?: string;
  cuisineSepcialties?: string;
  deliveryAddress?: string;
  logoImage?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserFromDB();
        if (response?.success && response.result) {
          setUser(response.result);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {user?.role === "seller" ? (
        <ProviderHome />
      ) : (
        <div>
          {/* Detault home page */}
          <Banner />
          <HowItWorksSection />
          <FeaturedMealsSection />
          <BenefitsSection />
          <Testimonials />
        </div>
      )}
    </div>
  );
}
