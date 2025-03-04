"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Phone, Lock } from "lucide-react";
import { getCurrentUser, signInUser } from "@/services/AuthServices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      identifier,
      password,
    };

    try {
      const res = await signInUser(userData);
      const user = await getCurrentUser();


      if (res?.success) {
        setIsLoading(false);
        toast.success(res?.message);

        if (user.role === "customer") {
          router.push("/find-meals");
        } else {
          router.push("/dashboard/provider");
        }
      } else {
        setIsLoading(false);
        toast.error(res?.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email or Phone Input */}
          <div className="space-y-2">
            <label htmlFor="identifier" className="block text-sm font-medium">
              Email or Phone
            </label>
            <div className="relative">
              {identifier.includes("@") ? (
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              ) : (
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                id="identifier"
                type="text"
                placeholder="you@example.com or 018000000000"
                className="pl-10"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
            </div>
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

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
