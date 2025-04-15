/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getMeals } from "@/services/Meal";
import SectionHeading from "@/components/shared/SectionHeading";
import { useCart } from "@/context/UserContext";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/services/AuthServices";
import { toast } from "sonner";
import { Clock3, User, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  dietaryInfo: string[];
  price: number;
  busisnessName?: string;
  prepTime: string;
  servings: string;
  tags: string[];
}

const OrderMealPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [customization, setCustomization] = useState("");
  const [schedule, setSchedule] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCart } = useCart();
  const [user, setUser] = useState(null);

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
        setSelectedMeal(null);
        setCustomization("");
        setSchedule("");
        toast.success("Order added to you cart ");
      } else {
        toast.warning("Please sign in to order items.");
      }
      // TODO:
      // after clicking the orer button instruct user that need to take more action to order

      // Reset form
      setSelectedMeal(null);
      setCustomization("");
      setSchedule("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUser = async () => {
    const user = await getCurrentUser();

    if (user) {
      setUser(user);
    }
  };

  useEffect(() => {
    // fetch meal
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await getMeals();
        setMeals(response.data);
        setFilteredMeals(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setLoading(false);
      }
    };

    getUser();
    fetchMeals();
  }, []);

  useEffect(() => {
    setFilteredMeals(
      meals?.filter((meal) =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, meals]);

  return (
    <div className="container mx-auto p-4 mt-20">
      <SectionHeading
        title="Browse Our Menu"
        subtitle="Order the food you like to arrive on you time."
      />

      <div className="mb-8 flex items-center justify-center w-full">
        <Input
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)]?.map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals?.map((meal, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div>
                  <DialogTitle></DialogTitle>
                  {/* card */}
                  <Card
                    className="cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    <CardContent>
                      <Image
                        src={meal.image}
                        alt={meal.name}
                        className="h-48 w-full object-cover rounded-md"
                        height={500}
                        width={500}
                      />

                      {/* Meal Name & Provider */}
                      <div className="mt-4">
                        <h1 className="font-bold text-lg">{meal.name}</h1>
                        {meal.busisnessName && (
                          <p className="text-sm text-gray-500 mt-1">
                            Provider: {meal.busisnessName}
                          </p>
                        )}
                      </div>

                      {/* Meal Description */}
                      <p className="mt-2 text-gray-600 text-sm">
                        {meal.description}
                      </p>

                      {/* Preparation Time and Servings */}
                      {(meal.prepTime || meal.servings) && (
                        <div className="mt-4 flex justify-between items-center text-gray-600 text-sm">
                          {meal.prepTime && (
                            <span className="flex items-center gap-1">
                              <Clock3 /> {meal.prepTime}
                            </span>
                          )}
                          {meal.servings && (
                            <div className="flex items-center gap-1">
                              <UsersRound />
                              <span className="font-semibold">
                                {meal.servings}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dietary Information Tags */}
                      {meal?.dietaryInfo?.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {meal.dietaryInfo.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: "#44C35622",
                                color: "#44C356",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Additional Tags (if any) */}
                      {meal.tags && meal.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {meal.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="font-bold text-[#44C356] mt-3">
                        {" "}
                        ${meal?.price?.toFixed(2)}
                      </p>
                    </CardContent>

                    <CardFooter>
                      <Button className="mt-5 w-full cursor-pointer transition-all ease-in-out duration-300 hover:outline-2 hover:outline-[#44C356] hover:text-[#44C356] hover:bg-white rounded-full">
                        Order Now
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </DialogTrigger>
              {/* Model */}
              <DialogContent className="p-4 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-1">{meal.name}</h2>

                {/* Reduced image container */}
                <div className="relative w-full h-40 overflow-hidden rounded-md mb-4">
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                    height={500}
                    width={500}
                  />
                </div>

                {/* Information Row */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
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
                      <span className="text-sm">Servings: {meal.servings}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm">{meal.description}</p>

                {/* Customization and Delivery Inputs */}
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
      )}
    </div>
  );
};

export default OrderMealPage;
