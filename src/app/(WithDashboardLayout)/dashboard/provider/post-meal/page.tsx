/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// export enum DietaryOptions {
//   Vegetarian = "Vegetarian",
//   Vegan = "Vegan",
//   GlutenFree = "Gluten-Free",
//   DairyFree = "Dairy-Free",
//   Keto = "Keto",
//   Paleo = "Paleo",
//   LowCarb = "Low Carb",
//   HighProtein = "High Protein",
// }

// export enum CuisineOptions {
//   American = "American",
//   Italian = "Italian",
//   Mexican = "Mexican",
//   Indian = "Indian",
//   Mediterranean = "Mediterranean",
//   Asian = "Asian",
//   Fusion = "Fusion",
//   Thai = "Thai",
// }

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addMeal } from "@/services/Meal";
import { getCurrentUser } from "@/services/AuthServices";
import { DietaryOptions, CuisineOptions } from "@/constants/meal-options";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME || "dbwrot7po";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "lkjadsflkjsdafkljasdf";

const handleCloudinaryUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
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
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

interface User {
  busisnessName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
const PostMealPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    prepTime: "",
    servings: 1,
    tags: "",
    dietaryInfo: "",
    cuisine: "",
    rating: 0,
    dietaryOptions: "",
    cuisineOptions: "",
    busisnessName: currentUser?.busisnessName || "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = form.image;

    if (file) {
      try {
        imageUrl = await handleCloudinaryUpload(file);
      } catch (error) {
        toast.error("Image upload failed, please try again.");
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      ...form,
      image: imageUrl,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      dietaryInfo: form.dietaryInfo
        .split(",")
        .map((info) => info.trim())
        .filter(Boolean),
      servings: Number(form.servings),
      rating: Number(form.rating),
      price: Number(form.price),
    };
    const res = await addMeal(payload);

    console.log(res);

    toast.success(res?.message);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Update form state with business name after user data is fetched
      setForm((prevForm) => ({
        ...prevForm,
        busisnessName: user?.busisnessName || "",
      }));
    };
    fetchUser();
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto bg-white p-8 shadow rounded-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Post Meal</h1>
            <p className="text-muted-foreground mt-2">
              Add your meal information which will be visible to customers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meal Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meal Name
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter meal name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <Textarea
                name="description"
                id="description"
                placeholder="Describe your meal"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price Field */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price
              </label>
              <Input
                type="number"
                name="price"
                id="price"
                placeholder="Enter price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Image
              </label>
              <Input
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {/* Preparation Time */}
            <div>
              <label
                htmlFor="prepTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preparation Time
              </label>
              <Input
                type="text"
                name="prepTime"
                id="prepTime"
                placeholder="e.g., 30 mins"
                value={form.prepTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Servings */}
            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Servings
              </label>
              <Input
                type="number"
                name="servings"
                id="servings"
                min="1"
                value={form.servings}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags (comma separated)
              </label>
              <Input
                type="text"
                name="tags"
                id="tags"
                placeholder="e.g., Italian, Pasta"
                value={form.tags}
                onChange={handleChange}
              />
            </div>

            {/* Dietary Information */}
            <div>
              <label
                htmlFor="dietaryInfo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dietary Information (comma separated)
              </label>
              <Input
                type="text"
                name="dietaryInfo"
                id="dietaryInfo"
                placeholder="e.g., Gluten-Free, Dairy-Free"
                value={form.dietaryInfo}
                onChange={handleChange}
              />
            </div>

            {/* Cuisine */}
            <div>
              <label
                htmlFor="cuisine"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cuisine
              </label>
              <select
                name="cuisine"
                id="cuisine"
                value={form.cuisine}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Cuisine</option>
                {Object.values(CuisineOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rating
              </label>
              <Input
                type="number"
                name="rating"
                id="rating"
                min="0"
                max="5"
                step="0.1"
                placeholder="Enter rating"
                value={form.rating}
                onChange={handleChange}
                required
              />
            </div>

            {/* Dietary Options */}
            <div>
              <label
                htmlFor="dietaryOptions"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dietary Options
              </label>
              <select
                name="dietaryOptions"
                id="dietaryOptions"
                value={form.dietaryOptions}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Dietary Option</option>
                {Object.values(DietaryOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Cuisine Options */}
            <div>
              <label
                htmlFor="cuisineOptions"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cuisine Options
              </label>
              <select
                name="cuisineOptions"
                id="cuisineOptions"
                value={form.cuisineOptions}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Cuisine Option</option>
                {Object.values(CuisineOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Posting Meal..." : "Post Meal"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostMealPage;
