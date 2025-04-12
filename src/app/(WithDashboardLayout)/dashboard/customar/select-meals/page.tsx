"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getMeals } from "@/services/Meal";
import { getOrderedMeal, updateOrder } from "@/services/Order";
import SectionHeading from "@/components/shared/SectionHeading";
import Image from "next/image";
import { Clock3, UsersRound, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import emptyBox from "../../../../../../public/Empty-cuate.png";
import { toast } from "sonner";

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  prepTime: string;
  servings: number;
  dietaryInfo: string[];
  tags: string[];
  busisnessName: string;
}

interface CustomOrder {
  _id: string;
  meal: Meal;
  customization: string;
  schedule: string;
  status: string;
  userEmail: string;
  orderedItemIds: {
    meal: Meal;
    customization: string;
    schedule: string;
  }[];
}

const SelectMealsPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"meals" | "orders">("orders");

  const [editingOrder, setEditingOrder] = useState<{
    orderId: string;
    customization: string;
    schedule: string;
    itemIndex: number;
  } | null>(null);

  const getOrders = useCallback(async () => {
    try {
      const response = await getOrderedMeal();
      const orderData = response?.data?.allOrders || [];
      const filtered = orderData.filter(
        (o: CustomOrder) => o.status === "processing"
      );
      setOrders(filtered);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await getMeals();
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    const { orderId, customization, schedule, itemIndex } = editingOrder;

    const orderToUpdate = orders.find((o) => o._id === orderId);
    if (!orderToUpdate) return;

    const updatedItems = [...orderToUpdate.orderedItemIds];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      customization,
      schedule,
    };

    const updatedOrder = {
      orderedItemIds: updatedItems,
    };

    const result = await updateOrder({
      orderId,
      updatedStatus: updatedOrder,
    });

    console.log(result);

    if (result.status) {
      toast.success("Order updated succesfully.");

      const newOrders = orders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              orderedItemIds: updatedItems,
            }
          : order
      );

      setOrders(newOrders);
      setEditingOrder(null);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white m-4 rounded-lg border shadow py-5">
        <SectionHeading
          title="Select Your Meal"
          subtitle="Explore personalized meal options tailored to your preferences."
        />
      </div>

      <div className="flex gap-4 mb-6 px-4">
        <button
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === "orders"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === "meals"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("meals")}
        >
          Meals
        </button>
      </div>

      {activeTab === "meals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {meals.map((meal) => (
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
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {meal.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Provider: {meal.busisnessName}
                </p>
                <p className="text-sm text-gray-700 mb-3">{meal.description}</p>
                <div className="flex items-center justify-between text-gray-600 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Clock3 /> {meal.prepTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersRound />
                    <span className="font-medium">{meal.servings}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {meal?.dietaryInfo?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag, index) => (
                    <Badge variant="outline" key={index}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="px-4">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <Card key={index} className="overflow-hidden shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{order.status}</span>
                      {/* <span className="text-gray-600">{order.userEmail}</span> */}
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-3">
                      {order.orderedItemIds.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.meal.image}
                              alt={item.meal.name}
                              width={500}
                              height={500}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium">{item.meal.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.meal.busisnessName || "No Business Name"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Customization: {item.customization || "None"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Schedule:{" "}
                                {new Date(item.schedule).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="text-sm font-medium">
                              ${item.meal.price?.toFixed(2)}
                            </p>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Pencil
                                  className="w-4 h-4 text-gray-600 cursor-pointer"
                                  onClick={() =>
                                    setEditingOrder({
                                      orderId: order._id,
                                      customization: item.customization,
                                      schedule: item.schedule,
                                      itemIndex,
                                    })
                                  }
                                />
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Order Info</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Input
                                    placeholder="Customization"
                                    value={editingOrder?.customization || ""}
                                    onChange={(e) =>
                                      setEditingOrder((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              customization: e.target.value,
                                            }
                                          : null
                                      )
                                    }
                                  />
                                  <Input
                                    type="datetime-local"
                                    value={editingOrder?.schedule || ""}
                                    onChange={(e) =>
                                      setEditingOrder((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              schedule: e.target.value,
                                            }
                                          : null
                                      )
                                    }
                                  />
                                  <button
                                    onClick={handleUpdateOrder}
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                                  >
                                    Update Order
                                  </button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col">
              <Image
                className="h-70 w-full object-contain"
                src={emptyBox}
                height={500}
                width={500}
                alt="empty box"
              />
              <p className="text-gray-400">
                No processing orders yet. Add meals to your order later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectMealsPage;
