"use client";

import { Rocket, Star, Users } from "lucide-react";
import SectionHeading from "./SectionHeading";

const ImpactStats = () => {
  return (
    <section className="py-16 bg-gray-50 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <SectionHeading
          title="Our Impact So Far"
          subtitle="We're proud to serve our community with quality meals and care"
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <Rocket className="text-green-600 w-8 h-8 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">10,000+</h3>
            <p className="text-gray-500 text-sm">Meals Delivered</p>
          </div>
          <div className="flex flex-col items-center">
            <Star className="text-yellow-500 w-8 h-8 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">4.9★</h3>
            <p className="text-gray-500 text-sm">Average Rating</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="text-blue-600 w-8 h-8 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">500+</h3>
            <p className="text-gray-500 text-sm">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
