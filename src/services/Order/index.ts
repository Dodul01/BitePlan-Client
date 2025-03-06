/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const orderMeal = async (payload: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order-meal`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await cookies()}`,
      },
    });
    revalidateTag("meals");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
