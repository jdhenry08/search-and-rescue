import { type PropsWithChildren } from "react";
import { useRouter } from "next/router";

import { fetchAPI } from "~/utils/api";

import { Button } from "~/components/ui/button";

export default function MainLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <>
      <div className="bg-primary pb-32">
        <header className="px-4 py-12">
          <div className="container mx-auto flex items-center justify-between px-0 text-primary-foreground">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Search & <span className="text-secondary">Rescue</span>
            </h1>

            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await fetchAPI("auth/logout", { method: "POST", router });
                void router.reload();
              }}
            >
              Sign out
            </Button>
          </div>
        </header>
      </div>

      <div className="container -mt-32 rounded-lg bg-white px-0 shadow">
        {children}
      </div>
    </>
  );
}
