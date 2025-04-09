/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Mail, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrderedMeal } from "@/services/Order";
import SectionHeading from "@/components/shared/SectionHeading";

const ViewOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  const getOrders = useCallback(async () => {
    try {
      const response = await getOrderedMeal();
      const result = response?.data?.allOrders || [];
      setOrders(result);
      setFilteredOrders(result);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = orders.filter((order) =>
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleDietaryFilter = (value: string) => {
    setDietaryFilter(value);
    if (value === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.orderedItemIds.some((item: any) =>
          item.dietaryInfo?.some(
            (diet: string) => diet.toLowerCase() === value.toLowerCase()
          )
        )
      );
      setFilteredOrders(filtered);
    }
  };

  console.log(orders);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white m-4 rounded-lg border shadow py-5">
          <SectionHeading
            title="Customer Orders & Preferences"
            subtitle="View detailed customer preferences and order history"
          />
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={dietaryFilter}
                  onValueChange={handleDietaryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Dietary Preferences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Preferences</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="low-carb">Low-carb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card
              key={order._id}
              className="overflow-hidden border rounded-xl shadow-sm"
            >
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {order.user.name}
                    </h3>

                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {order.user.email}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {order.user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      className={`capitalize ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Delivery Address:</span>{" "}
                    {order.user.deliveryAddress}
                  </p>
                </div>

                {/* Ordered Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Ordered Items
                  </h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.orderedItemIds.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-md"
                      >
                        <span className="text-sm">{item.meal.name}</span>
                        <span className="text-sm font-medium">
                          ${item.meal.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary Preferences */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Dietary Preferences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {order.orderedItemIds.map((item: any, index: number) =>
                      item.meal.dietaryInfo?.map(
                        (diet: string, dietIndex: number) => (
                          <Badge
                            key={`${index}-${dietIndex}`}
                            variant="secondary"
                          >
                            {diet}
                          </Badge>
                        )
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
