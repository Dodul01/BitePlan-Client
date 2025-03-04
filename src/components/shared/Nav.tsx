"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, ShoppingBag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { useUser } from "@/context/UserContext";
import { Skeleton } from "../ui/skeleton";
// import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/services/AuthServices";

interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

interface User {
  role?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Meal Plans",
    href: "/meal-plans",
    subItems: [
      { label: "Weekly Box", href: "/meal-plans/weekly" },
      { label: "Family Plan", href: "/meal-plans/family" },
      { label: "Individual Plan", href: "/meal-plans/individual" },
    ],
  },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();
  // const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getuser = async () => {
    setIsLoading(true)
    const user = await getCurrentUser();
    if(user){
      setUser(user);
      setIsLoading(false)
    }else{
      setIsLoading(false)
    }
    console.log(user, "from nav bar");
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
            <span>BitePlan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.subItems && setOpenDropdown(item.label)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1",
                    isScrolled ? "text-foreground" : "text-foreground"
                  )}
                >
                  <span>{item.label}</span>
                  {item.subItems && <ChevronDown className="h-4 w-4" />}
                </Link>

                {item.subItems && openDropdown === item.label && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 animate-fade-in">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {subItem.label}
                      </Link>
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
        <div className="fixed inset-0 top-[68px] z-50 bg-white">
          <div className="h-full overflow-y-auto p-6 pb-20 animate-fade-in">
            <div className="space-y-2">
              {navItems.map((item) =>
                item.subItems ? (
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
                          {item.subItems.map((subItem) => (
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
                          ))}
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
                      href={item.href}
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
