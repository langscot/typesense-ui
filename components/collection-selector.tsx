"use client";

import { useCollections } from "@/lib/typesense/typesense-store";
import { cn } from "@/lib/utils";
import { ArrowLeft, Boxes, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function CollectionSelector({
  selectedCollectionName,
  onSelect,
}: {
  selectedCollectionName?: string;
  onSelect: (collectionName: string) => void;
}) {
  const { collections } = useCollections();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCollectionName ? (
            <div className="flex items-center gap-2">
              <Boxes />
              {selectedCollectionName.length > 18
                ? `${selectedCollectionName.slice(0, 18)}...`
                : selectedCollectionName}
            </div>
          ) : (
            "Select collection..."
          )}
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search collections..." />
          <CommandList>
            <CommandEmpty>No collections found.</CommandEmpty>
            <CommandGroup>
              {collections.map((collection) => (
                <CommandItem
                  key={collection.name}
                  value={collection.name}
                  onSelect={() => {
                    onSelect(collection.name);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "h-4 w-4",
                      selectedCollectionName === collection.name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span className="flex-1">{collection.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <Link href="/dashboard">
                <CommandItem>
                  <ArrowLeft />
                  Back to dashbaord
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
