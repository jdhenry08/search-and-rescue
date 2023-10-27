import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/utils/helpers";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

const Combobox = ({
  values,
  placeholder,
  searchPlaceholder,
  noSearchResultsText,
  onSelect,
  className,
}: {
  values: string[];
  placeholder: string;
  searchPlaceholder: string;
  noSearchResultsText: string;
  onSelect: (value: string[]) => void;
  className?: string;
}) => {
  const options = values.map((value) => {
    return {
      value: value.toLowerCase(),
      label: value,
    };
  });
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full max-w-xs justify-between hover:bg-inherit hover:text-inherit",
            className,
          )}
        >
          {selected.length > 0 ? (
            <div className="truncate">
              {selected
                .map(
                  (val) =>
                    options.find((opt) => opt.value === val)?.label ?? "",
                )
                .join(", ")}
            </div>
          ) : (
            <div className="text-muted-foreground">{placeholder}</div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-w-xs p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{noSearchResultsText}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="pe-3">
              <div className="grid max-h-96">
                {options
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        const newSelected = [...selected];
                        if (selected.includes(currentValue)) {
                          newSelected.splice(selected.indexOf(currentValue), 1);
                        } else {
                          newSelected.push(currentValue);
                        }
                        newSelected.sort((a, b) => a.localeCompare(b));
                        setSelected(newSelected);
                        setOpen(false);
                        onSelect(
                          newSelected.map(
                            (val) =>
                              options.find((option) => option.value === val)
                                ?.label ?? "",
                          ),
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))
                  .sort((a, b) => {
                    if (
                      selected.includes(a.key ?? "") &&
                      selected.includes(b.key ?? "")
                    )
                      return 0;
                    if (selected.includes(a.key ?? "")) return -1;
                    if (selected.includes(b.key ?? "")) return 1;
                    return 0;
                  })}
              </div>
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { Combobox };
