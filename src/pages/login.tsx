import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { fetchAPI } from "~/utils/api";
import LoginLayout from "~/layouts/login";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z
    .string({ required_error: "Please enter your email address" })
    .email("Please enter a valid email address"),
});

export default function Login() {
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Setting these to empty strings prevents uncontrolled > controlled input errors
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await fetchAPI("auth/login", {
      method: "POST",
      body: data,
      router,
    });

    void router.push("/");
  }

  return (
    <Form {...loginForm}>
      <form
        className="mx-auto w-full max-w-sm space-y-6 lg:w-96"
        onSubmit={loginForm.handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold tracking-tight text-accent">
          Please sign in to your account
        </h2>

        <FormField
          control={loginForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input placeholder="Bark Ruffalo" {...field} />
              </FormControl>

              <FormMessage>&nbsp;</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input placeholder="bark.ruffalo@example.com" {...field} />
              </FormControl>

              <FormMessage>&nbsp;</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" variant="accent" className="w-full">
          Sign in
        </Button>
      </form>
    </Form>
  );
}

Login.Layout = LoginLayout;
