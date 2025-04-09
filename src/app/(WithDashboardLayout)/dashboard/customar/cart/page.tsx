/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/UserContext";
import { getCurrentUser } from "@/services/AuthServices";
import { orderMeal } from "@/services/Order";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface User {
  deliveryAddress?: string;
}

const CartPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { cart } = useCart();
  const router = useRouter();

  // const totalPrice = cart.reduce(
  //   (sum: number, item: any) => sum + Number(item.price),
  //   0
  // );

  const totalPrice = cart.reduce((sum: number, item: any) => {
    // (??) Nullish Coalescing Operator

    // If item.meal.price exists, use it.
    // Else if item.price exists, use it.
    // Else, fallback to 0.
    const price = item?.meal?.price ?? item?.price ?? 0;

    return sum + Number(price);
  }, 0);
  console.log(cart);
  
  const handleCheckout = async () => {
    const orderedItemId = cart.map((i: any) => i._id);
    // const res = await orderMeal(orderedItemId);
    // console.log(res);
    // router.push('/checkout')
    // console.log(orderedItemId);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  return (
    <div>
      <div className="bg-white m-4 rounded-lg border border-white shadow py-5">
        <SectionHeading
          title="Food Cart"
          subtitle="All the food you can imagine is available here."
          decorative={true}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 mx-4">
        <div className="md:w-2/3 space-y-4">
          {cart.length > 0 ? (
            // cart.map((item: any, idx: number) => (
            //   <div
            //     key={idx}
            //     className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden"
            //   >
            //     <div className="relative h-40 w-full md:w-1/3">
            //       <Image
            //         src={item.image}
            //         alt={`${item.name} Image`}
            //         layout="fill"
            //         objectFit="cover"
            //       />
            //     </div>
            //     <div className="p-4 flex flex-col justify-between flex-grow">
            //       <div>
            //         <h2 className="text-xl font-semibold">{item.name}</h2>
            //         <p className="text-lg font-bold text-green-600 mt-1"></p>
            //         <div className="mt-2 flex flex-wrap gap-2">
            //           {item.tags.map((tag: any, index: number) => (
            //             <Badge
            //               key={index}
            //               className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
            //             >
            //               {tag}
            //             </Badge>
            //           ))}
            //         </div>
            //         <p className="mt-2 text-sm text-gray-500">
            //           Servings: {item.servings}
            //         </p>
            //       </div>
            //     </div>
            //   </div>
            // ))
            cart.map((item: any, idx: number) => {
              // If item has `meal` field, it's a scheduled meal with customization
              const meal = item.meal || item; // fallback to item itself if no nested meal

              return (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <div className="relative h-40 w-full md:w-1/3">
                    <Image
                      src={meal.image}
                      alt={`${meal.name} Image`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-xl font-semibold">{meal.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {meal.description}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {meal.tags?.map((tag: any, index: number) => (
                          <Badge
                            key={index}
                            className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        Servings: {meal.servings}
                      </p>

                      {/* Conditionally show customization if present */}
                      {item.customization && (
                        <p className="text-sm text-blue-500 mt-1">
                          Customization: {item.customization}
                        </p>
                      )}

                      {/* Conditionally show schedule if present */}
                      {item.schedule && (
                        <p className="text-sm text-purple-500 mt-1">
                          Scheduled For:{" "}
                          {new Date(item.schedule).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>
        {/* details */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col space-y-6 sticky">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Delivery Address</h2>
            <p className="text-gray-600">
              {currentUser?.deliveryAddress || "No address provided"}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Total Price</span>
              <span className="text-xl font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <Link href={"/dashboard/customar/checkout"}>
            <Button
              // onClick={() => handleCheckout()}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Check Out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
