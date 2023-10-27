import { type Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ToggleGroup, Toggle } from "~/components/ui/toggle-group";

function getPages(totalPages: number, currentPage: number) {
  if (totalPages <= 7)
    return Array.from(Array(totalPages).keys()).map((r) => {
      return r + 1;
    });

  let diff = 0;
  const result = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];

  if (result[0] === undefined) return;

  if (result[0] < 3) {
    diff = 2 - result[0];
  }

  if ((result.slice(-1)[0] ?? -1) > totalPages - 2) {
    diff = totalPages - 1 - (result.slice(-1)[0] ?? -1);
  }

  const ret = result.map((r) => {
    return r + diff;
  });
  if (ret[0] !== 2) ret[0] = -2;
  if (ret[ret.length - 1] !== totalPages - 1)
    ret[ret.length - 1] = 1 - totalPages;
  return [1, ...ret, totalPages];
}

export function Pagination<TData>({ table }: { table: Table<TData> }) {
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <ToggleGroup type="single" value={pageIndex.toString()}>
          <Toggle
            className="rounded-s-lg"
            variant="outline"
            value="previous"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Previous page</span>
            <ChevronLeft className="h-auto w-auto" />
          </Toggle>

          {getPages(table.getPageCount(), pageIndex + 1)?.map((pageIdx) => {
            return pageIdx < 0 ? (
              <Toggle key={pageIdx} variant="outline" value="..." disabled>
                ...
              </Toggle>
            ) : (
              <Toggle
                key={pageIdx}
                variant="outline"
                value={(pageIdx - 1).toString()}
                onClick={() => table.setPageIndex(pageIdx - 1)}
                disabled={pageIdx - 1 === pageIndex}
              >
                <span className="sr-only">Go to page {pageIdx}</span>
                {pageIdx}
              </Toggle>
            );
          })}

          <Toggle
            className="rounded-e-lg"
            variant="outline"
            value="next"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Next page</span>
            <ChevronRight className="h-auto w-auto" />
          </Toggle>
        </ToggleGroup>

        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[8rem]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[5, 10, 25, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Label>
        Showing {pageIndex * pageSize + 1} to {(pageIndex + 1) * pageSize} of{" "}
        {table.options.meta?.resultCount ?? 0} results
      </Label>
    </div>
  );
}
