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
  UsersRound,
  Clock3,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";

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

export default function FindMeals() {
  const [meals, setMeals] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Array<any>>([]);
  const searchParams = useSearchParams();
  const diet = searchParams.get("diet");
  const cuisine = searchParams.get("cuisine");

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

  // old: Apply search and filters to meals
  // const applyFilters = (search: string, filters: string[]) => {
  //   let results = meals;

  //   // Apply search term (using "name" from backend)
  //   if (search) {
  //     const searchLower = search.toLowerCase();
  //     results = results?.filter(
  //       (meal) =>
  //         meal.name.toLowerCase().includes(searchLower) ||
  //         meal.description.toLowerCase().includes(searchLower) ||
  //         meal.cuisine.toLowerCase().includes(searchLower) ||
  //         meal.provider?.toLowerCase().includes(searchLower) ||
  //         meal.dietaryInfo.some((tag: any) =>
  //           tag.toLowerCase().includes(searchLower)
  //         ) ||
  //         meal.tags.some((tag: any) => tag.toLowerCase().includes(searchLower))
  //     );
  //   }

  //   // Apply filters
  //   if (filters.length > 0) {
  //     // old working one
  //     // results = results?.filter((meal) =>
  //     //   filters.some(
  //     //     (filter) =>
  //     //       meal.dietaryInfo.includes(filter) ||
  //     //       meal.cuisine === filter ||
  //     //       meal.provider === filter
  //     //   )
  //     // );

  //     // New one
  //     results = results?.filter((meal) =>
  //       filters.some(
  //         (filter) =>
  //           meal.dietaryInfo?.some(
  //             (tag: any) => tag.toLowerCase() === filter.toLowerCase()
  //           ) ||
  //           meal.cuisine?.toLowerCase() === filter.toLowerCase() ||
  //           meal.provider?.toLowerCase() === filter.toLowerCase()
  //       )
  //     );
  //   }

  //   setFilteredMeals(results);
  // };

  // New: apply search and filter to meal
  const applyFilters = useCallback(
    (search: string, filters: string[]) => {
      let results = meals;

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
            meal.tags.some((tag: any) =>
              tag.toLowerCase().includes(searchLower)
            )
        );
      }

      if (filters.length > 0) {
        results = results?.filter((meal) =>
          filters.some(
            (filter) =>
              meal.dietaryInfo?.some(
                (tag: any) => tag.toLowerCase() === filter.toLowerCase()
              ) ||
              meal.cuisine?.toLowerCase() === filter.toLowerCase() ||
              meal.provider?.toLowerCase() === filter.toLowerCase()
          )
        );
      }

      setFilteredMeals(results);
    },
    [meals]
  );

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilters([]);
    setFilteredMeals(meals);
  };

  // normalize quey value
  const normalizeQueryValue = (query: string | null, options: string[]) => {
    if (!query) return null;
    const match = options.find(
      (opt) => opt.toLowerCase() === query.toLowerCase()
    );
    return match || null;
  };

  // old one
  // useEffect(() => {
  //   const fetchMeals = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await getMeals();
  //       setMeals(response.data);
  //       setFilteredMeals(response.data);

  //       // apply query filter
  //       const initialFilters = [];
  //       const matchedDiet = normalizeQueryValue(diet, DIETARY_OPTIONS);
  //       const matchedCuisine = normalizeQueryValue(cuisine, CUISINE_OPTIONS);

  //       if (matchedDiet) initialFilters.push(matchedDiet);
  //       if (matchedCuisine) initialFilters.push(matchedCuisine);
  //       // console.log(initialFilters);

  //       setActiveFilters(initialFilters);
  //       applyFilters(searchTerm, initialFilters);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching meals:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchMeals();
  // }, []);

  // Fetch meals on mount
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await getMeals();
        const allMeals = response.data;
        setMeals(allMeals);

        const matchedDiet = normalizeQueryValue(diet, DIETARY_OPTIONS);
        const matchedCuisine = normalizeQueryValue(cuisine, CUISINE_OPTIONS);

        const initialFilters = [];
        if (matchedDiet) initialFilters.push(matchedDiet);
        if (matchedCuisine) initialFilters.push(matchedCuisine);

        setActiveFilters(initialFilters);
        applyFilters(searchTerm, initialFilters);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []); // ← only on first render

  // 2. Apply filters whenever diet, cuisine, searchTerm, or meals change
  useEffect(() => {
    const matchedDiet = normalizeQueryValue(diet, DIETARY_OPTIONS);
    const matchedCuisine = normalizeQueryValue(cuisine, CUISINE_OPTIONS);

    const currentFilters: string[] = [];
    if (matchedDiet) currentFilters.push(matchedDiet);
    if (matchedCuisine) currentFilters.push(matchedCuisine);

    setActiveFilters(currentFilters);
    applyFilters(searchTerm, currentFilters);
  }, [diet, cuisine, searchTerm, meals]);

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

        {/* Meals container*/}
        <div className="max-w-6xl mx-auto mb-8">
          {/*TODO: Need to add a loading spinner here  */}
          <div className="mt-6">
            {loading === true || filteredMeals?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                  <div
                    key={meal._id}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                  >
                    <Image
                      height={400}
                      width={400}
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-4">
                      {/* Title */}
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {meal.name}
                      </h3>

                      {/* Provider Info */}
                      <p className="text-sm text-gray-500 mb-2">
                        Provider: {meal.busisnessName}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-3">
                        {meal.description.length > 50
                          ? `${meal.description.slice(0, 50)}...`
                          : meal.description}
                      </p>

                      {/* Preparation Time and Servings */}
                      <div className="flex items-center justify-between text-gray-600 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Clock3 /> {meal.prepTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersRound />
                          <span className="font-medium">{meal.servings}</span>
                        </div>
                      </div>

                      {/* Dietary Info Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {meal?.dietaryInfo?.map((tag: any, index: number) => (
                          <span
                            key={index}
                            className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* General Tags */}
                      <div className="flex flex-wrap gap-2">
                        {meal.tags.map((tag: any, index: number) => (
                          <Badge variant="outline" key={index}>
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 py-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(meal.rating ?? 0)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {typeof meal.rating === "number"
                            ? meal.rating.toFixed(1)
                            : "No"}{" "}
                          rating
                        </span>
                      </div>

                      {/* Price & CTA */}
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          ${meal.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Link href={`/find-meals/${meal._id}`}>
                      <Button
                        variant="outline"
                        className="mx-3 mb-3 w-[94%] cursor-pointer"
                      >
                        View Details
                      </Button>
                    </Link>
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
          </div>
        </div>
      </div>
    </div>
  );
}
