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
  if (typeof window === "undefined") return {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    sorting: [],
    columnVisibility: {},
  };

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

// Gets a value from an object using dot notation path
export function getNestedValue<T = unknown>(obj: Record<string, unknown>, path: string): T | undefined {
  if (!obj || !path) return undefined;

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T | undefined;
}