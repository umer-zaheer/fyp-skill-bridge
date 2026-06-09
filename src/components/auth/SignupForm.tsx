

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

import { signupSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "@tanstack/react-router";

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  // Default tab is student
  const [role, setRole] = useState<"student" | "instructor">("student");

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "student", // Initial default
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);

    // Explicitly overwrite the role based on the current Tab state
    const finalData = { ...values, role: role };

    // Simulate API call
    setTimeout(() => {
      console.log("Submitted Data:", finalData);
      setIsLoading(false);
      // Handle redirect here
    }, 2000);
  }

  // Animation variants for smooth tab switching
  const tabVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="student"
        className="w-full"
        onValueChange={(val) => {
          setRole(val as "student" | "instructor");
          form.setValue("role", val as "student" | "instructor"); // Update hidden form field if needed for validation
        }}
      >
        <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800 h-12 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="student"
            className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 font-medium transition-all duration-300"
          >
            I am a Student
          </TabsTrigger>
          <TabsTrigger
            value="instructor"
            className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 font-medium transition-all duration-300"
          >
            I am an Instructor
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Common Fields, but wrapped in Motion to animate on Tab change if you wanted different fields */}
            <motion.div
              key={role} // Re-renders animation when role changes
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          role === "instructor" ? "Dr. John Doe" : "John Doe"
                        }
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                      Email Address
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
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                      Password
                    </FormLabel>
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
            </motion.div>

            <Button
              type="submit"
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-medium text-md rounded-lg mt-4 group"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {role === "instructor"
                ? "Apply as Instructor"
                : "Join as Student"}
              {!isLoading && (
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              )}
            </Button>
          </form>
        </Form>
      </Tabs>

      <div className="text-center text-sm text-zinc-500 mt-6">
        Already a member?{" "}
        <Link
          to="/login"
          className="text-amber-500 hover:text-amber-400 hover:underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
