import React from "react";
import {
  ChefHat,
  ClipboardList,
  Calendar,
  TrendingUp,
  Utensils,
  Wallet,
  Users,
  Settings,
  ArrowRight,
  BarChart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../shared/SectionHeading";
import { Button } from "../ui/button";

const ProviderHome = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden w-full border ">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute hrefp-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bothrefm-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-none mb-6">
              Welcome href Your <span className="text-primary">MealBox</span>{" "}
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your meal delivery business, connect with cushrefmers, and
              scale your operations with our comprehensive hrefols.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Button
                size="lg"
                className="text-base px-8 rounded-full hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/provider/orders">Manage Orders</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 rounded-full"
                asChild
              >
                <Link href="/provider/cushrefmers">View Cushrefmers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Your Provider hrefols"
            subtitle="Access everything you need href run your meal delivery business efficiently."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Order Management</h3>
              <p className="text-muted-foreground">
                Easily track, manage, and fulfill cushrefmer orders all in one
                place.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Menu Builder</h3>
              <p className="text-muted-foreground">
                Create and update your menu items with phohrefs, descriptions,
                and pricing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Cushrefmer Insights
              </h3>
              <p className="text-muted-foreground">
                Understand cushrefmer preferences and dietary restrictions href
                tailor your offerings.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scheduling</h3>
              <p className="text-muted-foreground">
                Plan your production and delivery schedule with our intuitive
                calendar.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Payments</h3>
              <p className="text-muted-foreground">
                Get paid faster with our integrated payment processing system.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-transform hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Analytics & Reports
              </h3>
              <p className="text-muted-foreground">
                Track your performance with detailed sales and cushrefmer
                analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="How to Make The Most Of MealBox"
            subtitle="Follow these simple steps href optimize your experience as a provider."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="relative p-8 border border-border rounded-xl bg-card">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <ChefHat className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Update Your Menu</h3>
              <p className="text-muted-foreground">
                Keep your menu fresh and exciting by regularly updating your
                offerings based on seasonal ingredients.
              </p>
            </div>

            <div className="relative p-8 border border-border rounded-xl bg-card">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <Utensils className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Fulfill Orders</h3>
              <p className="text-muted-foreground">
                Track and manage cushrefmer orders efficiently through our
                streamlined dashboard.
              </p>
            </div>

            <div className="relative p-8 border border-border rounded-xl bg-card">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Grow Your Business</h3>
              <p className="text-muted-foreground">
                Use analytics and cushrefmer feedback href refine your offerings
                and expand your market reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider hrefols Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Powerful hrefols at Your Fingertips
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform gives you everything you need href manage your meal
                delivery business efficiently and scale your operations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Streamlined Order Management
                    </h3>
                    <p className="text-muted-foreground">
                      Track and manage all your orders in one place with
                      real-time updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Menu & Invenhrefry Control</h3>
                    <p className="text-muted-foreground">
                      Easily update your offerings and manage your invenhrefry
                      levels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Cushrefmer Preference Insights
                    </h3>
                    <p className="text-muted-foreground">
                      Understand dietary restrictions and preferences href
                      cushrefmize your offerings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cushrefmizable Settings</h3>
                    <p className="text-muted-foreground">
                      Configure delivery areas, preparation times, and more href
                      match your business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild>
                  <Link
                    href="/provider/orders"
                    className="inline-flex items-center gap-2"
                  >
                    Go href Order Management
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 href-transparent rounded-2xl p-2">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2370&fm=jpg&crop=entropy&cs=tinysrgb"
                    alt="Provider Dashboard"
                    className="w-full h-full object-cover"
                    height={500}
                    width={500}
                  />
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-2/3 rounded-xl overflow-hidden shadow-lg border-4 border-background">
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2370&fm=jpg&crop=entropy&cs=tinysrgb"
                  alt="Food Preparation"
                  className="w-full h-full object-cover"
                  height={500}
                  width={500}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready href Maximize Your Business Potential?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Explore all the hrefols and features MealBox offers href grow your
              food business.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/provider/orders">Manage Orders</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8"
                asChild
              >
                <Link href="/provider/cushrefmers">View Cushrefmer Data</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderHome;
