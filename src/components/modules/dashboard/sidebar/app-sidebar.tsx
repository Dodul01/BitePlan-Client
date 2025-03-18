"use client";

import {
  BoltIcon,
  Bot,
  ListOrdered,
  Settings,
  ShoppingCart,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/services/AuthServices";
import { useEffect, useState } from "react";

const data = {
  customarMenu: [
    {
      title: "Dashboard",
      url: "/dashboard/customar",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Food Cart",
      url: "/dashboard/customar/cart",
      icon: ShoppingCart,
    },
    {
      title: "Track Orders",
      url: "/dashboard/customar/track-order",
      icon: ListOrdered,
    },
    {
      title: "Manage Preferences",
      url: "/dashboard/customar/manage-preferences",
      icon: BoltIcon,
    },
    {
      title: "Profile",
      url: "/dashboard/profile/customar",
      icon: BoltIcon,
    },
  ],
  mealProviderMenu: [
    {
      title: "Dashboard",
      url: "/dashboard/provider",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "View Orders",
      url: "/dashboard/provider/view-orders",
      icon: Bot,
    },
    {
      title: "Respond to Orders",
      url: "/dashboard/provider/responses",
      icon: Settings,
    },
    {
      title: "Post Meal",
      url: "/dashboard/provider/post-meal",
      icon: Settings,
    },
    {
      title: "Profile",
      url: "/dashboard/profile/provider",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState("");

  const getUser = async () => {
    const user = await getCurrentUser();
    setRole(user?.role);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center">BP</div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <h2 className="font-bold text-xl">BitePlan</h2>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {role ? (
        <SidebarContent>
          <NavMain
            items={
              role === "customer" ? data.customarMenu : data.mealProviderMenu
            }
          />
        </SidebarContent>
      ) : (
        <div className="space-y-2 p-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
