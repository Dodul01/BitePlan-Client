/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
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
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Card key={order._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-semibold">{order.userEmail}</h3>
                    <p className="text-sm text-muted-foreground">
                      Order Status: {order.status}
                    </p>
                    <p className="text-sm mt-1">
                      Order Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Ordered Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.orderedItemIds.map((item: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {item.name} - ${item.price.toFixed(2)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Dietary Info */}
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Dietary Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.orderedItemIds.map((item: any, index: number) =>
                      item.dietaryInfo?.map(
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
