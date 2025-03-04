"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

const CustomarPage = () => {
  const user = useUser();

  console.log(user);

  return <div>This is customar dashboard.</div>;
};

export default CustomarPage;
