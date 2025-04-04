"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {

  const router = useRouter()
  const formSchema = authFormSchema(type);
  const isSignIn = type === "sign-in";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        console.log("Signup ", values);
        toast.success("Account Created Successfully!. Please sign in.")
        router.push('/sign-in')
      } else {
        console.log("Signin ", values);
        toast.success("Signed In Successfully!.")
        router.push('/')
      }
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong. Please try again.`);
    }
  }

  return (
    <div className=" lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">X-Interview</h2>
        </div>
          <h3>Practice for job interviews with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                name="name"
                label="Name"
                placeholder="Your Name"
                control={form.control}
              />
            )}
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="Your Email Address"
              control={form.control}
            />
            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter A Password"
              control={form.control}
            />
            <Button type="submit" className="btn">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            className="font-bold text-user-primary ml-1"
            href={isSignIn ? "/sign-up" : "/sign-in"}
          >
            {isSignIn ? "Signup" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
