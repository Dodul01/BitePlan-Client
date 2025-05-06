"use client";

import {
  BellRing,
  Cog,
  FolderCog,
  LayoutList,
  ListOrdered,
  MousePointerClick,
  NotebookPen,
  ShoppingCart,
  SquareTerminal,
  UserRoundCog,
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
// import { NavUser } from "./nav-user";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser, logout } from "@/services/AuthServices";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/UserContext";

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
      title: "Select Meals",
      url: "/dashboard/customar/select-meals",
      icon: MousePointerClick,
    },
    {
      title: "Track Orders",
      url: "/dashboard/customar/track-order",
      icon: ListOrdered,
    },
    {
      title: "Manage Preferences",
      url: "/dashboard/customar/manage-preferences",
      icon: Cog,
    },
    {
      title: "Profile",
      url: "/dashboard/profile/customar",
      icon: UserRoundCog,
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
      title: "Manage Menus",
      url: "/dashboard/provider/manage-menus",
      icon: FolderCog,
    },
    {
      title: "View Orders",
      url: "/dashboard/provider/view-orders",
      icon: LayoutList,
    },
    {
      title: "Respond to Orders",
      url: "/dashboard/provider/responses",
      icon: BellRing,
    },
    {
      title: "Post Meal",
      url: "/dashboard/provider/post-meal",
      icon: NotebookPen,
    },

    {
      title: "Profile",
      url: "/dashboard/profile/provider",
      icon: UserRoundCog,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState("");

  const { setCart } = useCart();

  const handleLogout = () => {
    setCart([]);
    logout();
  };

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
        <Button onClick={handleLogout} className="cursor-pointer">
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
