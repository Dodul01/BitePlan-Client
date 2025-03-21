/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";

import {
  PackageCheck,
  PackageOpen,
  Truck,
  Clock,
  Search,
  ChevronRight,
  CircleX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import { getOrderedMeal } from "@/services/Order";

const statusIcons = {
  processing: <Clock className="h-6 w-6 text-yellow-500" />, 
  shipped: <Truck className="h-6 w-6 text-blue-500" />, 
  delivered: <PackageCheck className="h-6 w-6 text-green-500" />, 
  cancelled: <CircleX className="h-6 w-6 text-red-500"/>
};

const OrderTracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState<'processing' | 'shipped' | 'delivered' | 'cancelled'>('processing')

  const getOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getOrderedMeal();
      setOrders(response.data.allOrders[0].orderedItemIds);
      setFilteredOrders(response.data.allOrders[0].orderedItemIds);
      setStatus(response.data.allOrders[0].status);
      console.log(response.data.allOrders);
      
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = orders.filter(
      (order) =>
        order.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
    if (filtered.length === 0) {
      toast("No Order Found!");
    }
  };

  return (
    <div>
      <div className="bg-white m-4 rounded-lg border shadow py-5">
        <SectionHeading
          title="Track Your Orders"
          subtitle="View and track your current and past meal deliveries"
          decorative={true}
        />
      </div>

      <div className="space-y-6">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by meal name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order._id} className="overflow-hidden hover:shadow-md">
                <CardContent className="p-0">
                  <div className="bg-muted/30 p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        {statusIcons[`${status}`]}
                        <span className="font-medium">{status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Order {order._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4">
                    <p className="font-medium">{order.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {order.servings}</p>
                  </div>

                  <Separator />

                  <div className="p-4 flex justify-between items-center">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      Order Details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8">
              <PackageOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "You haven't placed any orders yet"}
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
              ) : (
                <Button variant="default" asChild>
                  <Link href="/find-meals">Browse Meals</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;