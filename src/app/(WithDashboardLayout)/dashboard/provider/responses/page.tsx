/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PackageCheck, Truck, Clock, CircleX } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import SectionHeading from "@/components/shared/SectionHeading";
import { getOrderedMeal, updateOrder } from "@/services/Order";
import Image from "next/image";

const statusIcons = {
  processing: <Clock className="h-6 w-6 text-yellow-500" />,
  shipped: <Truck className="h-6 w-6 text-blue-500" />,
  delivered: <PackageCheck className="h-6 w-6 text-green-500" />,
  cancelled: <CircleX className="h-6 w-6 text-red-500" />,
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilteredOrders(
      value === "all"
        ? orders
        : orders.filter((order) => order.status === value)
    );
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsLoading(true);
    const updatedStatus = {
      status: newStatus,
    };
    const result = await updateOrder({ orderId, updatedStatus });

    if (result.status) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setFilteredOrders((prevFiltered) =>
        prevFiltered.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setIsLoading(false);
      toast.success(`Order ${newStatus} successfully.`);
    } else {
      setIsLoading(false);
      toast.error("Something went wrong.");
    }
  };

  const getOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getOrderedMeal();
      const orderData = response?.data?.allOrders || [];
      setOrders(orderData);
      setFilteredOrders(orderData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <div>
      <div className="bg-white m-4 rounded-lg border shadow py-5">
        <SectionHeading
          title="Order Management"
          subtitle="View and manage customer orders"
          decorative={true}
        />
      </div>
      {/* Tab */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card
              key={order._id}
              className="overflow-hidden shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {statusIcons[order.status as keyof typeof statusIcons]}
                    <span className="font-medium">{order.status}</span>
                  </div>
                  <span className="text-gray-600">{order.userEmail}</span>
                </div>
                <Separator className="my-3" />
                <div className="space-y-3">
                  {order.orderedItemIds.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={500}
                          height={500}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.busisnessName} - {item.cuisine}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Update Status:</p>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) =>
                      handleStatusChange(order._id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
