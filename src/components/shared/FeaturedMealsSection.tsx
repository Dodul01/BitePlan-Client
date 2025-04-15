/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Tabs, TabsContent } from "../ui/tabs";
import MealCard from "./MealCard";
import SectionHeading from "./SectionHeading";
import { useEffect, useState } from "react";
import { getMeals } from "@/services/Meal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Clock3, User, UsersRound } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCart } from "@/context/UserContext";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/AuthServices";

export interface Meal {
  _id: string;
  title: string;
  name: string;
  description: string;
  image: string;
  prepTime: string;
  servings: number;
  tags: string[];
  dietaryInfo: string[];
  price: string;
  busisnessName: string;
}

const FeaturedMealsSection: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [schedule, setSchedule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customization, setCustomization] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [user, setUser] = useState(null);
  const { setCart } = useCart();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await getMeals();
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        const randomMeal = shuffled.slice(0, 3);
        setMeals(randomMeal);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) setUser(user);
    };

    fetchUser();
    fetchMeals();
  }, []);

  const handleSubmit = async () => {
    if (!selectedMeal) return;
    setIsSubmitting(true);

    try {
      const newMeal = {
        meal: selectedMeal,
        customization,
        schedule,
      };

      if (user) {
        setCart((previousMeal: any) => [...previousMeal, newMeal]);
        toast.success("Order added to your cart");
      } else {
        toast.warning("Please sign in to order items.");
      }

      // Clear form and close modal
      setSelectedMeal(null);
      setCustomization("");
      setSchedule("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="This Week's Featured Meals"
          subtitle="Explore our chef's selection of seasonal favorites and customer-loved dishes."
        />

        <Tabs defaultValue="all" className="mb-8">
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.map((meal) => (
                <Dialog
                  key={meal._id}
                  open={selectedMeal?._id === meal._id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setSelectedMeal(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <div onClick={() => setSelectedMeal(meal)}>
                      <MealCard meal={meal} />
                    </div>
                  </DialogTrigger>

                  <DialogContent className="p-4 max-w-md mx-auto">
                    <DialogTitle>{meal.name}</DialogTitle>

                    <div className="relative w-full h-40 overflow-hidden rounded-md mb-4">
                      <Image
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                        height={500}
                        width={500}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-1">
                      {meal.busisnessName && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            Provider: {meal.busisnessName}
                          </span>
                        </div>
                      )}
                      {meal.prepTime && (
                        <div className="flex items-center gap-1">
                          <Clock3 className="w-4 h-4" />
                          <span className="text-sm">Prep: {meal.prepTime}</span>
                        </div>
                      )}
                      {meal.servings && (
                        <div className="flex items-center gap-1">
                          <UsersRound className="w-4 h-4" />
                          <span className="text-sm">
                            Servings: {meal.servings}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm bg-[#FFC400] text-black  rounded-lg text-center">
                      *IF YOU DON&apos;T NEED TO CUSTOMIZE YOUR MEAL, CLICK ON
                      COMPLETE ORDER*
                    </p>

                    <p className="text-gray-600 text-sm">{meal.description}</p>

                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium">
                          Customization Requests
                        </label>
                        <Textarea
                          placeholder="Any special requests or dietary needs..."
                          value={customization}
                          onChange={(e) => setCustomization(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-medium">
                          Preferred Delivery Time
                        </label>
                        <Input
                          type="datetime-local"
                          value={schedule}
                          onChange={(e) => setSchedule(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ backgroundColor: "#44C356" }}
                        className="w-full"
                      >
                        {isSubmitting ? "Placing Order..." : "Complete Order"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <Button variant="outline" className="rounded-full px-8" asChild>
            <Link href="/find-meals">View All Meals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMealsSection;
