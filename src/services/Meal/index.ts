"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "../AuthServices";

export const addMeal = async (payload: any): Promise<any> => {
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

export const getMeals = async (): Promise<any> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/meals`, {
      method: "GET",
    });
    revalidateTag("meals");
    return res.json();
  } catch (err: any) {
    return Error(err);
  }
};

export const updateMenuMeal = async (mealId: string, updatedMeal: any) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      throw new Error("user not authenticated!");
    }

    const token = (await cookies()).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/update-meal/${mealId}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedMeal),
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating meal:", error);
    return new Error(error);
  }
};
