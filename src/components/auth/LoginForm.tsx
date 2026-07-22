import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { loginSchema } from "@/lib/schemas";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, dashboardPath } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const user = await login(values.email, values.password);
      toast.success("Welcome back", {
        description: `Signed in as ${user.role}`,
      });
      void navigate({ to: dashboardPath(user.role) });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Unable to sign in";
      toast.error("Login failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@skillbridge.com"
                    autoComplete="email"
                    {...field}
                    className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-600 h-12 rounded-lg focus-visible:ring-amber-500/50 focus-visible:border-amber-500 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                    Password
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() =>
                      toast.message("Password reset", {
                        description: "Connect your backend email flow to enable this.",
                      })
                    }
                    className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...field}
                    className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-600 h-12 rounded-lg focus-visible:ring-amber-500/50 focus-visible:border-amber-500 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 keep-contrast bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-medium text-md rounded-lg mt-2 group"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Access Account
            {!isLoading && (
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-zinc-500 mt-6">
        New to Skill Bridge?{" "}
        <Link
          to="/signup"
          className="text-amber-500 hover:text-amber-400 hover:underline underline-offset-4 transition-colors"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
