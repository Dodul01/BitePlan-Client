/* eslint-disable @typescript-eslint/no-explicit-any */

export const registerUser = async (userData: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    const result = await res.json();

    // if (result.success) {
    //   (await cookies()).set("accessToken", result.data.accessToken);
    //   (await cookies()).set("refreshToken", result?.data?.refreshToken);
    // }
    console.log(result);

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
