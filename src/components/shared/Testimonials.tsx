"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    id: "1",
    name: "Emily Johnson",
    role: "Nutritionist",
    comment:
      "MealBox has completely changed the way I eat! The meals are delicious, healthy, and incredibly convenient.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "2",
    name: "Michael Smith",
    role: "Personal Trainer",
    comment:
      "As someone who focuses on high-protein meals, MealBox delivers exactly what I need. Highly recommended!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: "3",
    name: "Sophia Lee",
    role: "Busy Professional",
    comment:
      "I love the flexibility and variety of meals. It saves me so much time and effort while eating healthy.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    id: "4",
    name: "Daniel Martinez",
    role: "Software Engineer",
    comment:
      "I'm always on the go, and MealBox makes it easy to have nutritious meals without cooking.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: "5",
    name: "Olivia Wilson",
    role: "Freelancer",
    comment:
      "The meals taste amazing, and I appreciate the variety. It’s the perfect solution for my busy schedule.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Join thousands of satisfied customers who have transformed their
            mealtime experience."
        />

        {/* Carousel */}
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent className="-ml-2">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:basis-1/3">
                <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex space-x-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="italic text-muted-foreground mb-6">
                      &quot;{testimonial.comment}&quot;
                    </p>
                    <div className="flex items-center">
                      <Image
                        height={200}
                        width={200}
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* button */}

          <CarouselPrevious className="cursor-pointer" />
          <CarouselNext className="cursor-pointer" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
