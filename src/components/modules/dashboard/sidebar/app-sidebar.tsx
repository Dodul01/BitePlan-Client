"use client";

import { Bot, Settings, SquareTerminal } from "lucide-react";

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
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

const data = {
  customarMenu: [
    {
      title: "Dashboard",
      url: "/dashboard/customar",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Track Orders",
      url: "/dashboard/customar/track-order",
      icon: Bot,
    },
    {
      title: "Manage Preferences",
      url: "/dashboard/customar/manage-preferences",
      icon: Settings,
    },
    {
      title: "Profile",
      url: "/dashboard/profile/customar",
      icon: Settings,
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
      url: "/dashboard/provider/all-orders",
      icon: Bot,
    },
    {
      title: "Respond to Orders",
      url: "/dashboard/provider/response",
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
  const user = useUser();
  const role = user?.user?.role;

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
