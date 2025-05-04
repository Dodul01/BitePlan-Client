/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getMeals } from "@/services/Meal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { User, Clock3 } from "lucide-react";

export default function LimitedTimeOffers() {
  const [meals, setMeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      const diff = nextMidnight.getTime() - now.getTime();
      const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Meals
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await getMeals();
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setMeals(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };
    fetchMeals();
  }, []);

  return (
    <section className="bg-green-50 py-16 px-4">
      <div className="text-center mb-10">
        <SectionHeading
          title="🔥 Limited Time Offers"
          subtitle="Meals you’ll love – refreshed every 24 hours"
        />
        <p className="text-lg font-semibold text-gray-700 mt-2">
          Offers End In:{" "}
          <span className="font-mono font-semibold text-green-600">
            {timeLeft} HR
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {meals.map((meal: any) => (
          <div
            key={meal._id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
          >
            <Image
              src={meal.image}
              alt={meal.name}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {meal.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500 line-through">
                  ${Number(meal.price + 10.01).toFixed(2)}
                </div>
                <div className="text-green-600 font-bold text-lg">
                  ${meal.price.toFixed(2)}
                </div>
              </div>

              {/* Extra Info */}
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                {meal.busisnessName && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-green-500" />
                    <span>Provider: {meal.busisnessName}</span>
                  </div>
                )}
                {meal.prepTime && (
                  <div className="flex items-center gap-1">
                    <Clock3 className="w-4 h-4 text-green-500" />
                    <span>Prep: {meal.prepTime}</span>
                  </div>
                )}
              </div>

              <Button className="mt-4 w-full font-semibold rounded-full">
                Order Now
              </Button>
            </div>

            <Badge className="absolute top-2 right-2 bg-rose-500 text-white text-xs rounded-full px-3 py-1">
              🔥 Today Only
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
