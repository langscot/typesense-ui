import { useActiveConnection, useCollection } from "@/lib/typesense/typesense-store";
import { getDocumentsDataTablePreferences, setDocumentsDataTablePreferences } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { ColumnFiltersState, PaginationState, SortingState, VisibilityState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export function useDocumentsDataTable(collectionName: string) {
  const preferences = getDocumentsDataTablePreferences(collectionName);

  const { client } = useActiveConnection();
  const { collection } = useCollection(collectionName);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: preferences.pagination.pageIndex,
    pageSize: preferences.pagination.pageSize,
  });
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>(preferences.sorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(preferences.columnVisibility);

  const excludeFields = collection?.fields?.filter((field) => columnVisibility[field.name] ? columnVisibility[field.name] === false : false).map((field) => field.name).join(",");
  const queryBy = collection?.fields?.filter((field) => field.type.startsWith('string')).map((field) => field.name).join(",");
  const sortBy = sorting.filter((sort) => collection?.fields?.find((field) => field.name === sort.id && !!field.sort)).map((sort) => `${sort.id}:${sort.desc ? "desc" : "asc"}`).join(",");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "collection-documents",
      collectionName,
      pagination.pageIndex,
      pagination.pageSize,
      sorting.map(sort => `${sort.id}:${sort.desc ? 'desc' : 'asc'}`).join(','),
      search,
      excludeFields,
      queryBy,
      sortBy
    ],
    queryFn: () => {
      return client?.collections(collectionName).documents().search({
        page: (pagination.pageIndex ?? 0) + 1,
        per_page: pagination.pageSize,
        q: search ?? "",
        exclude_fields: excludeFields,
        query_by: queryBy,
        sort_by: sortBy
      });
    },
    enabled: !!client && !!collection,
    placeholderData: (previousData) => previousData
  });

  useEffect(() => {
    console.log("Saving preferences", {
      pagination,
      sorting,
      columnVisibility,
    });
    setDocumentsDataTablePreferences(collectionName, {
      pagination,
      sorting,
      columnVisibility,
    });
  }, [pagination, sorting, columnVisibility, collectionName]);

  return {
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
  };
}