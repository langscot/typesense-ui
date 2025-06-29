import { useEffect, useMemo } from "react";
import type { CollectionSchema } from "typesense/lib/Typesense/Collection";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { MAX_LOG_RETENTION } from "../constants";
import { createTypesenseClient, type TypesenseConnection } from "./client";

interface TypesenseState {

  // Connections
  connections: TypesenseConnection[];
  activeConnectionId: string | null;
  initializeConnections: () => void;

  // Collections
  collections: {
    data: CollectionSchema[];
    isLoading: boolean;
    error: string | null;
  };

  // Logs
  logs: {
    timestamp: number;
    level: "debug" | "info" | "warn" | "error";
    message: string;
  }[];

  // Actions
  createConnection: (
    connection: Omit<TypesenseConnection, "id" | "client" | "isConnected">,
  ) => Promise<{ ok: true; id: string } | { ok: false; error: string }>;
  deleteConnection: (id: string) => void;
  updateConnection: (
    id: string,
    connection: Omit<TypesenseConnection, "id" | "client" | "isConnected">,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  setActiveConnection: (id: string) => void;
  testConnection: (
    connection: Omit<TypesenseConnection, "id" | "client" | "isConnected">,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  addLog: (level: "debug" | "info" | "warn" | "error", message: string) => void;
  fetchCollections: () => Promise<void>;
}

export const useTypesenseStore = create<TypesenseState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        logs: [],

        // Connections
        connections: [],
        activeConnectionId: null,

        // Collections
        collections: {
          data: [],
          isLoading: false,
          error: null,
        },

        // Actions

        initializeConnections: async () => {
          const connections = get().connections;

          for (const connection of connections) {
            const client = createTypesenseClient(connection, {
              onLog: get().addLog,
            });

            connection.client = client;
            connection.isConnected = get().testConnection(connection)
              .then(({ ok }) => ok)
              .catch(() => false);

          }

          set({ connections });
          if (connections.length > 0) get().setActiveConnection(connections[0].id);
        },

        createConnection: async (connection) => {
          const existingConnection = get().connections.find(
            (c) =>
              c.host === connection.host &&
              c.port === connection.port &&
              c.apiKey === connection.apiKey,
          );

          if (existingConnection) {
            return { ok: false, error: "Connection already exists" };
          }

          const newConnection: Partial<TypesenseConnection> = {
            ...connection,
            id: crypto.randomUUID().slice(0, 8),
            isConnected: false,
          };

          try {
            const client = createTypesenseClient(
              {
                host: connection.host,
                port: connection.port,
                protocol: connection.protocol,
                apiKey: connection.apiKey,
              },
              {
                onLog: get().addLog,
              },
            );

            newConnection.client = client;

            const testResult = await get().testConnection(connection);
            if (testResult.ok === false) return testResult;

            newConnection.isConnected = true;
            return { ok: true, id: newConnection.id as string };
          } catch (error) {
            console.error("Failed to connect to Typesense:", error);
            newConnection.isConnected = false;
            return { ok: false, error: "Failed to connect to Typesense" };
          } finally {
            set({
              connections: [
                ...get().connections,
                newConnection as TypesenseConnection,
              ],
            });
          }
        },

        updateConnection: async (id, connection) => {
          const existingConnection = get().connections.find((c) => c.id === id);
          if (!existingConnection) {
            return { ok: false, error: "Connection not found" };
          }

          const updatedConnection: Partial<TypesenseConnection> = {
            ...connection,
            id,
            isConnected: (await get().testConnection(connection)).ok,
          };

          set({
            connections: get().connections.map((c) =>
              c.id === id ? (updatedConnection as TypesenseConnection) : c,
            ),
          });

          return { ok: true };
        },

        deleteConnection: (id) => {
          set({
            connections: get().connections.filter((c) => c.id !== id),
            activeConnectionId:
              get().activeConnectionId === id ? null : get().activeConnectionId,
          });
        },

        setActiveConnection: (id) => {
          const connection = get().connections.find((c) => c.id === id);
          if (connection) {
            set({ activeConnectionId: id });

            if (typeof window !== "undefined") {
              (window as any).typesenseClient = connection.client;
              console.log("Typesense client available at window.typesenseClient");
            }

            // Automatically fetch collections
            get().fetchCollections();
          } else {
            throw new Error("Connection not found");
          }
        },

        testConnection: async (connection) => {
          const client = createTypesenseClient(connection);

          try {
            // Attempt health check by retrieving collections. Note: health.retrieve() doesn't validate API key.
            await client.collections().retrieve();
            return { ok: true };
          } catch (error) {
            console.error("Failed to connect to Typesense:", error);

            let errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            if (errorMessage.includes("api-key"))
              errorMessage = "Invalid API key";

            return { ok: false, error: errorMessage };
          }
        },
        addLog: (level, message) => {
          console[level](message);
          set({
            logs: [
              ...get().logs,
              { timestamp: Date.now(), level, message },
            ].slice(-MAX_LOG_RETENTION),
          });
        },

        // Collections
        fetchCollections: async () => {
          const activeConnection = get().connections.find(
            (c) => c.id === get().activeConnectionId,
          );

          if (!activeConnection) {
            set({
              collections: {
                data: get().collections.data,
                isLoading: false,
                error: "No active connection",
              }
            })

            return;
          }

          set({ collections: { data: [], isLoading: true, error: null } });

          try {
            const collections = await activeConnection.client.collections().retrieve();
            set({ collections: { data: collections, isLoading: false, error: null } });
          } catch (error) {
            set({ collections: { data: get().collections.data, isLoading: false, error: error instanceof Error ? error.message : "Unknown error" } });
          }
        },
      }),
      {
        name: "typesense-connections",
        // Only persist the connections array
        partialize: (state) => ({
          connections: state.connections.map((connection) => ({
            id: connection.id,
            name: connection.name,
            host: connection.host,
            port: connection.port,
            protocol: connection.protocol,
            apiKey: connection.apiKey,
            isConnected: connection.isConnected,
          })),
        }),
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export const useManageConnections = () => {
  const initializeConnections = useTypesenseStore((state) => state.initializeConnections);
  const createConnection = useTypesenseStore((state) => state.createConnection);
  const deleteConnection = useTypesenseStore((state) => state.deleteConnection);
  const updateConnection = useTypesenseStore((state) => state.updateConnection);
  const setActiveConnection = useTypesenseStore(
    (state) => state.setActiveConnection,
  );
  const testConnection = useTypesenseStore((state) => state.testConnection);
  const activeConnectionId = useTypesenseStore(
    (state) => state.activeConnectionId,
  );
  const connections = useTypesenseStore((state) => state.connections);

  // Initialize connections on first mount
  useEffect(() => {
    initializeConnections();
  }, [initializeConnections]);

  const activeConnection = useMemo(() => {
    return connections.find((c) => c.id === activeConnectionId);
  }, [connections, activeConnectionId]);

  return {
    createConnection,
    deleteConnection,
    updateConnection,
    setActiveConnection,
    testConnection,
    activeConnectionId,
    connections,
    activeConnection,
  };
};

export const useActiveConnection = () => {
  const activeConnectionId = useTypesenseStore((state) => state.activeConnectionId);
  const connections = useTypesenseStore((state) => state.connections);

  const activeConnection = useMemo(() => {
    return connections.find((c) => c.id === activeConnectionId);
  }, [connections, activeConnectionId]);

  return {
    client: activeConnection?.client,
    ...activeConnection,
  };
}

export const useLogs = () => {
  const logs = useTypesenseStore((state) => state.logs);

  return {
    logs,
  };
};

export const useCollections = () => {
  const collections = useTypesenseStore((state) => state.collections);
  const fetchCollections = useTypesenseStore((state) => state.fetchCollections);

  return {
    collections: collections.data.sort((a, b) => a.name.localeCompare(b.name)),
    isLoading: collections.isLoading,
    error: collections.error,
    refetch: fetchCollections,
  };
};

export const useCollection = (collectionName: string) => {
  const { collections, refetch } = useCollections();
  const collection = useMemo(() => collections.find((c) => c.name === collectionName), [collections, collectionName]);

  return {
    collection,
    refetch,
  };
};