/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/shared/SectionHeading";
import { toast } from "sonner";
import { addMeal, getMeals, updateMenuMeal } from "@/services/Meal";
import { getCurrentUser } from "@/services/AuthServices";
import Image from "next/image";
import { Label } from "@/components/ui/label";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME || "dbwrot7po";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "lkjadsflkjsdafkljasdf";

const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo"];
const cuisineOptions = ["Italian", "Chinese", "Indian", "Mexican", "Thai"];

const handleCloudinaryUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Image upload failed");

  const data = await response.json();
  return data.secure_url;
};

const ManageMenusPage = () => {
  const [meals, setMeals] = useState<Array<any>>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    busisnessName?: string;
  } | null>(null);

  const [createMeal, setCreateMeal] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    prepTime: "",
    servings: "",
    tags: "",
    dietaryInfo: "",
    cuisine: "",
    rating: "",
    dietaryOptions: "",
    cuisineOptions: "",
    busisnessName: "",
  });

  const [updateMeal, setUpdateMeal] = useState({
    name: "Spaghetti Carbonara",
    description: "A creamy pasta with bacon and cheese",
    price: "12.99",
    prepTime: "25 mins",
    servings: "2",
    tags: "Italian, Pasta",
    dietaryInfo: "Gluten-Free",
    cuisine: "Italian",
    rating: "4.5",
    dietaryOptions: "Gluten-Free",
    cuisineOptions: "Italian",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    isUpdate = false
  ) => {
    const { name, value } = e.target;
    if (isUpdate) {
      setUpdateMeal((prev) => ({ ...prev, [name]: value }));
    } else {
      setCreateMeal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isUpdate = false) => {
    e.preventDefault();
    const data = isUpdate ? updateMeal : createMeal;

    if (isUpdate) {
      console.log("Updated Meal:", data);
      return;
    }

    setIsLoading(true);
    let imageUrl = createMeal.image;

    try {
      if (file) {
        imageUrl = await handleCloudinaryUpload(file);
      }

      const payload = {
        ...createMeal,
        image: imageUrl,
        servings: Number(createMeal.servings),
        rating: Number(createMeal.rating),
        price: Number(createMeal.price),
        tags: createMeal.tags.split(",").map((tag) => tag.trim()),
        dietaryInfo: createMeal.dietaryInfo
          .split(",")
          .map((info) => info.trim()),
        busisnessName: currentUser?.busisnessName || "",
      };

      const res = await addMeal(payload);
      toast.success(res?.message || "Meal created successfully!");
      setCreateMeal((prev) => ({ ...prev, image: "" }));
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload image or create meal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    mealId: string
  ) => {
    console.log(mealId);

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedMeal = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      prepTime: formData.get("prepTime") as string,
      servings: Number(formData.get("servings")),
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim()),
      dietaryInfo: (formData.get("dietaryInfo") as string)
        .split(",")
        .map((info) => info.trim()),
      cuisine: formData.get("cuisine") as string,
      rating: Number(formData.get("rating")),
      dietaryOptions: formData.get("dietaryOptions") as string,
      cuisineOptions: formData.get("cuisineOptions") as string,
    };

    try {
      const res = await updateMenuMeal(mealId, updatedMeal);
      toast.success(res?.message || "Meal updated successfully.");
      console.log(res);

      // Refresh meal list
      const refreshedMeals = await getMeals();
      const userMeals = refreshedMeals.data.filter(
        (meal: any) => meal.busisnessName === currentUser?.busisnessName
      );
      setMeals(userMeals);
    } catch (err) {
      console.error("Error updating meal:", err);
      toast.error("Failed to update meal");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setCreateMeal((prev) => ({
        ...prev,
        busisnessName: user?.busisnessName || "",
      }));
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      // wait until the user is loaded
      if (!currentUser?.busisnessName) return;

      try {
        const response = await getMeals();
        const allMeals = response.data;

        // Filter meals for the current user's business
        const userMeals = allMeals.filter(
          (meal: any) => meal.busisnessName === currentUser.busisnessName
        );

        setMeals(userMeals);
        console.log(userMeals);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, [currentUser?.busisnessName]);

  return (
    <div className="p-6">
      <div className="bg-white m-4 rounded-lg border shadow py-5">
        <SectionHeading
          title="Manage Menus"
          subtitle="Create and update meals for your personalized meal service"
        />
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="create" className="w-full">
            Create Meal
          </TabsTrigger>
          <TabsTrigger value="update" className="w-full">
            Update Meal
          </TabsTrigger>
        </TabsList>

        {/* CREATE MEAL */}
        <TabsContent value="create">
          <form
            onSubmit={(e) => handleSubmit(e, false)}
            className="space-y-5 bg-white p-8 shadow rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Create Meal</h2>
            <Input
              name="name"
              value={createMeal.name}
              onChange={handleChange}
              placeholder="Meal Name"
            />
            <Textarea
              name="description"
              value={createMeal.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <Input
              name="price"
              type="number"
              value={createMeal.price}
              onChange={handleChange}
              placeholder="Price"
            />
            <Input
              name="prepTime"
              value={createMeal.prepTime}
              onChange={handleChange}
              placeholder="Preparation Time"
            />
            <Input
              name="servings"
              type="number"
              value={createMeal.servings}
              onChange={handleChange}
              placeholder="Servings"
            />
            <Input
              name="tags"
              value={createMeal.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
            />
            <Input
              name="dietaryInfo"
              value={createMeal.dietaryInfo}
              onChange={handleChange}
              placeholder="Dietary Info (comma separated)"
            />
            <select
              name="cuisine"
              value={createMeal.cuisine}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Cuisine</option>
              {cuisineOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Input
              name="rating"
              type="number"
              value={createMeal.rating}
              onChange={handleChange}
              placeholder="Rating"
              step="0.1"
              min="0"
              max="5"
            />
            <select
              name="dietaryOptions"
              value={createMeal.dietaryOptions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Dietary Option</option>
              {dietaryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select
              name="cuisineOptions"
              value={createMeal.cuisineOptions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Cuisine Option</option>
              {cuisineOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <Input type="file" onChange={handleFileChange} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Create Meal"}
            </Button>
          </form>
        </TabsContent>

        {/* UPDATE MEAL */}
        <TabsContent value="update">
          <div className="bg-white p-8 shadow rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Update Meals</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <div key={meal._id} className="border rounded-lg p-4 shadow-sm">
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    height={500}
                    width={500}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold">{meal.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {meal.description}
                  </p>
                  <p className="text-sm">Price: ${meal.price}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4 flex gap-2 items-center cursor-pointer">
                        <Pencil className="w-4 h-4" /> Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Update Meal</DialogTitle>
                      </DialogHeader>

                      <form
                        onSubmit={(e) => handleUpdateSubmit(e, meal._id)}
                        className="space-y-4"
                      >
                        {/* Meal Image - Reduced height */}
                        <Image
                          src={meal.image}
                          alt={meal.name}
                          height={300}
                          width={500}
                          className="w-full h-28 object-cover rounded"
                        />

                        {/* Name & Description */}
                        <div className="space-y-1">
                          <Label htmlFor="name">Meal Name</Label>
                          <Input
                            name="name"
                            defaultValue={meal.name}
                            className="h-9"
                          />

                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            name="description"
                            defaultValue={meal.description}
                            className="min-h-[80px]"
                          />
                        </div>

                        {/* Grid Inputs (Compact) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                              name="price"
                              type="number"
                              defaultValue={meal.price}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="prepTime">Prep Time</Label>
                            <Input
                              name="prepTime"
                              defaultValue={meal.prepTime}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="servings">Servings</Label>
                            <Input
                              name="servings"
                              defaultValue={meal.servings}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                              name="tags"
                              defaultValue={meal.tags.join(", ")}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="dietaryInfo">Dietary Info</Label>
                            <Input
                              name="dietaryInfo"
                              defaultValue={meal.dietaryInfo.join(", ")}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="cuisine">Cuisine</Label>
                            <Input
                              name="cuisine"
                              defaultValue={meal.cuisine}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                              name="rating"
                              type="number"
                              defaultValue={meal.rating}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="dietaryOptions">
                              Dietary Options
                            </Label>
                            <Input
                              name="dietaryOptions"
                              defaultValue={meal.dietaryOptions}
                              className="h-9"
                            />
                          </div>

                          <div>
                            <Label htmlFor="cuisineOptions">
                              Cuisine Options
                            </Label>
                            <Input
                              name="cuisineOptions"
                              defaultValue={meal.cuisineOptions}
                              className="h-9"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <DialogFooter className="pt-3">
                          <Button
                            type="submit"
                            className="w-full md:w-auto h-9 text-sm"
                          >
                            Update Meal
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageMenusPage;
