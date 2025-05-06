// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { Suspense, useEffect, useState } from "react";
// import {
//   Search,
//   Filter,
//   SlidersHorizontal,
//   Leaf,
//   Utensils,
//   ChefHat,
//   UsersRound,
//   Clock3,
//   Star,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationPrevious,
//   PaginationNext,
// } from "@/components/ui/pagination";
// import Image from "next/image";
// import SectionHeading from "@/components/shared/SectionHeading";
// import { getMeals } from "@/services/Meal";
// import { useSearchParams } from "next/navigation";
// import { useCallback } from "react";
// import Link from "next/link";

// const DIETARY_OPTIONS = [
//   "Vegetarian",
//   "Vegan",
//   "Gluten-Free",
//   "Dairy-Free",
//   "Keto",
//   "Paleo",
//   "Low Carb",
//   "High Protein",
// ];

// const CUISINE_OPTIONS = [
//   "American",
//   "Italian",
//   "Mexican",
//   "Indian",
//   "Mediterranean",
//   "Asian",
//   "Fusion",
//   "Thai",
// ];

// const PROVIDER_OPTIONS = [
//   "Green Kitchen",
//   "Plant Power",
//   "Keto Kitchen",
//   "Fresh Direct",
//   "Spice Market",
//   "Family Table",
// ];

// export default function FindMeals() {
//   const [meals, setMeals] = useState<Array<any>>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilters, setActiveFilters] = useState<string[]>([]);
//   const [filteredMeals, setFilteredMeals] = useState<Array<any>>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   const searchParams = useSearchParams();
//   const diet = searchParams.get("diet");
//   const cuisine = searchParams.get("cuisine");

//   // paginated meals
//   const paginatedMeals = filteredMeals.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     applyFilters(value, activeFilters);
//   };

//   // Toggle filter option
//   const toggleFilter = (filter: string) => {
//     setActiveFilters((prev) => {
//       const newFilters = prev.includes(filter)
//         ? prev.filter((f) => f !== filter)
//         : [...prev, filter];
//       applyFilters(searchTerm, newFilters);
//       return newFilters;
//     });
//   };

//   // New: apply search and filter to meal
//   const applyFilters = useCallback(
//     (search: string, filters: string[]) => {
//       setCurrentPage(1);
//       let results = meals;

//       if (search) {
//         const searchLower = search.toLowerCase();
//         results = results?.filter(
//           (meal) =>
//             meal.name.toLowerCase().includes(searchLower) ||
//             meal.description.toLowerCase().includes(searchLower) ||
//             meal.cuisine.toLowerCase().includes(searchLower) ||
//             meal.provider?.toLowerCase().includes(searchLower) ||
//             meal.dietaryInfo.some((tag: any) =>
//               tag.toLowerCase().includes(searchLower)
//             ) ||
//             meal.tags.some((tag: any) =>
//               tag.toLowerCase().includes(searchLower)
//             )
//         );
//       }

//       if (filters.length > 0) {
//         results = results?.filter((meal) =>
//           filters.some(
//             (filter) =>
//               meal.dietaryInfo?.some(
//                 (tag: any) => tag.toLowerCase() === filter.toLowerCase()
//               ) ||
//               meal.cuisine?.toLowerCase() === filter.toLowerCase() ||
//               meal.provider?.toLowerCase() === filter.toLowerCase()
//           )
//         );
//       }

//       setFilteredMeals(results);
//     },
//     [meals]
//   );

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchTerm("");
//     setActiveFilters([]);
//     setFilteredMeals(meals);
//   };

//   // normalize quey value
//   const normalizeQueryValue = (query: string | null, options: string[]) => {
//     if (!query) return null;
//     const match = options.find(
//       (opt) => opt.toLowerCase() === query.toLowerCase()
//     );
//     return match || null;
//   };

//   // Fetch meals on mount
//   useEffect(() => {
//     const fetchMeals = async () => {
//       setLoading(true);
//       try {
//         const response = await getMeals();
//         const allMeals = response.data;
//         setMeals(allMeals);

//         const matchedDiet = normalizeQueryValue(diet, DIETARY_OPTIONS);
//         const matchedCuisine = normalizeQueryValue(cuisine, CUISINE_OPTIONS);

//         const initialFilters = [];
//         if (matchedDiet) initialFilters.push(matchedDiet);
//         if (matchedCuisine) initialFilters.push(matchedCuisine);

//         setActiveFilters(initialFilters);
//         applyFilters(searchTerm, initialFilters);
//       } catch (error) {
//         console.error("Error fetching meals:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeals();
//   }, []); // ← only on first render

//   // 2. Apply filters whenever diet, cuisine, searchTerm, or meals change
//   useEffect(() => {
//     const matchedDiet = normalizeQueryValue(diet, DIETARY_OPTIONS);
//     const matchedCuisine = normalizeQueryValue(cuisine, CUISINE_OPTIONS);

//     const currentFilters: string[] = [];
//     if (matchedDiet) currentFilters.push(matchedDiet);
//     if (matchedCuisine) currentFilters.push(matchedCuisine);

//     setActiveFilters(currentFilters);
//     applyFilters(searchTerm, currentFilters);
//   }, [diet, cuisine, searchTerm, meals]);

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <div>
//         <div className="container mx-auto px-4 py-16 md:py-24">
//           <SectionHeading
//             title="Browse Your Perfect Meal"
//             subtitle="Search and filter meals based on your preferences, dietary needs, and favorite cuisines"
//             decorative={true}
//           />

//           {/* Search and filter bar */}
//           <div className="mb-8 max-w-4xl mx-auto">
//             <div className="flex flex-col lg:flex-row gap-4 mb-6">
//               <div className="relative flex-grow">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   type="text"
//                   placeholder="Search meals, cuisines, or ingredients..."
//                   className="pl-10"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                 />
//               </div>
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2 lg:w-auto w-full"
//                 onClick={() =>
//                   document
//                     .getElementById("filter-section")
//                     ?.classList.toggle("hidden")
//                 }
//               >
//                 <Filter className="h-4 w-4" />
//                 Filters
//                 {activeFilters?.length > 0 && (
//                   <Badge variant="secondary" className="ml-1">
//                     {activeFilters?.length}
//                   </Badge>
//                 )}
//               </Button>
//               {activeFilters.length > 0 && (
//                 <Button
//                   variant="ghost"
//                   className="flex items-center gap-2 lg:w-auto w-full"
//                   onClick={clearFilters}
//                 >
//                   Clear All
//                 </Button>
//               )}
//             </div>

//             {/* Filter section - toggleable on mobile */}
//             <div
//               id="filter-section"
//               className="hidden mb-6 bg-card rounded-lg p-4 border"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-medium flex items-center gap-2">
//                   <SlidersHorizontal className="h-4 w-4" />
//                   Filter Options
//                 </h3>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() =>
//                     document
//                       .getElementById("filter-section")
//                       ?.classList.add("hidden")
//                   }
//                 >
//                   Done
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <Accordion type="single" collapsible className="w-full">
//                   <AccordionItem value="dietary">
//                     <AccordionTrigger className="flex items-center">
//                       <span className="flex items-center gap-2">
//                         <Leaf className="h-4 w-4 text-green-600" />
//                         Dietary Preferences
//                       </span>
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       <div className="flex flex-wrap gap-2 pt-2">
//                         {DIETARY_OPTIONS.map((option) => (
//                           <Badge
//                             key={option}
//                             variant={
//                               activeFilters.includes(option)
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className="cursor-pointer"
//                             onClick={() => toggleFilter(option)}
//                           >
//                             {option}
//                           </Badge>
//                         ))}
//                       </div>
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>

//                 <Accordion type="single" collapsible className="w-full">
//                   <AccordionItem value="cuisine">
//                     <AccordionTrigger className="flex items-center">
//                       <span className="flex items-center gap-2">
//                         <Utensils className="h-4 w-4 text-amber-600" />
//                         Cuisine Types
//                       </span>
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       <div className="flex flex-wrap gap-2 pt-2">
//                         {CUISINE_OPTIONS.map((option) => (
//                           <Badge
//                             key={option}
//                             variant={
//                               activeFilters.includes(option)
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className="cursor-pointer"
//                             onClick={() => toggleFilter(option)}
//                           >
//                             {option}
//                           </Badge>
//                         ))}
//                       </div>
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>

//                 <Accordion type="single" collapsible className="w-full">
//                   <AccordionItem value="provider">
//                     <AccordionTrigger className="flex items-center">
//                       <span className="flex items-center gap-2">
//                         <ChefHat className="h-4 w-4 text-blue-600" />
//                         Meal Providers
//                       </span>
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       <div className="flex flex-wrap gap-2 pt-2">
//                         {PROVIDER_OPTIONS.map((option) => (
//                           <Badge
//                             key={option}
//                             variant={
//                               activeFilters.includes(option)
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className="cursor-pointer"
//                             onClick={() => toggleFilter(option)}
//                           >
//                             {option}
//                           </Badge>
//                         ))}
//                       </div>
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>
//               </div>
//             </div>

//             {/* Active filters display */}
//             {activeFilters.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {activeFilters.map((filter) => (
//                   <Badge
//                     key={filter}
//                     variant="secondary"
//                     className="flex items-center gap-1 py-1 px-3"
//                   >
//                     {filter}
//                     <button
//                       onClick={() => toggleFilter(filter)}
//                       className="ml-1 hover:text-destructive"
//                     >
//                       &times;
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* New Meals Container */}
//           <div className="max-w-6xl mx-auto mb-8">
//             <div className="mt-6">
//               {loading === true || filteredMeals?.length > 0 ? (
//                 <>
//                   {/* Meals */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//                     {paginatedMeals.map((meal) => (
//                       <div
//                         key={meal._id}
//                         className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
//                       >
//                         <Image
//                           height={300}
//                           width={400}
//                           src={meal.image}
//                           alt={meal.name}
//                           className="w-full h-40 object-cover"
//                         />

//                         <div className="p-4 flex flex-col flex-grow">
//                           <h3 className="text-lg font-semibold text-gray-800 mb-1">
//                             {meal.name}
//                           </h3>

//                           <p className="text-xs text-gray-500 mb-1">
//                             Provider: {meal.busisnessName}
//                           </p>

//                           <p className="text-sm text-gray-700 line-clamp-1 mb-2">
//                             {meal.description}
//                           </p>

//                           <div className="flex items-center justify-between text-gray-600 text-xs mb-2">
//                             <div className="flex items-center gap-1">
//                               <Clock3 className="w-4 h-4" />
//                               {meal.prepTime}
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <UsersRound className="w-4 h-4" />
//                               {meal.servings}
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-1 text-xs text-green-700 mb-2">
//                             {meal?.dietaryInfo?.map((tag: any, idx: number) => (
//                               <span
//                                 key={idx}
//                                 className="px-2 py-0.5 bg-green-100 rounded-full"
//                               >
//                                 {tag}
//                               </span>
//                             ))}
//                           </div>

//                           <div className="flex flex-wrap gap-1 mb-2">
//                             {meal.tags.map((tag: any, idx: number) => (
//                               <Badge
//                                 variant="outline"
//                                 key={idx}
//                                 className="text-xs"
//                               >
//                                 {tag}
//                               </Badge>
//                             ))}
//                           </div>

//                           <div className="flex items-center gap-2 mb-2">
//                             <div className="flex">
//                               {Array.from({ length: 5 }).map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   className={`w-4 h-4 ${
//                                     i < Math.round(meal.rating ?? 0)
//                                       ? "fill-yellow-500 text-yellow-500"
//                                       : "text-gray-300"
//                                   }`}
//                                 />
//                               ))}
//                             </div>
//                             <span className="text-xs text-gray-600">
//                               {typeof meal.rating === "number"
//                                 ? meal.rating.toFixed(1)
//                                 : "No"}{" "}
//                               rating
//                             </span>
//                           </div>

//                           <div className="text-green-600 font-bold text-lg mb-3">
//                             ${meal.price.toFixed(2)}
//                           </div>

//                           <Link
//                             href={`/find-meals/${meal._id}`}
//                             className="mt-auto"
//                           >
//                             <Button variant="outline" className="w-full">
//                               View Details
//                             </Button>
//                           </Link>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* paginations */}
//                   {filteredMeals.length > itemsPerPage && (
//                     <Pagination className="mt-8 justify-center">
//                       <PaginationContent>
//                         {/* Previous */}
//                         <PaginationItem>
//                           <PaginationPrevious
//                             onClick={() =>
//                               setCurrentPage((prev) => Math.max(prev - 1, 1))
//                             }
//                             className={
//                               currentPage === 1
//                                 ? "pointer-events-none cursor-pointer opacity-50"
//                                 : "cursor-pointer"
//                             }
//                           />
//                         </PaginationItem>

//                         {/* Pages */}
//                         {Array.from({
//                           length: Math.ceil(
//                             filteredMeals.length / itemsPerPage
//                           ),
//                         }).map((_, idx) => (
//                           <PaginationItem key={idx}>
//                             <PaginationLink
//                               className="cursor-pointer"
//                               isActive={currentPage === idx + 1}
//                               onClick={() => setCurrentPage(idx + 1)}
//                             >
//                               {idx + 1}
//                             </PaginationLink>
//                           </PaginationItem>
//                         ))}

//                         {/* Next */}
//                         <PaginationItem>
//                           <PaginationNext
//                             onClick={() =>
//                               setCurrentPage((prev) =>
//                                 Math.min(
//                                   prev + 1,
//                                   Math.ceil(filteredMeals.length / itemsPerPage)
//                                 )
//                               )
//                             }
//                             className={
//                               currentPage ===
//                               Math.ceil(filteredMeals.length / itemsPerPage)
//                                 ? "pointer-events-none opacity-50 cursor-pointer"
//                                 : "cursor-pointer"
//                             }
//                           />
//                         </PaginationItem>
//                       </PaginationContent>
//                     </Pagination>
//                   )}
//                 </>
//               ) : (
//                 <div className="text-center py-12">
//                   <h3 className="text-lg font-medium mb-2">
//                     No meals match your criteria
//                   </h3>
//                   <p className="text-muted-foreground mb-6">
//                     Try adjusting your filters or search term
//                   </p>
//                   <Button onClick={clearFilters}>Clear All Filters</Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Suspense>
//   );
// }

// app/find-meals/page.tsx
import FindMealPage from "@/components/shared/FindMealPage";
import { Suspense } from "react";

export default function FindMealsPage() {
  return (
    <Suspense fallback={<div>Loading meals...</div>}>
      <FindMealPage />
    </Suspense>
  );
}
