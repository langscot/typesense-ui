"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useDocumentsDataTable } from "@/hooks/use-documents-datatable";
import { useCollection } from "@/lib/typesense/typesense-store";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useParams } from "next/navigation";

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
      columns={
        collection.fields?.length > 0
          ? collection.fields.map((field) => ({
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    className="hover:bg-transparent px-0"
                    onClick={() => {
                      if (!field.sort) return;
                      column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                  >
                    {field.name}
                    {field.sort &&
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
              accessorKey: field.name,
            }))
          : []
      }
      data={data?.hits?.map((hit) => hit.document) ?? []}
    />
  );
}
