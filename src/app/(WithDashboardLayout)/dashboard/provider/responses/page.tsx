/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PackageCheck, Truck, Clock, CircleX } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      // console.log(orderData);
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
              className="overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6 space-y-6">
                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    {statusIcons[order.status as keyof typeof statusIcons]}
                    <Badge
                      className={`capitalize ${
                        order.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {order.userEmail}
                  </span>
                </div>

                <Separator />

                {/* Ordered Items */}
                <div className="space-y-4">
                  {order.orderedItemIds.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row justify-between gap-4"
                    >
                      <div className="flex gap-4">
                        <Image
                          src={item.meal?.image}
                          alt={item.meal?.name}
                          width={500}
                          height={500}
                          className="h-40 w-40 rounded-md object-cover"
                        />
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">
                            {item.meal?.name}
                          </p>
                          <div className="text-sm text-gray-500 space-y-0.5">
                            <p>
                              <span className="font-medium text-gray-700">
                                Customer Name:
                              </span>{" "}
                              {order.user?.name || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium text-gray-700">
                                Customer Email:
                              </span>{" "}
                              {order.user?.email || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium text-gray-700">
                                Customer Phone:
                              </span>{" "}
                              {order.user?.phone || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium text-gray-700">
                                Delivery Address:
                              </span>{" "}
                              {order.user?.deliveryAddress || "N/A"}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <p>Customization: {item.customization || "None"}</p>
                            <p>
                              Schedule:{" "}
                              {new Date(item.schedule).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.meal?.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Status Update */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <p className="text-sm font-medium text-gray-800">
                    Update Status:
                  </p>
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
