"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "../ui/skeleton";
import { getCurrentUser } from "@/services/AuthServices";
import { useCart } from "@/context/UserContext";

interface NavItem {
  label: string;
  href?: string;
  subGroups?: {
    groupLabel: string;
    items: { label: string; href: string }[];
  }[];
}

interface User {
  role?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Browse Meals",
    href: "/find-meals",
    subGroups: [
      {
        groupLabel: "Dietary Preferences",
        items: [
          { label: "Vegetarian", href: "/find-meals?diet=Vegetarian" },
          { label: "Vegan", href: "/find-meals?diet=vegan" },
          { label: "Gluten-Free", href: "/find-meals?diet=gluten-free" },
          { label: "Dairy-Free", href: "/find-meals?diet=dairy-free" },
          { label: "Keto", href: "/find-meals?diet=keto" },
          { label: "Paleo", href: "/find-meals?diet=paleo" },
          { label: "Low Carb", href: "/find-meals?diet=low-carb" },
          { label: "High Protein", href: "/find-meals?diet=high-protein" },
        ],
      },
      {
        groupLabel: "Cuisine Types",
        items: [
          { label: "American", href: "/find-meals?cuisine=american" },
          { label: "Italian", href: "/find-meals?cuisine=italian" },
          { label: "Mexican", href: "/find-meals?cuisine=mexican" },
          { label: "Indian", href: "/find-meals?cuisine=indian" },
          {
            label: "Mediterranean",
            href: "/find-meals?cuisine=mediterranean",
          },
          { label: "Asian", href: "/find-meals?cuisine=asian" },
          { label: "Fusion", href: "/find-meals?cuisine=fusion" },
          { label: "Thai", href: "/find-meals?cuisine=thai" },
        ],
      },
    ],
  },
  {
    label: "Order Meal",
    href: "/order-meal",
  },
  // {
  //   label: "Vendors",
  //   href: "/vendors",
  // },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getuser = async () => {
    setIsLoading(true);
    const user = await getCurrentUser();
    if (user) {
      setUser(user);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full py-4",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight flex items-center gap-2"
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>MealBox</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.subGroups && setOpenDropdown(item.label)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href ?? "/"}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1",
                    isScrolled ? "text-foreground" : "text-foreground"
                  )}
                >
                  <span>{item.label}</span>
                  {item.subGroups && <ChevronDown className="h-4 w-4" />}
                </Link>

                {item.subGroups && openDropdown === item.label && (
                  <div className="absolute left-0 mt-1 w-[600px] bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-4 px-6 rounded-md grid grid-cols-2 gap-6 animate-fade-in">
                    {item.subGroups.map((group) => (
                      <div key={group.groupLabel}>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          {group.groupLabel}
                        </p>
                        {group.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block text-sm text-gray-700 hover:text-primary py-1"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <Skeleton className="w-32 h-8" />
            ) : user ? (
              <div className="flex gap-3">
                {/* cart */}
                {user.role === "customer" && (
                  <Link
                    className="cursor-pointer"
                    href={"/dashboard/customar/cart"}
                  >
                    <div className="relative inline-block">
                      <Button
                        variant="outline"
                        className="rounded-full cursor-pointer p-2"
                      >
                        <ShoppingCart className="h-6 w-6" />
                      </Button>
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                        {cart.length}
                      </span>
                    </div>
                  </Link>
                )}

                <Button
                  variant="default"
                  className="rounded-full text-sm px-5 py-2 transition-transform hover:scale-105"
                  asChild
                >
                  {user?.role === "customer" ? (
                    <Link href="/dashboard/customar">Dashboard</Link>
                  ) : (
                    <Link href="/dashboard/provider">Dashboard</Link>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  variant="default"
                  className="rounded-full text-sm px-5 py-2 transition-transform hover:scale-105"
                  asChild
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 h-screen bg-white flex justify-center items-center">
          <div className="w-full max-w-md h-full overflow-y-auto p-6 pb-20 animate-fade-in">
            <div className="space-y-2">
              {navItems.map((item) =>
                item.subGroups ? (
                  <Accordion
                    key={item.label}
                    type="single"
                    collapsible
                    className="border-b border-gray-100"
                  >
                    <AccordionItem value={item.label} className="border-none">
                      <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="space-y-2 pl-4">
                          {item.subGroups.map((group) =>
                            group.items.map((subItem) => (
                              <div
                                key={subItem.label}
                                className="py-2 border-b border-gray-50"
                              >
                                <Link
                                  href={subItem.href}
                                  className="flex items-center justify-between text-sm hover:text-primary"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </div>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <div
                    key={item.label}
                    className="border-b border-gray-100 py-3"
                  >
                    <Link
                      href={item.href ?? "/"}
                      className="flex items-center justify-between text-base font-medium hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="mt-8 space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </>
              ) : user ? (
                <Button
                  variant="default"
                  className="w-full justify-center text-base"
                  asChild
                >
                  <Link
                    href={
                      user?.role === "customer"
                        ? "/dashboard/customar"
                        : "/dashboard/provider"
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-base"
                    asChild
                  >
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    variant="default"
                    className="w-full justify-center text-base"
                    asChild
                  >
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
