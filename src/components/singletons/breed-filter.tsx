import { type Table } from "@tanstack/react-table";

import { Combobox } from "~/components/ui/combobox";

export function BreedFilter<TData>({ table }: { table: Table<TData> }) {
  return (
    <Combobox
      className="w-80"
      values={table.options.meta?.breeds ?? []}
      placeholder="Filter by breed..."
      searchPlaceholder="Search breeds..."
      noSearchResultsText="No breeds found."
      onSelect={(value) => {
        table.setColumnFilters([{ id: "breed", value: value.join(",") }]);
        table.setPageIndex(0);
      }}
    />
  );
}
