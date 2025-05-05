"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeading from "./SectionHeading";

const FAQSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-3xl">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Find quick answers to common questions about our meals, orders, and services."
        />

        <Accordion type="single" collapsible className="space-y-4 mt-8">
          <AccordionItem value="q1">
            <AccordionTrigger>How are the meals prepared?</AccordionTrigger>
            <AccordionContent>
              All meals are freshly prepared by certified local chefs using
              high-quality, locally sourced ingredients.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>
              Can I schedule delivery for later?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can select a preferred delivery time during checkout. We
              deliver between 10 AM and 10 PM daily.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>
              Are there options for dietary restrictions?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely. We offer vegetarian, vegan, gluten-free, and
              keto-friendly meals. Use filters or leave notes while ordering.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger>
              Do I need an account to place an order?
            </AccordionTrigger>
            <AccordionContent>
              Yes, creating an account helps us personalize your experience and
              ensures a secure checkout process.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger>
              What if I want to cancel or change my order?
            </AccordionTrigger>
            <AccordionContent>
              You can modify or cancel your order up to 1 hour before the
              scheduled delivery time from your profile dashboard.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;