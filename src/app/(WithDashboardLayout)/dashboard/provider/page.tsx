/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Loading from "@/components/shared/Loading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserFromDB } from "@/services/User";
import { getOrderedMeal } from "@/services/Order";
import Link from "next/link";

const CustomerPage = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, ordersRes] = await Promise.all([
        getUserFromDB(),
        getOrderedMeal(),
      ]);

      if (userRes?.success && userRes.result) {
        setUser(userRes.result);
      }
      setOrders(ordersRes?.data?.allOrders || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">
          Hello, {user?.name || "Provider"}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{orders.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>{user?.email}</p>
            <p>{user?.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Order</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length ? (
              <div className="space-y-1">
                <p className="font-medium">Order #{orders[0]._id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(orders[0].createdAt).toLocaleDateString()}
                </p>
                <p className="capitalize">{orders[0].status}</p>
              </div>
            ) : (
              <p>No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length ? (
            orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center"
              >
                <div className="space-y-0.5">
                  <p className="font-medium">Order #{order._id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </CardContent>
      </Card>
      {/* View All Orders Button */}

      <div className="flex justify-end">
        <Link href={"/dashboard/provider/view-orders"}>
          <Button>View all orders</Button>
        </Link>
      </div>
    </div>
  );
};

export default CustomerPage;
