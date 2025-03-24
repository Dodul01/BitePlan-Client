/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "../AuthServices";

export const createMealPreference = async (payload: any) => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      throw new Error("User not authenticated!");
    }

    const token = (await cookies()).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/create-preference`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getMealPreference = async () => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      throw new Error("User not authenticated!");
    }

    const token = (await cookies()).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/get-preference/${user.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const updateMealPreference = async (payload: any) => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      throw new Error("User not authenticated!");
    }

    const token = (await cookies()).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/update-preference/${user.email}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fatching meal preference:", error);
    return new Error(error);
  }
};
