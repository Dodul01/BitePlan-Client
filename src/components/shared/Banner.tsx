"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

type BannerSectionProps = object;

const Banner: React.FC<BannerSectionProps> = () => {
  return (
    <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="max-w-xl space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-balance">
                Delicious meals,{" "}
                <span className="text-primary">personalized</span> for your
                lifestyle
              </h1>
              <p className="mt-6 text-xl text-muted-foreground text-balance">
                Skip the planning, shopping, and meal prep. We deliver
                customized, chef-prepared meals right to your door.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base px-8 rounded-full hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/find-meals">Explore Meals</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 rounded-full"
                asChild
              >
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <Image
                    height={200}
                    width={200}
                    key={i}
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "women" : "men"
                    }/${20 + i}.jpg`}
                    className="w-10 h-10 rounded-full border-2 border-background"
                    alt={`Customer ${i}`}
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-sm font-medium">
                  +2k
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  from 2,000+ happy customers
                </p>
              </div>
            </div>
          </div>

          {/* Right image grid */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl -z-10"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 self-end">
                <div className="h-40 rounded-xl overflow-hidden shadow-lg animate-float">
                  <Image
                    height={200}
                    width={200}
                    src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2487&fm=jpg&crop=entropy&cs=tinysrgb"
                    alt="Fresh Food"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="h-56 rounded-xl overflow-hidden shadow-lg animate-float"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Image
                    height={200}
                    width={200}
                    src="https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=612x612&w=0&k=20&c=eaKRSIAoRGHMibSfahMyQS6iFADyVy1pnPdy1O5rZ98="
                    alt="Chef Preparing Food"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div
                  className="h-56 rounded-xl overflow-hidden shadow-lg animate-float"
                  style={{ animationDelay: "0.6s" }}
                >
                  <Image
                    height={200}
                    width={200}
                    src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=2564&fm=jpg&crop=entropy&cs=tinysrgb"
                    alt="Healthy Ingredients"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="h-40 rounded-xl overflow-hidden shadow-lg animate-float"
                  style={{ animationDelay: "0.9s" }}
                >
                  <Image
                    height={200}
                    width={200}
                    src="https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=2370&fm=jpg&crop=entropy&cs=tinysrgb"
                    alt="Meal Preparation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
