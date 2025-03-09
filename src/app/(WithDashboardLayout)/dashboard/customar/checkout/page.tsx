/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/UserContext";
import SectionHeading from "@/components/shared/SectionHeading";

// Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { cart: cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (total: any, item: any) => total + item.price,
    0
  );
  const shipping = 4.99;
  const tax = subtotal * 0.0825; // 8.25% tax rate
  const total = subtotal + shipping + tax;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      // Send paymentMethod.id to backend for further processing
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100, // Convert to cents
          paymentMethodId: paymentMethod.id,
        }),
      });

      const paymentResult = await response.json();
      if (paymentResult.success) {
        setPaymentSuccess(true);
        toast.success("Payment successful!");
      } else {
        toast.error("Payment failed");
      }
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="container mx-auto max-w-4xl py-24 px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Thank you for your order. Your meals are on the way!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>Order #MBX-{Math.floor(100000 + Math.random() * 900000)}</p>
            <p className="mt-4">
              You will receive a confirmation email shortly.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="mt-4">Return to Homepage</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white m-4 rounded-lg border border-white shadow py-5">
        <SectionHeading
          title="Checkout"
          subtitle="Your cravings end here! The best dishes, just a click away."
          decorative={true}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator className="my-4" />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Enter your payment details to complete your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Card Information</h3>
                  <CardElement
                    className="p-3 border rounded-md w-full"
                    options={{ hidePostalCode: true }}
                  />
                </div>

                <Separator />

                <Button
                  type="submit"
                  className="w-full py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
