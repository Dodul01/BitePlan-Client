/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "../AuthServices";

export const orderMeal = async (payload: any) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order-meal`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    revalidateTag("meals");
    return res.json();
  } catch (error: any) {
    return new Error(error);
  }
};

export const getOrderedMeal = async () => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      throw new Error("User not authenticated!");
    }

    const token = (await cookies()).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/get-orders/${user.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fatching ordered meals:", error);
    return new Error(error);
  }
};

export const updateOrder = async (payload: any) => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      throw new Error("User not authenticated!");
    }

    const token = (await cookies()).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order-status/${payload.orderId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload.updatedStatus),
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const data = await res.json();
    return data
  } catch (error: any) {
    console.error("Error fatching ordered meals:", error);
    return new Error(error);
  }
};
