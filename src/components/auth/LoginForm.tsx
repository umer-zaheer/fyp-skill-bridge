

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

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

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
    }, 2000);
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
                    {...field}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 h-12 rounded-lg focus-visible:ring-amber-500/50 focus-visible:border-amber-500 transition-all duration-300"
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
                  <a
                    href="#"
                    className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 h-12 rounded-lg focus-visible:ring-amber-500/50 focus-visible:border-amber-500 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-white text-black hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-medium text-md rounded-lg mt-2 group"
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
          <span className="bg-zinc-950 px-2 text-zinc-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300 transition-all"
        >
          Google
        </Button>
        <Button
          variant="outline"
          className="h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300 transition-all"
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
