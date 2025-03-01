"use client";

import { Heart, Clock, Utensils, CalendarRange } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeading from "./SectionHeading";

const benefits = [
  {
    icon: Heart,
    title: "Personalized Menu",
    description:
      "Meals tailored to your dietary preferences, restrictions, and taste preferences.",
  },
  {
    icon: Clock,
    title: "Save Time",
    description:
      "No more planning, shopping, or meal prep. We handle everything for you.",
  },
  {
    icon: Utensils,
    title: "Chef-Prepared",
    description:
      "All meals are crafted by professional chefs using high-quality ingredients.",
  },
  {
    icon: CalendarRange,
    title: "Flexible Scheduling",
    description:
      "Choose delivery times that work for your schedule, with easy changes.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <SectionHeading
          title=" Why Choose MealBox"
          subtitle="Personalized meal planning and delivery that fits your lifestyle
            perfectly."
        />
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">
            Why Choose MealBox
          </h2>
          <p className="text-muted-foreground mt-2">
            Personalized meal planning and delivery that fits your lifestyle
            perfectly.
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-6 text-center transition-transform hover:scale-105 shadow-md"
            >
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
