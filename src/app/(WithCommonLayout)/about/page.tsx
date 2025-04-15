import SectionHeading from "@/components/shared/SectionHeading";
import React from "react";
import { Heart, Users, Rocket, Award, Pizza } from "lucide-react";

const funFacts = [
  {
    title: "Meals Delivered",
    value: "500,000+",
    icon: <Pizza className="text-primary w-6 h-6" />,
  },
  {
    title: "Happy Customers",
    value: "100,000+",
    icon: <Users className="text-primary w-6 h-6" />,
  },
  {
    title: "Recipes Created",
    value: "2,000+",
    icon: <Award className="text-primary w-6 h-6" />,
  },
];

const AboutUsPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-30">
      <SectionHeading
        title="About MealBox"
        subtitle="Our Journey and a Little Fun Along the Way!"
      />

      <div className="mt-12 space-y-16">
        {/* Mission Section */}
        <div className="bg-muted p-8 rounded-2xl shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <Heart className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-semibold text-secondary">
              Our Mission
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            At MealBox, we aim to make healthy eating a fun and effortless
            experience. We bring delicious and nutritious meals straight to your
            door, so you can focus on what matters most — enjoying great food
            and feeling good. Whether you&apos;re looking to eat cleaner or try
            a new diet, MealBox has something for everyone.
          </p>
        </div>

        {/* Fun Facts Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {funFacts.map((fact, index) => (
            <div
              key={index}
              className="bg-muted p-6 rounded-2xl shadow-md text-center"
            >
              <div className="mb-4">{fact.icon}</div>
              <h3 className="text-2xl font-bold text-primary">{fact.value}</h3>
              <p className="text-lg text-muted-foreground">{fact.title}</p>
            </div>
          ))}
        </div>

        {/* Innovation Section */}
        <div className="bg-muted p-8 rounded-2xl shadow-md mt-12">
          <div className="flex items-center gap-4 mb-6">
            <Rocket className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-semibold text-secondary">
              Innovation at MealBox
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            We&lsquo;re not just another meal delivery service. MealBox is a
            tech-driven, innovative platform that uses AI to help you discover
            new meals, track your preferences, and optimize your nutrition. With
            cutting-edge features like real-time delivery tracking, personalized
            recommendations, and easy-to-use interfaces, MealBox takes the
            hassle out of healthy eating.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
