/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMeals } from "@/services/Meal";
import Image from "next/image";
import { Clock3, Star, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/UserContext";
import Link from "next/link";
import Loading from "@/components/shared/Loading";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/services/AuthServices";

interface Meal {
  _id: string;
  name: string;
  description: string;
  image: string | string[];
  price: number;
  rating?: number;
  busisnessName?: string;
  servings: number;
  prepTime: string;
  dietaryInfo?: string[];
  tags?: string[];
}

export default function MealDetailsPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [suggested, setSuggested] = useState<Meal[]>([]);
  const { setCart } = useCart();
  const [user, setUser] = useState();
  const [open, setOpen] = useState(false);
  const [customization, setCustomization] = useState("");
  const [schedule, setSchedule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      const res = await getMeals();
      const allMeals = res.data;
      const found = allMeals.find((item: Meal) => item._id === id);
      const randomSuggested = allMeals
        .filter((item: Meal) => item._id !== id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      setMeal(found);
      setSuggested(randomSuggested);
    };

    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) setUser(user);
    };

    fetchUser();

    fetchMeal();
  }, [id]);

  // const handleSubmit = () => {
  //   if (!meal) return;
  //   setIsSubmitting(true);
  //   setCart((prev: any[]) => [
  //     ...prev,
  //     {
  //       meal,
  //       customization,
  //       schedule,
  //     },
  //   ]);
  //   setOpen(false);
  //   setCustomization("");
  //   setSchedule("");
  //   toast.success("Meal added to cart");
  //   setIsSubmitting(false);
  // };

  const handleSubmit = async () => {
    if (!meal) return;
    setIsSubmitting(true);

    try {
      const newMeal = {
        meal,
        customization,
        schedule,
      };

      if (user) {
        setCart((prev: any) => [...prev, newMeal]);
        toast.success("Order added to your cart");
      } else {
        toast.warning("Please sign in to order items.");
      }

      setCustomization("");
      setSchedule("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!meal) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-16">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={Array.isArray(meal.image) ? meal.image[0] : meal.image}
            alt={meal.name}
            width={600}
            height={400}
            className="rounded-xl object-cover w-full h-96"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{meal.name}</h1>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4" />
              <span>{meal.prepTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersRound className="w-4 h-4" />
              <span>{meal.servings} servings</span>
            </div>
          </div>

          {meal.busisnessName && (
            <p className="text-sm text-gray-500">
              Provided by{" "}
              <span className="font-medium">{meal.busisnessName}</span>
            </p>
          )}

          <p className="text-gray-700 text-sm leading-relaxed">
            {meal.description}
          </p>

          {/* Dietary Info Tags */}
          {Array.isArray(meal.dietaryInfo) && meal.dietaryInfo.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meal.dietaryInfo.map((info: string, index: number) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium"
                >
                  {info}
                </span>
              ))}
            </div>
          )}

          {/* General Tags */}
          {Array.isArray(meal.tags) && meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meal.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2">
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
              {typeof meal.rating === "number" ? meal.rating.toFixed(1) : "No"}{" "}
              rating
            </span>
          </div>

          {/* Price & CTA */}
          <div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${meal.price.toFixed(2)}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Add to Cart</Button>
              </DialogTrigger>

              <DialogContent className="max-w-md mx-auto p-4">
                <DialogTitle>Customize Your Meal</DialogTitle>

                <p className="text-sm text-muted-foreground">
                  Add any custom instructions or choose a delivery time.
                </p>
                <p className="text-sm bg-[#FFC400] text-black rounded-lg text-center">
                  *IF YOU DON&apos;T NEED TO CUSTOMIZE YOUR MEAL, CLICK ON
                  COMPLETE ORDER*
                </p>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Customization requests..."
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                  />
                  <Input
                    type="datetime-local"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white"
                  >
                    {isSubmitting ? "Adding..." : "Complete Order"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Suggested Section */}
      <div className="mt-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">You may also like</h2>
          <Link href="/find-meals">
            <Button variant="outline" className="w-full sm:w-auto">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {suggested.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 hover:shadow-lg transition bg-white flex flex-col justify-between"
            >
              <Image
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
                width={400}
                height={250}
                className="rounded-lg object-cover h-40 w-full mb-4"
              />

              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>

                {item.busisnessName && (
                  <p className="text-sm text-gray-500">
                    Provided by{" "}
                    <span className="font-medium">{item.busisnessName}</span>
                  </p>
                )}

                {Array.isArray(item.dietaryInfo) &&
                  item.dietaryInfo.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.dietaryInfo.map((info: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium"
                        >
                          {info}
                        </span>
                      ))}
                    </div>
                  )}

                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(item.rating ?? 0)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {typeof item.rating === "number"
                      ? item.rating.toFixed(1)
                      : "No"}{" "}
                    rating
                  </span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="mt-4">
                <p className="text-green-600 font-bold text-lg mb-2">
                  ${item.price.toFixed(2)}
                </p>
                <Link href={`/find-meals/${item._id}`}>
                  <Button className="w-full cursor-pointer" variant="outline">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
