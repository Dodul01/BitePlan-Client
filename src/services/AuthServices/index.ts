"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { cookies } from "next/headers";

export const registerUser = async (userData: any) => {
  try {
    const res = await fetch(`http://localhost:5000/api/users/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const signInUser = async (userData: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/sign-in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set("token", result?.data?.token);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
