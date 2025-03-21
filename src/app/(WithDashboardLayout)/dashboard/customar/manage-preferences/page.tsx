"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, X, Utensils, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import SectionHeading from "@/components/shared/SectionHeading";

const ManagePreferencesAlternative = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Dietary restrictions state
  const [allergies, setAllergies] = useState<string[]>(["nuts", "shellfish"]);
  const [dietaryTypes, setDietaryTypes] = useState<string[]>(["vegetarian"]);

  // Cuisine preferences state
  const [cuisines, setCuisines] = useState<string[]>([
    "italian",
    "mexican",
    "japanese",
  ]);
  const [spiceLevel, setSpiceLevel] = useState("medium");

  // Portion size state
  const [portionSize, setPortionSize] = useState("regular");

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    dietary: true,
    cuisines: true,
    portions: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  const handleSavePreferences = () => {
    setIsLoading(true);

    // Simulate saving preferences to the backend
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Your meal preferences have been updated successfully.");
    }, 1000);
  };

  const removeCuisine = (cuisine: string) => {
    setCuisines(cuisines.filter((c) => c !== cuisine));
  };

  const toggleDietaryType = (type: string) => {
    if (dietaryTypes.includes(type)) {
      setDietaryTypes(dietaryTypes.filter((t) => t !== type));
    } else {
      setDietaryTypes([...dietaryTypes, type]);
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter((a) => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  return (
    <div>
      <div className="container max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Manage Your Meal Preferences"
          subtitle="Customize your meal experience with your dietary needs and taste preferences"
        />

        <div className="space-y-6">
          {/* Dietary Restrictions Section */}
          <Card>
            <Collapsible
              open={openSections.dietary}
              onOpenChange={() => toggleSection("dietary")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Dietary Restrictions</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {openSections.dietary ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Diet Types */}
                    <div>
                      <h3 className="font-medium mb-3">Diet Type</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          "vegetarian",
                          "vegan",
                          "pescatarian",
                          "keto",
                          "paleo",
                          "gluten-free",
                        ].map((diet) => (
                          <div
                            key={diet}
                            className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                              dietaryTypes.includes(diet)
                                ? "bg-primary/10 border-primary"
                                : ""
                            }`}
                            onClick={() => toggleDietaryType(diet)}
                          >
                            <div
                              className={`h-4 w-4 rounded-sm flex items-center justify-center ${
                                dietaryTypes.includes(diet)
                                  ? "bg-primary"
                                  : "border border-input"
                              }`}
                            >
                              {dietaryTypes.includes(diet) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className="capitalize text-sm">
                              {diet.replace("-", " ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Allergies */}
                    <div>
                      <h3 className="font-medium mb-3">
                        Allergies & Intolerances
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select any ingredients you need to avoid
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "nuts",
                          "dairy",
                          "eggs",
                          "shellfish",
                          "soy",
                          "wheat",
                          "fish",
                        ].map((allergy) => (
                          <Badge
                            key={allergy}
                            variant={
                              allergies.includes(allergy)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground transition-colors"
                            onClick={() => toggleAllergy(allergy)}
                          >
                            {allergy}
                            {allergies.includes(allergy) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAllergy(allergy);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Cuisine Preferences Section */}
          <Card>
            <Collapsible
              open={openSections.cuisines}
              onOpenChange={() => toggleSection("cuisines")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Cuisine Preferences</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {openSections.cuisines ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Favorite Cuisines */}
                    <div>
                      <h3 className="font-medium mb-3">
                        Your Favorite Cuisines
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {cuisines.map((cuisine) => (
                          <Badge key={cuisine} className="pl-2 py-1">
                            {cuisine}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                              onClick={() => removeCuisine(cuisine)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                        {[
                          "thai",
                          "indian",
                          "chinese",
                          "french",
                          "korean",
                          "vietnamese",
                          "greek",
                          "mediterranean",
                        ].map((cuisine) => (
                          <Badge
                            key={cuisine}
                            variant={
                              cuisines.includes(cuisine) ? "default" : "outline"
                            }
                            className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground transition-colors justify-center"
                            onClick={() => {
                              if (cuisines.includes(cuisine)) {
                                removeCuisine(cuisine);
                              } else {
                                setCuisines([...cuisines, cuisine]);
                              }
                            }}
                          >
                            {cuisine}
                            {cuisines.includes(cuisine) && (
                              <span className="ml-1">✓</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Spice Level */}
                    <div>
                      <h3 className="font-medium mb-3">Spice Preference</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          "mild",
                          "medium-mild",
                          "medium",
                          "medium-hot",
                          "hot",
                        ].map((level) => (
                          <div
                            key={level}
                            className={`text-center p-2 border rounded-md cursor-pointer ${
                              spiceLevel === level
                                ? "bg-primary/10 border-primary"
                                : ""
                            }`}
                            onClick={() => setSpiceLevel(level)}
                          >
                            <Utensils
                              className={`h-5 w-5 mx-auto mb-1 ${
                                spiceLevel === level
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <span className="text-xs capitalize block mt-1">
                              {level.replace("-", " ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Portion Sizes Section */}
          <Card>
            <Collapsible
              open={openSections.portions}
              onOpenChange={() => toggleSection("portions")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Portion Sizes</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {openSections.portions ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Portion Size Selection */}
                    <div>
                      <h3 className="font-medium mb-3">
                        Preferred Portion Size
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {["small", "regular", "large"].map((size) => (
                          <div
                            key={size}
                            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                              portionSize === size
                                ? "bg-primary/10 border-primary"
                                : ""
                            }`}
                            onClick={() => setPortionSize(size)}
                          >
                            <div
                              className={`w-${
                                size === "small"
                                  ? "4"
                                  : size === "regular"
                                  ? "6"
                                  : "8"
                              } h-${
                                size === "small"
                                  ? "4"
                                  : size === "regular"
                                  ? "6"
                                  : "8"
                              } rounded-full bg-primary/20 mb-2`}
                            ></div>
                            <span className="font-medium capitalize">
                              {size}
                            </span>
                            <span className="text-xs text-muted-foreground text-center mt-1">
                              {size === "small"
                                ? "Lower calories"
                                : size === "regular"
                                ? "Standard portion"
                                : "Larger serving"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSavePreferences}
              disabled={isLoading}
              size="lg"
              className="px-8"
            >
              {isLoading ? "Saving..." : "Save All Preferences"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePreferencesAlternative;
