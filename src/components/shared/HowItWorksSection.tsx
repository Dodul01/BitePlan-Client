"use client";

import React from "react";
import { Calendar, ChefHat, Truck } from "lucide-react";
import SectionHeading from "./SectionHeading";

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="How MealBox Works"
          subtitle="Our simple process delivers personalized meals straight to your door in just three easy steps."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Choose Your Plan</h3>
            <p className="text-muted-foreground">
              Select the meal plan that fits your lifestyle, dietary
              preferences, and schedule.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">We Cook Fresh</h3>
            <p className="text-muted-foreground">
              Our chefs prepare your meals with fresh, seasonal ingredients
              based on your preferences.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Delivery To You</h3>
            <p className="text-muted-foreground">
              We deliver your meals at your preferred time in eco-friendly
              packaging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
