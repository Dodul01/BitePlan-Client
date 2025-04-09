/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
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
import { useCart, useUser } from "@/context/UserContext";
import SectionHeading from "@/components/shared/SectionHeading";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { orderMeal } from "@/services/Order";
import { getCurrentUser } from "@/services/AuthServices";

const stripePromise = loadStripe(
  "pk_test_51PcPm62MP0L90YjvNNkd1UGVrq9nu0QWdLfYT4pIF7xAJcfykwMCNeTiZVhSswnCNFHdp2WbqZJweJcxk9IRxARE00OCcRlb8N"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { cart: cartItems } = useCart();

  const subtotal = cartItems.reduce((total: number, item: any) => {
    const price = item?.price ?? item.meal.price ?? 0;
    return total + price;
  }, 0);

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

      // Send order IDs and paymentMethod directly (no extra wrapper)
      const orderData = {
        orderedItemIds: cartItems,
        user: user,
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          card: paymentMethod.card || undefined,
        },
      };
      console.log(orderData);

      const result = await orderMeal(orderData);

      if (result?.success) {
        toast.success("Order placed successfully.");
        window.location.assign("/dashboard/customar/track-order");
      } else {
        toast.error("Order failed. Please try again.");
      }
    } catch (err: any) {
      toast.error("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getuser = async () => {
    setIsUserLoading(true);
    const user = await getCurrentUser();
    if (user) {
      setUser(user);
      setIsUserLoading(false);
    } else {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  // console.log("form cart item page", cartItems);

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
                {/* {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${item.price?.toFixed(2)}
                    </span>
                  </div>
                ))} */}
                {cartItems.map((item: any, index: number) => {
                  const name = item.name ?? item.meal?.name ?? "Unknown Item";
                  const price = item.price ?? item.meal?.price ?? 0;
                  const quantity = item.quantity ?? 1;

                  return (
                    <div key={index} className="flex justify-between">
                      <span>
                        {name} x {quantity}
                      </span>
                      <span className="font-medium">
                        ${(price * quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}

                <Separator className="my-4" />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax?.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total?.toFixed(2)}</span>
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
                  {loading ? "Processing..." : `Pay $${total?.toFixed(2)}`}
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
