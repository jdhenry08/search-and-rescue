import { useState } from "react";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";

import { fetchAPI } from "~/utils/api";
import { type Dog } from "~/utils/types";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function FindMatchButton({ selectedRows }: { selectedRows: string[] }) {
  const router = useRouter();

  const [showDialog, setShowDialog] = useState(false);
  const [match, setMatch] = useState<Dog>();

  async function findMatch() {
    const results: { match: string } | undefined = await fetchAPI(
      "dogs/match",
      {
        method: "POST",
        body: selectedRows,
        router,
      },
    );

    if (results === undefined) {
      console.error("dogs/match: Could not fetch a match.");
      return;
    }

    const match: Dog[] | undefined = await fetchAPI("dogs", {
      method: "POST",
      body: [results.match],
      router,
    });

    if (match === undefined || match.length !== 1) {
      console.error("dogs: Could not fetch match details.");
      return;
    }

    setMatch(match[0]);
    setShowDialog(true);
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="accent"
          onClick={findMatch}
          disabled={selectedRows.length === 0}
          className="flex gap-2"
          size="lg"
        >
          Find your match!
          <Heart className="fill-accent-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-accent">
            We found your perfect match!
          </DialogTitle>

          <DialogDescription className="text-md">
            Meet {match?.name} the {match?.breed}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={match?.img} alt="" className="w-full rounded-xl" />

          <dl className="w-full divide-y divide-muted text-sm leading-6">
            <div className="grid grid-cols-3 gap-4 p-2">
              <dt className="font-medium">Name</dt>
              <dd className="col-span-2">{match?.name}</dd>
            </div>

            <div className="grid grid-cols-3 gap-4 p-2">
              <dt className="font-medium">Breed</dt>
              <dd className="col-span-2">{match?.breed}</dd>
            </div>

            <div className="grid grid-cols-3 gap-4 p-2">
              <dt className="font-medium">Age</dt>
              <dd className="col-span-2">{match?.age}</dd>
            </div>

            <div className="grid grid-cols-3 gap-4 p-2">
              <dt className="font-medium">Zip Code</dt>
              <dd className="col-span-2">{match?.zip_code}</dd>
            </div>
          </dl>
        </div>

        <DialogFooter>
          <Button variant="accent">Adopt {match?.name}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
