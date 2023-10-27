import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  type RowData,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Heart } from "lucide-react";

import { fetchAPI } from "~/utils/api";
import { cn } from "~/utils/helpers";
import { type Dog } from "~/utils/types";
import MainLayout from "~/layouts/main";

import { DataTable } from "~/components/ui/data-table";
import { ColumnHeader } from "~/components/ui/data-table/column-header";
import { Pagination } from "~/components/ui/data-table/pagination";
import { BreedFilter } from "~/components/singletons/breed-filter";
import { FindMatchButton } from "~/components/singletons/find-match-button";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    resultCount: number;
    breeds: string[];
  }
}

const columns: ColumnDef<Dog>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const selected = table.getIsAllPageRowsSelected();

      return (
        <>
          <Heart
            className={cn(
              "absolute z-10 inline-flex transition-all",
              selected
                ? "animate-[ping_0.4s_ease-out_backwards] hover:fill-accent-foreground/20"
                : "fill-accent-foreground hover:fill-accent-foreground/80",
            )}
            onClick={() => table.toggleAllPageRowsSelected(!selected)}
          />
          <Heart className={cn("relative inline-flex fill-accent")} />
        </>
      );
    },
    cell: ({ row }) => {
      const selected = row.getIsSelected();

      return (
        <>
          <Heart
            className={cn(
              "absolute z-10 inline-flex transition-all",
              selected
                ? "animate-[ping_0.4s_ease-out_backwards] hover:fill-accent-foreground/20"
                : "fill-accent-foreground hover:fill-accent-foreground/80",
            )}
            onClick={() => row.toggleSelected(!selected)}
          />
          <Heart className={cn("relative inline-flex fill-accent")} />
        </>
      );
    },
  },
  {
    accessorKey: "img",
    header: "",
    cell: ({ row }) => (
      <div className="flex h-32 w-32 items-center overflow-hidden rounded-sm sm:rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="rounded-sm object-cover sm:rounded-xl"
          src={row.getValue("img")}
          alt=""
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "breed",
    header: ({ column }) => <ColumnHeader column={column} title="Breed" />,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <ColumnHeader column={column} title="Age" />,
    sortDescFirst: false,
  },
  {
    accessorKey: "zip_code",
    header: ({ column }) => <ColumnHeader column={column} title="Zip Code" />,
    enableSorting: false,
  },
];

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "breed", desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [resultCount, setResultCount] = useState(0);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: dogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    manualSorting: true,
    onSortingChange: setSorting,
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(resultCount / pagination.pageSize),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: {
      columnFilters,
      sorting,
      pagination,
      rowSelection,
    },
    meta: {
      resultCount,
      breeds,
    },
  });

  useEffect(() => {
    async function fetchData() {
      const results: string[] | undefined = await fetchAPI("dogs/breeds", {
        router,
      });

      if (results === undefined) {
        console.error("dogs/breeds: Could not fetch list of breeds.");
        return;
      }

      setBreeds(results);
    }

    void fetchData();
  }, [router]);

  useEffect(() => {
    function searchParams() {
      const params = new URLSearchParams();
      (columnFilters.find((filter) => filter.id === "breed")?.value as string)
        ?.split(",")
        .forEach((filter) => params.append("breeds[]", filter));
      sorting.forEach((sort) =>
        params.append("sort", `${sort.id}:${sort.desc ? "desc" : "asc"}`),
      );
      params.append(
        "from",
        (pagination.pageIndex * pagination.pageSize).toString(),
      );
      params.append("size", pagination.pageSize.toString());
      return params.toString();
    }

    async function getData() {
      const results:
        | {
            resultIds: string[];
            total: number;
          }
        | undefined = await fetchAPI(`dogs/search?${searchParams()}`, {
        router,
      });

      if (results === undefined) {
        console.error("dogs/search: Could not search database.");
        return;
      }

      setLoading(false);
      setResultCount(results.total);

      const dogData: Dog[] | undefined = await fetchAPI("dogs", {
        method: "POST",
        body: results.resultIds,
        router,
      });

      if (dogData === undefined) {
        console.error("dogs: Could not fetch search details.");
        return;
      }

      setDogs(dogData);
    }

    void getData();
  }, [columnFilters, sorting, pagination, router]);

  return loading ? (
    // Ideally, we'd get a loading spinner or a nice skeleton to show here while we're loading
    <></>
  ) : (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:items-start sm:p-6 lg:p-8">
        <div className="flex grow basis-0 justify-start">
          <BreedFilter table={table} />
        </div>

        <div className="hidden grow basis-0 justify-center sm:flex">
          <Pagination table={table} />
        </div>

        <div className="flex grow basis-0 justify-end">
          {/* I don't think any of the keys are ever false, but just in case, let's filter them out */}
          <FindMatchButton
            selectedRows={Object.keys(rowSelection).filter(
              (key) => rowSelection[key],
            )}
          />
        </div>
      </div>

      <DataTable table={table} />

      <div className="flex justify-center p-4 sm:p-6 lg:p-8">
        <Pagination table={table} />
      </div>
    </div>
  );
}

Home.Layout = MainLayout;
