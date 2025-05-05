// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import { getMeals } from "@/services/Meal";
// import { getCurrentUser } from "@/services/AuthServices";
// import { useCart } from "@/context/UserContext";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Clock3, User } from "lucide-react";
// import { toast } from "sonner";
// import SectionHeading from "./SectionHeading";

// export default function LimitedTimeOffers() {
//   const [meals, setMeals] = useState<any[]>([]);
//   const [timeLeft, setTimeLeft] = useState("");
//   const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
//   const [schedule, setSchedule] = useState("");
//   const [customization, setCustomization] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [user, setUser] = useState(null);
//   const { setCart } = useCart();

//   // Countdown Timer
//   useEffect(() => {
//     const updateCountdown = () => {
//       const now = new Date();
//       const nextMidnight = new Date();
//       nextMidnight.setHours(24, 0, 0, 0);
//       const diff = nextMidnight.getTime() - now.getTime();
//       const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
//       const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
//       const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
//       setTimeLeft(`${hours}:${minutes}:${seconds}`);
//     };

//     updateCountdown();
//     const interval = setInterval(updateCountdown, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch Meals and User
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getMeals();
//         const shuffled = response.data.sort(() => 0.5 - Math.random());
//         setMeals(shuffled.slice(0, 4));
//         const userData = await getCurrentUser();
//         if (userData) setUser(userData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = async () => {
//     if (!selectedMeal) return;
//     setIsSubmitting(true);

//     try {
//       const newMeal = {
//         meal: selectedMeal,
//         customization,
//         schedule,
//       };

//       if (user) {
//         setCart((prev: any[]) => [...prev, newMeal]);
//         toast.success("Order added to your cart");
//       } else {
//         toast.warning("Please sign in to order items.");
//       }

//       setSelectedMeal(null);
//       setCustomization("");
//       setSchedule("");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="bg-green-50 py-16 px-4">
//       <div className="text-center mb-10">
//         <SectionHeading
//           title="🔥 Limited Time Offers"
//           subtitle="Exclusive discounts on select meals — available for a short time only"
//         />
//         <p className="text-lg font-semibold text-gray-700">
//           Offers End In:{" "}
//           <span className="font-mono font-semibold text-green-600">{timeLeft} HR</span>
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto gap-6">
//         {meals.map((meal) => (
//           <Dialog
//             key={meal._id}
//             open={selectedMeal?._id === meal._id}
//             onOpenChange={(open) => !open && setSelectedMeal(null)}
//           >
//             <DialogTrigger asChild>
//               <div
//                 onClick={() => setSelectedMeal(meal)}
//                 className="cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
//               >
//                 <Image
//                   src={meal.image}
//                   alt={meal.name}
//                   width={400}
//                   height={250}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-5 space-y-2">
//                   <h3 className="text-lg font-semibold text-gray-800">{meal.name}</h3>
//                   <div className="flex items-center gap-2">
//                     <div className="text-sm text-gray-500 line-through">
//                       ${Number(meal.price + 10.01).toFixed(2)}
//                     </div>
//                     <div className="text-green-600 font-bold text-lg">
//                       ${meal.price.toFixed(2)}
//                     </div>
//                   </div>
//                   <div className="mt-2 space-y-1 text-sm text-gray-600">
//                     {meal.busisnessName && (
//                       <div className="flex items-center gap-1">
//                         <User className="w-4 h-4 text-green-500" />
//                         <span>Provider: {meal.busisnessName}</span>
//                       </div>
//                     )}
//                     {meal.prepTime && (
//                       <div className="flex items-center gap-1">
//                         <Clock3 className="w-4 h-4 text-green-500" />
//                         <span>Prep: {meal.prepTime}</span>
//                       </div>
//                     )}
//                   </div>
//                   <Button className="mt-4 w-full font-semibold rounded-full">Order Now</Button>
//                 </div>
//                 <Badge className="absolute top-2 right-2 bg-rose-500 text-white text-xs rounded-full px-3 py-1">
//                   🔥 Today Only
//                 </Badge>
//               </div>
//             </DialogTrigger>

//             <DialogContent className="p-4 max-w-md mx-auto">
//               <DialogTitle>{meal.name}</DialogTitle>
//               <div className="relative w-full h-40 overflow-hidden rounded-md mb-4">
//                 <Image
//                   src={meal.image}
//                   alt={meal.name}
//                   className="w-full h-full object-cover"
//                   height={500}
//                   width={500}
//                 />
//               </div>

//               <p className="text-sm bg-[#FFC400] text-black text-center rounded-lg">
//                 *IF YOU DON&apos;T NEED TO CUSTOMIZE YOUR MEAL, CLICK ON COMPLETE ORDER*
//               </p>
//               <p className="text-gray-600 text-sm mb-2">{meal.description}</p>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block mb-2 font-medium">Customization Requests</label>
//                   <Textarea
//                     placeholder="Any special requests or dietary needs..."
//                     value={customization}
//                     onChange={(e) => setCustomization(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-medium">Preferred Delivery Time</label>
//                   <Input
//                     type="datetime-local"
//                     value={schedule}
//                     onChange={(e) => setSchedule(e.target.value)}
//                     min={new Date().toISOString().slice(0, 16)}
//                   />
//                 </div>

//                 <Button
//                   onClick={handleSubmit}
//                   disabled={isSubmitting}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   {isSubmitting ? "Placing Order..." : "Complete Order"}
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         ))}
//       </div>
//     </section>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getMeals } from "@/services/Meal";
import { getCurrentUser } from "@/services/AuthServices";
import { useCart } from "@/context/UserContext";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock3, User } from "lucide-react";
import { toast } from "sonner";
import SectionHeading from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";

export default function LimitedTimeOffers() {
  const [meals, setMeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const [schedule, setSchedule] = useState("");
  const [customization, setCustomization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const { setCart } = useCart();

  // Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      const diff = nextMidnight.getTime() - now.getTime();
      const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Meals and User
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMeals();
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setMeals(shuffled.slice(0, 4));
        const userData = await getCurrentUser();
        if (userData) setUser(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
        setCart((prev: any[]) => [...prev, newMeal]);
        toast.success("Order added to your cart");
      } else {
        toast.warning("Please sign in to order items.");
      }

      setSelectedMeal(null);
      setCustomization("");
      setSchedule("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skeletons = Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3"
    >
      <Skeleton className="w-full h-48 rounded-md" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  ));

  return (
    <section className="bg-green-50 py-16 px-4">
      <div className="text-center mb-10">
        <SectionHeading
          title="🔥 Limited Time Offers"
          subtitle="Exclusive discounts on select meals — available for a short time only"
        />
        <p className="text-lg font-semibold text-gray-700">
          Offers End In:{" "}
          <span className="font-mono font-semibold text-green-600">
            {timeLeft} HR
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto gap-6">
        {isLoading
          ? skeletons
          : meals.map((meal) => (
              <Dialog
                key={meal._id}
                open={selectedMeal?._id === meal._id}
                onOpenChange={(open) => !open && setSelectedMeal(null)}
              >
                <DialogTrigger asChild>
                  <div
                    onClick={() => setSelectedMeal(meal)}
                    className="cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
                  >
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {meal.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500 line-through">
                          ${Number(meal.price + 10.01).toFixed(2)}
                        </div>
                        <div className="text-green-600 font-bold text-lg">
                          ${meal.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {meal.busisnessName && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-green-500" />
                            <span>Provider: {meal.busisnessName}</span>
                          </div>
                        )}
                        {meal.prepTime && (
                          <div className="flex items-center gap-1">
                            <Clock3 className="w-4 h-4 text-green-500" />
                            <span>Prep: {meal.prepTime}</span>
                          </div>
                        )}
                      </div>
                      <Button className="mt-4 w-full font-semibold rounded-full cursor-pointer">
                        Order Now
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-rose-500 text-white text-xs rounded-full px-3 py-1">
                      🔥 Today Only
                    </Badge>
                  </div>
                </DialogTrigger>

                <DialogContent className="p-4 max-w-md mx-auto">
                  <DialogTitle>{meal.name}</DialogTitle>
                  <div className="relative w-full h-40 overflow-hidden rounded-md mb-4">
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                      height={500}
                      width={500}
                    />
                  </div>

                  <p className="text-sm bg-[#FFC400] text-black text-center rounded-lg">
                    *IF YOU DON&apos;T NEED TO CUSTOMIZE YOUR MEAL, CLICK ON
                    COMPLETE ORDER*
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    {meal.description}
                  </p>

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
                      className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    >
                      {isSubmitting ? "Placing Order..." : "Complete Order"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
      </div>
    </section>
  );
}
