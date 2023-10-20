import Image from "next/image";

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import login from "public/login.jpg";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <form
          action="#"
          method="POST"
          className="mx-auto w-full max-w-sm space-y-8 lg:w-96"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            Please sign in to your account
          </h2>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute h-full w-full object-cover"
          src={login}
          alt=""
        />
      </div>
    </div>
  );
}
