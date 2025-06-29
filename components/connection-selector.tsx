"use client";

import { useManageConnections } from "@/lib/typesense/typesense-store";
import { cn } from "@/lib/utils";
import { Activity, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConnectionStatusIcon } from "./connection-status-icon";
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

export function ConnectionSelector() {
  const { connections, activeConnection, setActiveConnection } =
    useManageConnections();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {activeConnection ? (
            <div className="flex items-center gap-2">
              <ConnectionStatusIcon connection={activeConnection} />
              {activeConnection.name}
            </div>
          ) : (
            "Select connection..."
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search connections..." />
          <CommandList>
            <CommandEmpty>No connection found.</CommandEmpty>
            <CommandGroup>
              {connections.map((connection) => (
                <CommandItem
                  key={connection.id}
                  value={connection.id}
                  onSelect={() => {
                    setActiveConnection(connection.id);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      " h-4 w-4",
                      activeConnection?.id === connection.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span className="flex-1">{connection.name}</span>
                  <ConnectionStatusIcon connection={connection} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <Link href="/">
                <CommandItem>
                  <Activity />
                  Manage connections
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
