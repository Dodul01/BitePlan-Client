"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/services/AuthServices";
import { toast } from "sonner";

// You can replace these with process.env.NEXT_PUBLIC_CLOUD_NAME etc.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME || "dbwrot7po";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "lkjadsflkjsdafkljasdf";

const SignUp = () => {
  const [userType, setUserType] = useState("customer");
  const [fullName, setFullName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [cuisineSpecialties, setCuisineSpecialties] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  // Uploads the image to Cloudinary and returns the secure URL
  const handleCloudinaryUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Image upload failed");
      const data = await response.json();
      return data.secure_url; // The secure URL of the uploaded image
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    let logoUrl = "";
    // If meal provider and a file has been selected, upload it first
    if (userType === "seller" && logo) {
      try {
        logoUrl = await handleCloudinaryUpload(logo);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert("Image upload failed, please try again.");
        setIsLoading(false);
        return;
      }
    }

    const userData = {
      name: fullName,
      email,
      phone,
      password,
      role: userType,
      busisnessName: businessName,
      cuisineSepcialties: cuisineSpecialties,
      deliveryAddress,
      // Only include the logo link if the user is a meal provider
      logoImage: userType === "seller" ? logoUrl : undefined,
    };

    try {
      const res = await registerUser(userData);
      console.log("User registration response:", res);

      if (res.success && res.result && res.result._id) {
        toast.success("Sign Up Successfully.");
      } else if (!res.success) {
        toast.error(res.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up as a customer or meal provider
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant={userType === "customer" ? "default" : "outline"}
            onClick={() => setUserType("customer")}
          >
            Customer
          </Button>
          <Button
            variant={userType === "seller" ? "default" : "outline"}
            onClick={() => setUserType("seller")}
          >
            Meal Provider
          </Button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {userType === "customer" && (
            <div className="space-y-2">
              <label
                htmlFor="deliveryAddress"
                className="block text-sm font-medium"
              >
                Delivery Address
              </label>
              <Input
                id="deliveryAddress"
                type="text"
                placeholder="Your delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {userType === "seller" && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium"
                >
                  Business Name
                </label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="cuisineSpecialties"
                  className="block text-sm font-medium"
                >
                  Cuisine Specialties
                </label>
                <Input
                  id="cuisineSpecialties"
                  type="text"
                  placeholder="e.g. Italian, Indian, Chinese"
                  value={cuisineSpecialties}
                  onChange={(e) => setCuisineSpecialties(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="logo" className="block text-sm font-medium">
                  Upload Logo
                </label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
