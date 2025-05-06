/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Loading from "@/components/shared/Loading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserFromDB } from "@/services/User";
import { getOrderedMeal } from "@/services/Order";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const orderChartData = orders.map((order) => {
    const total = order.orderedItemIds.reduce(
      (sum: number, item: any) => sum + item.meal.price,
      0
    );
    return {
      id: order._id.slice(-5),
      total,
    };
  });

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">
          Hello, {user?.name || "Customer"}
        </h1>
        <p className="mt-2 text-sm md:text-base">
          {user?.deliveryAddress || "No address on file"}
        </p>
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
                <p className="font-medium">Order #{orders[0]._id.slice(-5)}</p>
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

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Spending per Order</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderChartData}>
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#44C356" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => {
                const total = order.orderedItemIds.reduce(
                  (sum: number, item: any) => sum + item.meal.price,
                  0
                );
                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order._id.slice(-5)}
                    </TableCell>
                    <TableCell>{order.orderedItemIds.length}</TableCell>
                    <TableCell>${total.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link href={"/dashboard/provider/view-orders"}>
          <Button>View All Orders</Button>
        </Link>
      </div>
    </div>
  );
};

export default CustomerPage;
