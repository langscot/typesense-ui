import type { PaginationState, SortingState, VisibilityState } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getDocumentsDataTablePreferencesKey(collectionName: string) {
  return `documents-data-table-preferences-${collectionName}`;
}

// Retrieves stored data table preferences for a collection
export function getDocumentsDataTablePreferences(collectionName: string): {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
} {
  const preferences = localStorage.getItem(getDocumentsDataTablePreferencesKey(collectionName));
  if (!preferences) return {
    pagination: {
      pageIndex: 0,
      pageSize: 20,
    },
    sorting: [],
    columnVisibility: {},
  };

  return JSON.parse(preferences);
}

// Sets stored data table preferences for a collection
export function setDocumentsDataTablePreferences(collectionName: string, preferences: {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
}) {
  localStorage.setItem(getDocumentsDataTablePreferencesKey(collectionName), JSON.stringify(preferences));
}