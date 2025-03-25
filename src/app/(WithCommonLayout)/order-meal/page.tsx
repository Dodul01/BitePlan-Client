"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getMeals } from "@/services/Meal";

interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  dietary: string[];
  basePrice: number;
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

  useEffect(() => {
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

    fetchMeals();
  }, []);

  useEffect(() => {
    setFilteredMeals(
      meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, meals]);

  const handleSubmit = async () => {
    if (!selectedMeal) return;
    setIsSubmitting(true);

    try {
      // Submit order logic
      console.log("Order details:", {
        meal: selectedMeal,
        customization,
        schedule,
      });

      // Reset form
      setSelectedMeal(null);
      setCustomization("");
      setSchedule("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#44C356" }}>
        Browse Our Menu
      </h1>

      <div className="mb-8">
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
          {filteredMeals?.map((meal) => (
            <Dialog key={meal.id}>
              <DialogTrigger asChild>
                <Card
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => setSelectedMeal(meal)}
                >
                  <CardHeader className="font-bold text-lg">
                    {meal.name}
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      className="h-48 w-full object-cover rounded-md"
                      height={500}
                      width={500}
                    />
                    <p className="mt-4 text-gray-600">{meal.description}</p>
                    <div className="mt-2 flex gap-2">
                      {meal?.dietary?.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: "#44C35622",
                            color: "#44C356",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="font-bold">
                    ${meal?.basePrice?.toFixed(2)}
                  </CardFooter>
                </Card>
              </DialogTrigger>

              <DialogContent style={{ borderColor: "#44C356" }}>
                <h2 className="text-2xl font-bold mb-4">{meal.name}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium">
                      Customization Requests
                    </label>
                    <Input
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
                    style={{
                      backgroundColor: "#44C356",
                    }}
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
