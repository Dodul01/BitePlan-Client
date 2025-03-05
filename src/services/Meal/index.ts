"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const addMeal = async (payload: any): Promise<any> => {
  console.log(payload); //getting data perfectly

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/create-meal`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await cookies()).get("token")!.value}`,
      },
    });
    revalidateTag("meals");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
