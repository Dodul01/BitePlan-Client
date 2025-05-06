/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { getUserFromDB } from "@/services/User";
// import { getOrderedMeal } from "@/services/Order";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Loading from "@/components/shared/Loading";
// import Link from "next/link";

// const CustomerPage = () => {
//   const [user, setUser] = useState<any>(null);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [userRes, ordersRes] = await Promise.all([
//         getUserFromDB(),
//         getOrderedMeal(),
//       ]);

//       if (userRes?.success && userRes.result) {
//         setUser(userRes.result);
//       }
//       setOrders(ordersRes?.data?.allOrders || []);
//     } catch (error) {
//       console.error("Error loading dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header Banner */}
//       <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 rounded-lg shadow-lg">
//         <h1 className="text-2xl md:text-3xl font-bold">
//           Hello, {user?.name || "Customer"}
//         </h1>
//         <p className="mt-2 text-sm md:text-base">
//           {user?.deliveryAddress || "No address on file"}
//         </p>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid gap-6 md:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Orders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-3xl font-semibold">{orders.length}</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Contact Info</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-1">
//             <p>{user?.email}</p>
//             <p>{user?.phone}</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Last Order</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {orders.length ? (
//               <div className="space-y-1">
//                 <p className="font-medium">Order #{orders[0]._id}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {new Date(orders[0].createdAt).toLocaleDateString()}
//                 </p>
//                 <p className="capitalize">{orders[0].status}</p>
//               </div>
//             ) : (
//               <p>No orders yet</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Orders List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Orders</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {orders.length ? (
//             orders.slice(0, 5).map((order) => (
//               <div
//                 key={order._id}
//                 className="flex justify-between items-center"
//               >
//                 <div className="space-y-0.5">
//                   <p className="font-medium">Order #{order._id}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No orders found.</p>
//           )}
//         </CardContent>
//       </Card>

//       {/* View All Orders Button */}
//       <div className="flex justify-end">
//         <Link href={"customar/select-meals"}>
//           <Button>View On Going Orders</Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default CustomerPage;
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getUserFromDB } from "@/services/User";
import { getOrderedMeal } from "@/services/Order";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

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

  const calculateOrderTotal = (order: any) => {
    return order.orderedItemIds.reduce(
      (sum: number, item: any) => sum + (item?.meal?.price || 0),
      0
    );
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = {
    labels: orders
      .map((order) => new Date(order.createdAt).toLocaleDateString())
      .reverse(),
    datasets: [
      {
        label: "Order Amount",
        data: orders.map((order) => calculateOrderTotal(order)).reverse(),
        borderColor: "#44C356",
        backgroundColor: "rgba(68, 195, 86, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">
          Hello, {user?.name || "Customer"}
        </h1>
        <p className="mt-2 text-sm md:text-base">
          {user?.deliveryAddress || "No address on file"}
        </p>
      </div>

      {/* Summary */}
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
                <p className="font-medium">#{orders[0]._id.slice(-6)}</p>
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
          <CardTitle>Order Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {orders.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>#{order._id.slice(-6)}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell>
                      ${calculateOrderTotal(order).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground p-4">
              No recent orders found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex justify-end">
        <Link href="/dashboard/customar/track-order">
          <Button>View Ongoing Orders</Button>
        </Link>
      </div>
    </div>
  );
};

export default CustomerPage;
