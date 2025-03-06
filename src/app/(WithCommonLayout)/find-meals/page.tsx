/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Leaf,
  Utensils,
  ChefHat,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import SectionHeading from "@/components/shared/SectionHeading";
import { getMeals } from "@/services/Meal";
import { useCart } from "@/context/UserContext";
import { toast } from "sonner";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low Carb",
  "High Protein",
];

const CUISINE_OPTIONS = [
  "American",
  "Italian",
  "Mexican",
  "Indian",
  "Mediterranean",
  "Asian",
  "Fusion",
  "Thai",
];

const PROVIDER_OPTIONS = [
  "Green Kitchen",
  "Plant Power",
  "Keto Kitchen",
  "Fresh Direct",
  "Spice Market",
  "Family Table",
];

const FindMeals: React.FC = () => {
  const [meals, setMeals] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Array<any>>([]);
  const { setCart } = useCart();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, activeFilters);
  };

  // Toggle filter option
  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const newFilters = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];
      applyFilters(searchTerm, newFilters);
      return newFilters;
    });
  };

  // Apply search and filters to meals
  const applyFilters = (search: string, filters: string[]) => {
    let results = meals;

    // Apply search term (using "name" from backend)
    if (search) {
      const searchLower = search.toLowerCase();
      results = results?.filter(
        (meal) =>
          meal.name.toLowerCase().includes(searchLower) ||
          meal.description.toLowerCase().includes(searchLower) ||
          meal.cuisine.toLowerCase().includes(searchLower) ||
          meal.provider?.toLowerCase().includes(searchLower) ||
          meal.dietaryInfo.some((tag: any) =>
            tag.toLowerCase().includes(searchLower)
          ) ||
          meal.tags.some((tag: any) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.length > 0) {
      results = results?.filter((meal) =>
        filters.some(
          (filter) =>
            meal.dietaryInfo.includes(filter) ||
            meal.cuisine === filter ||
            meal.provider === filter
        )
      );
    }

    setFilteredMeals(results);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilters([]);
    setFilteredMeals(meals);
  };

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await getMeals();
        // Assuming response.data contains an array of meals
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

  return (
    <div>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <SectionHeading
          title="Find Your Perfect Meal"
          subtitle="Search and filter meals based on your preferences, dietary needs, and favorite cuisines"
          decorative={true}
        />

        {/* Search and filter bar */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search meals, cuisines, or ingredients..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 lg:w-auto w-full"
              onClick={() =>
                document
                  .getElementById("filter-section")
                  ?.classList.toggle("hidden")
              }
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters?.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters?.length}
                </Badge>
              )}
            </Button>
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                className="flex items-center gap-2 lg:w-auto w-full"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Filter section - toggleable on mobile */}
          <div
            id="filter-section"
            className="hidden mb-6 bg-card rounded-lg p-4 border"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filter Options
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  document
                    .getElementById("filter-section")
                    ?.classList.add("hidden")
                }
              >
                Done
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="dietary">
                  <AccordionTrigger className="flex items-center">
                    <span className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Dietary Preferences
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {DIETARY_OPTIONS.map((option) => (
                        <Badge
                          key={option}
                          variant={
                            activeFilters.includes(option)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleFilter(option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cuisine">
                  <AccordionTrigger className="flex items-center">
                    <span className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-amber-600" />
                      Cuisine Types
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {CUISINE_OPTIONS.map((option) => (
                        <Badge
                          key={option}
                          variant={
                            activeFilters.includes(option)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleFilter(option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="provider">
                  <AccordionTrigger className="flex items-center">
                    <span className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-blue-600" />
                      Meal Providers
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {PROVIDER_OPTIONS.map((option) => (
                        <Badge
                          key={option}
                          variant={
                            activeFilters.includes(option)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleFilter(option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Active filters display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="flex items-center gap-1 py-1 px-3"
                >
                  {filter}
                  <button
                    onClick={() => toggleFilter(filter)}
                    className="ml-1 hover:text-destructive"
                  >
                    &times;
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tabs for viewing options */}
        <Tabs defaultValue="all" className="max-w-6xl mx-auto mb-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New Arrivals</TabsTrigger>
          </TabsList>

          {/*TODO: Need to add a loading spinner here  */}
          <TabsContent value="all" className="mt-6">
            {loading === true || filteredMeals?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                  <div
                    key={meal._id}
                    className="border rounded-lg overflow-hidden shadow"
                  >
                    <Image
                      height={400}
                      width={400}
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{meal.name}</h3>
                      <p className="text-sm text-gray-600">
                        {meal.description}
                      </p>
                      <div className="flex justify-between mt-4">
                        <span className="text-sm">Prep: {meal.prepTime}</span>
                        <span className="text-sm">
                          Servings: {meal.servings}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {meal.tags.map((tag: any, index: number) => (
                            <Badge variant={"outline"} key={index}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold text-green-600">
                          ${meal.price}
                        </h3>
                      </div>
                      <div className="mt-2">
                        <Button
                          onClick={() => {
                            setCart((previousMeal: any) => [
                              ...previousMeal,
                              meal,
                            ]);
                            toast.success("Food added to your cart.");
                          }}
                        >
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  No meals match your criteria
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search term
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals
                .filter((meal: any) => meal.rating > 4.7)
                .map((meal: any) => (
                  <div
                    key={meal._id}
                    className="border rounded-lg overflow-hidden shadow"
                  >
                    <Image
                      height={400}
                      width={400}
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{meal.name}</h3>
                      <p className="text-sm text-gray-600">
                        {meal.description}
                      </p>
                      <div className="flex justify-between mt-4">
                        <span className="text-sm">Prep: {meal.prepTime}</span>
                        <span className="text-sm">
                          Servings: {meal.servings}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {meal.tags.map((tag: any, index: number) => (
                            <Badge variant={"outline"} key={index}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold text-green-600">
                          ${meal.price}
                        </h3>
                      </div>
                      <div className="mt-2">
                        <Button
                          onClick={() => {
                            setCart((previousMeal: any) => [
                              ...previousMeal,
                              meal,
                            ]);
                            toast.success("Food added to your cart.");
                          }}
                        >
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.slice(0, 3).map((meal: any) => (
                <div
                  key={meal._id}
                  className="border rounded-lg overflow-hidden shadow"
                >
                  <Image
                    height={400}
                    width={400}
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{meal.name}</h3>
                    <p className="text-sm text-gray-600">{meal.description}</p>
                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Prep: {meal.prepTime}</span>
                      <span className="text-sm">Servings: {meal.servings}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {meal.tags.map((tag: any, index: number) => (
                          <Badge variant={"outline"} key={index}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-green-600">
                        ${meal.price}
                      </h3>
                    </div>
                    <div className="mt-2">
                      <Button
                        onClick={() => {
                          setCart((previousMeal: any) => [
                            ...previousMeal,
                            meal,
                          ]);
                          toast.success("Food added to your cart.");
                        }}
                      >
                        Order Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FindMeals;
