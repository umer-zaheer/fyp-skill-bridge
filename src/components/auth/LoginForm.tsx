import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { loginSchema } from "@/lib/schemas";
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
import { cn } from "@/lib/utils";

type DemoRole = "student" | "instructor" | "admin";

function resolveRole(email: string, selected: DemoRole): DemoRole {
  const e = email.toLowerCase();
  if (e.includes("admin")) return "admin";
  if (e.includes("instructor") || e.includes("teach")) return "instructor";
  return selected;
}

function destFor(role: DemoRole) {
  if (role === "admin") return "/admin" as const;
  if (role === "instructor") return "/instructor/dashboard" as const;
  return "/student/dashboard" as const;
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<DemoRole>("student");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const nextRole = resolveRole(values.email, role);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    toast.success("Welcome back", { description: `Signed in as ${nextRole}` });
    void navigate({ to: destFor(nextRole) });
  }

  const socialLogin = async (provider: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    toast.success(`${provider} sign-in`, { description: "Demo redirect" });
    void navigate({ to: destFor(role) });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Continue as</p>
        <div className="grid grid-cols-3 gap-2">
          {(["student", "instructor", "admin"] as DemoRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-medium capitalize transition-colors",
                role === r
                  ? "bg-amber-500/15 text-amber-600 border-amber-500/40 dark:text-amber-400"
                  : "border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:border-zinc-600",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-50 dark:bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => socialLogin("Google")}
          className="h-11 bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white dark:text-zinc-300 transition-all"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => socialLogin("GitHub")}
          className="h-11 bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white dark:text-zinc-300 transition-all"
        >
          GitHub
        </Button>
      </div>

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
