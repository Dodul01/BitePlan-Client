"use client";

import React, { useState } from "react";
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

// Sample meal data
const MOCK_MEALS = [
  {
    id: "meal-1",
    title: "Mediterranean Bowl",
    description:
      "Fresh vegetables, hummus, and grilled chicken over quinoa with tzatziki sauce.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhlYWx0aHklMjBtZWFsfGVufDB8fDB8fHww",
    prepTime: "25 mins",
    servings: 1,
    tags: ["Mediterranean", "High Protein"],
    dietaryInfo: ["Gluten-Free", "Dairy Optional"],
    cuisine: "Mediterranean",
    rating: 4.8,
    provider: "Green Kitchen",
  },
  {
    id: "meal-2",
    title: "Vegan Curry Bowl",
    description:
      "Coconut curry with seasonal vegetables, tofu, and brown rice.",
    image:
      "https://images.unsplash.com/photo-1540914124281-342587941389?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VycnklMjBkaXNofGVufDB8fDB8fHww",
    prepTime: "30 mins",
    servings: 2,
    tags: ["Curry", "Plant-Based"],
    dietaryInfo: ["Vegan", "Gluten-Free"],
    cuisine: "Indian",
    rating: 4.7,
    provider: "Plant Power",
  },
  {
    id: "meal-3",
    title: "Keto Steak Plate",
    description:
      "Grass-fed sirloin with cauliflower mash and roasted vegetables.",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWslMjBkaW5uZXJ8ZW58MHx8MHx8fDA%3D",
    prepTime: "35 mins",
    servings: 1,
    tags: ["High Protein", "Low Carb"],
    dietaryInfo: ["Keto", "Paleo"],
    cuisine: "American",
    rating: 4.9,
    provider: "Keto Kitchen",
  },
  {
    id: "meal-4",
    title: "Superfood Salad",
    description:
      "Mixed greens, berries, nuts, and a citrus vinaigrette with optional grilled salmon.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FsYWQlMjBtZWFsfGVufDB8fDB8fHww",
    prepTime: "15 mins",
    servings: 1,
    tags: ["Salad", "Superfood"],
    dietaryInfo: ["Vegetarian", "Pescatarian Optional"],
    cuisine: "Fusion",
    rating: 4.6,
    provider: "Fresh Direct",
  },
  {
    id: "meal-5",
    title: "Mexican Bowl",
    description:
      "Black beans, rice, avocado, salsa, and grilled vegetables with optional chicken.",
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1leGljYW4lMjBib3dsfGVufDB8fDB8fHww",
    prepTime: "20 mins",
    servings: 1,
    tags: ["Mexican", "Bowl"],
    dietaryInfo: ["Vegetarian", "Protein Options"],
    cuisine: "Mexican",
    rating: 4.5,
    provider: "Spice Market",
  },
  {
    id: "meal-6",
    title: "Lemon Herb Chicken",
    description:
      "Herb-roasted chicken breast with seasonal vegetables and quinoa.",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNoaWNrZW4lMjBkaW5uZXJ8ZW58MHx8MHx8fDA%3D",
    prepTime: "40 mins",
    servings: 2,
    tags: ["Chicken", "Family Meal"],
    dietaryInfo: ["High Protein", "Dairy-Free"],
    cuisine: "Mediterranean",
    rating: 4.7,
    provider: "Family Table",
  },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredMeals, setFilteredMeals] = useState(MOCK_MEALS);

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
    let results = MOCK_MEALS;

    // Apply search term
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (meal) =>
          meal.title.toLowerCase().includes(searchLower) ||
          meal.description.toLowerCase().includes(searchLower) ||
          meal.cuisine.toLowerCase().includes(searchLower) ||
          meal.provider.toLowerCase().includes(searchLower) ||
          meal.dietaryInfo.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          ) ||
          meal.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.length > 0) {
      results = results.filter((meal) =>
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
    setFilteredMeals(MOCK_MEALS);
  };

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
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters.length}
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

          <TabsContent value="all" className="mt-6">
            {filteredMeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="border rounded-lg overflow-hidden shadow"
                  >
                    <Image
                      height={400}
                      width={400}
                      src={meal.image}
                      alt={meal.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{meal.title}</h3>
                      <p className="text-sm text-gray-600">
                        {meal.description}
                      </p>
                      <div className="flex justify-between mt-4">
                        <span className="text-sm">Prep: {meal.prepTime}</span>
                        <span className="text-sm">
                          Servings: {meal.servings}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {meal.tags.map((tag, index) => (
                          <Badge variant={"outline"} key={index}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2">
                        <Button>Order Now</Button>
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
              {MOCK_MEALS.filter((meal) => meal.rating > 4.7).map((meal) => (
                <div
                  key={meal.id}
                  className="border rounded-lg overflow-hidden shadow"
                >
                  <Image
                    height={400}
                    width={400}
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{meal.title}</h3>
                    <p className="text-sm text-gray-600">{meal.description}</p>
                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Prep: {meal.prepTime}</span>
                      <span className="text-sm">Servings: {meal.servings}</span>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {meal.tags.map((tag, index) => (
                        <Badge variant={"outline"} key={index}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button>Order Now</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_MEALS.slice(0, 3).map((meal) => (
                <div
                  key={meal.id}
                  className="border rounded-lg overflow-hidden shadow"
                >
                  <Image
                    height={400}
                    width={400}
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{meal.title}</h3>
                    <p className="text-sm text-gray-600">{meal.description}</p>
                    <div className="flex justify-between mt-4">
                      <span className="text-sm">Prep: {meal.prepTime}</span>
                      <span className="text-sm">Servings: {meal.servings}</span>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {meal.tags.map((tag, index) => (
                        <Badge variant={"outline"} key={index}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button>Order Now</Button>
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
