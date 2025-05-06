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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const paginatedMeals = filteredMeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        title="Explore Our Meals"
        subtitle="Choose your favorites and schedule delivery at your convenience."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)]?.map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {paginatedMeals?.map((meal: any, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div>
                  <DialogTitle></DialogTitle>
                  {/* card */}
                  <Card
                    className="group cursor-pointer rounded-xl border hover:shadow-lg transition-all flex flex-col h-full"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    <CardContent className="p-4 flex flex-col flex-grow">
                      {/* Image */}
                      <div className="relative w-full h-40 overflow-hidden rounded-lg">
                        <Image
                          src={meal.image}
                          alt={meal.name}
                          className="object-cover w-full h-full"
                          width={500}
                          height={500}
                        />
                      </div>

                      {/* Meal Title & Provider */}
                      <div className="mt-3 space-y-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {meal.name}
                        </h2>
                        {meal.busisnessName && (
                          <p className="text-xs text-gray-500">
                            By {meal.busisnessName}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {meal.description}
                      </p>

                      {/* Meta info: prep + servings */}
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        {meal.prepTime && (
                          <span className="flex items-center gap-1">
                            <Clock3 className="w-4 h-4" /> {meal.prepTime}
                          </span>
                        )}
                        {meal.servings && (
                          <span className="flex items-center gap-1">
                            <UsersRound className="w-4 h-4" /> {meal.servings}
                          </span>
                        )}
                      </div>

                      {/* Dietary tags */}
                      {meal.dietaryInfo?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {meal.dietaryInfo.map(
                            (tag: string, index: number) => (
                              <span
                                key={index}
                                className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-600"
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      )}

                      {/* Additional tags */}
                      {meal.tags?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {meal.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Spacer */}
                      <div className="flex-grow" />

                      {/* Price */}
                      <p className="text-sm font-bold text-[#44C356] mt-4">
                        ${meal?.price?.toFixed(2)}
                      </p>
                    </CardContent>

                    {/* CTA Button */}
                    <CardFooter className="px-4 pb-4">
                      <Button className="w-full rounded-full bg-[#44C356] text-white hover:bg-white hover:text-[#44C356] hover:border-[#44C356] transition">
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

                <p className="text-sm bg-[#FFC400] text-black  rounded-lg text-center">
                  *IF YOU DON&apos;T NEED TO CUSTOMIZE YOUR MEAL, CLICK ON
                  COMPLETE ORDER*
                </p>

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

      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }).map((_, idx) => (
          <Button
            key={idx}
            variant={currentPage === idx + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderMealPage;
