/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "../AuthServices";

export const getUserFromDB = async () => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email) {
      throw new Error("User not authenticated!");
    }

    const token = (await cookies()).get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/get-user/${user.email}`,
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
