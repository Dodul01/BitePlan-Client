/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const orderMeal = async (payload: any) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order-meal`, {
      method: "POST",
      body: JSON.stringify({ orderedItemIds: payload }),
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
