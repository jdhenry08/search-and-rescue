import { type PropsWithChildren } from "react";
import Image from "next/image";

import login from "public/login.jpg";

export default function LoginLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        {children}
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute h-full w-full object-cover"
          src={login}
          alt=""
          priority
        />
      </div>
    </div>
  );
}
