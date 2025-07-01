"use client";

import { Code } from "@/components/code";
import { DataTable } from "@/components/data-table";
import { DataTableCellExplorer } from "@/components/data-table-cell-explorer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDocumentsDataTable } from "@/hooks/use-documents-datatable";
import { useCollection } from "@/lib/typesense/typesense-store";
import { getNestedValue } from "@/lib/utils";
import type { Column, Row } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, FileJson } from "lucide-react";
import { useParams } from "next/navigation";
import type { CollectionFieldSchema } from "typesense/lib/Typesense/Collection";

export default function CollectionPage() {
  const { collectionName } = useParams<{ collectionName: string }>();
  const { collection } = useCollection(collectionName);

  const {
    data,
    isLoading,
    error,
    pagination,
    setPagination,
    sorting,
    setSorting,
    search,
    setSearch,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
  } = useDocumentsDataTable(collectionName);

  if (!collection) return null;

  // Construct headers from fields.
  // If a field is a nested array, we need to consolidate the nested fields into a single header.
  const headers = collection.fields.reduce(
    (acc, field) => {
      const isNested = field.name.includes(".");
      const isArray = field.type.endsWith("[]");
      const name = isNested && isArray ? field.name.split(".")[0] : field.name;
      const existingHeader = acc.find((h) => h.name === name);

      if (existingHeader) {
        existingHeader.fields.push(field);
      } else {
        acc.push({
          name, // If array&nested, only use top-level name
          sort: field.sort,
          isNested,
          fields: [field],
        });
      }

      return acc;
    },
    [
      {
        name: "id",
        isNested: false,
        fields: [
          {
            name: "id",
          },
        ],
      },
    ] as {
      name: string;
      sort: boolean | undefined;
      isNested: boolean;
      fields: CollectionFieldSchema[];
    }[],
  );

  return (
    <DataTable<any, any>
      pageCount={data?.found ? Math.ceil(data.found / pagination.pageSize) : 0}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
      search={search}
      onSearchChange={setSearch}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
      columns={[
        ...(headers?.length > 0
          ? headers.map((header) => ({
              header: ({ column }: { column: Column<any> }) => {
                return (
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent px-0!"
                    onClick={() => {
                      if (!header.sort) return;
                      column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                  >
                    {header.name}
                    {header.sort &&
                      (column.getIsSorted() === "asc" ? (
                        <ArrowUp size={16} />
                      ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown size={16} />
                      ) : (
                        <ArrowUpDown size={16} />
                      ))}
                  </Button>
                );
              },
              accessorKey: header.name,
              cell: ({ row }: { row: Row<any> }) => {
                switch (header.fields[0].type) {
                  case "bool[]":
                  case "float[]":
                  case "geopoint[]":
                  case "int32[]":
                  case "int64[]":
                  case "object[]":
                  case "string[]":
                    if (header.isNested) {
                      const items = row.original[header.name].length;
                      return (
                        <DataTableCellExplorer
                          title={header.name}
                          value={row.original[header.name]}
                          type={header.fields[0].type}
                        >
                          {items} items
                        </DataTableCellExplorer>
                      );
                    }
                    return (
                      <DataTableCellExplorer
                        title={header.name}
                        value={row.original[header.name].join(", ")}
                        type={header.fields[0].type}
                      >
                        {row.original[header.name].length > 5
                          ? `${row.original[header.name].slice(0, 5).join(", ")} and ${row.original[header.name].length - 5} more`
                          : row.original[header.name].join(", ")}
                      </DataTableCellExplorer>
                    );
                  default: {
                    if (header.isNested) {
                      const value = getNestedValue(row.original, header.name);
                      return (
                        <DataTableCellExplorer
                          title={header.name}
                          value={JSON.stringify(value)}
                          type={header.fields[0].type}
                        >
                          {JSON.stringify(value).length > 100
                            ? `${JSON.stringify(value).slice(0, 100)}...`
                            : JSON.stringify(value)}
                        </DataTableCellExplorer>
                      );
                    } else {
                      return (
                        <DataTableCellExplorer
                          title={header.name}
                          value={JSON.stringify(row.original[header.name])}
                          type={header.fields[0].type}
                        >
                          {row.original[header.name].length > 100
                            ? `${row.original[header.name].slice(0, 100)}...`
                            : row.original[header.name]}
                        </DataTableCellExplorer>
                      );
                    }
                  }
                }
              },
            }))
          : []),
        {
          id: "actions",
          cell: ({ row }) => {
            return (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <FileJson size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>JSON</DialogTitle>
                  </DialogHeader>
                  <Code content={row.original} />
                </DialogContent>
              </Dialog>
            );
          },
        },
      ]}
      data={data?.hits?.map((hit) => hit.document) ?? []}
    />
  );
}
