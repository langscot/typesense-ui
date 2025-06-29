import axios from "axios";
import * as Typesense from "typesense";

axios.defaults.validateStatus = (status) => status >= 200 && status <= 500;

export interface TypesenseConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  protocol: "http" | "https";
  client: Typesense.Client;
  apiKey: string;
  isConnected: boolean | Promise<boolean>;
}

export function createTypesenseClient(
  connection: Omit<
    TypesenseConnection,
    "client" | "isConnected" | "id" | "name"
  >,
  handlers?: {
    onLog?: (
      level: "debug" | "info" | "warn" | "error",
      message: string,
    ) => void;
  },
): Typesense.Client {
  return new Typesense.Client({
    nodes: [
      {
        host: connection.host,
        port: connection.port,
        protocol: connection.protocol,
      },
    ],
    apiKey: connection.apiKey,
    axiosAdapter: "fetch",
    connectionTimeoutSeconds: 60 * 60 * 24,
    // Custom logger, so we can persist logs into the store.
    logLevel: "debug",
    logger: handlers
      ? {
        trace: (...msg: unknown[]) =>
          handlers.onLog?.("debug", msg.join(" ")),
        debug: (...msg: unknown[]) =>
          handlers.onLog?.("debug", msg.join(" ")),
        info: (...msg: unknown[]) => handlers.onLog?.("info", msg.join(" ")),
        warn: (...msg: unknown[]) => handlers.onLog?.("warn", msg.join(" ")),
        error: (...msg: unknown[]) =>
          handlers.onLog?.("error", msg.join(" ")),
        log: (...msg: unknown[]) => handlers.onLog?.("info", msg.join(" ")),
        resetLevel: () => { },
        rebuild: () => { },
        setLevel: () => { },
        getLevel: () => 0,
        setDefaultLevel: () => { },
        enableAll: () => { },
        disableAll: () => { },
        levels: {
          TRACE: 0,
          DEBUG: 1,
          INFO: 2,
          WARN: 3,
          ERROR: 4,
          SILENT: 5,
        },
        methodFactory: () => () => { },
      }
      : undefined,
  });
}
