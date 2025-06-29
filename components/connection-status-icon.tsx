import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import type { TypesenseConnection } from "@/lib/typesense/client";

export function ConnectionStatusIcon({
  connection,
}: {
  connection: TypesenseConnection;
}) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof connection.isConnected === "boolean") {
      setIsConnected(connection.isConnected);
    } else if (connection.isConnected instanceof Promise) {
      connection.isConnected.then(setIsConnected);
    }
  }, [connection.isConnected]);

  if (isConnected === null) {
    return (
      <Activity className="text-muted-foreground animate-pulse" size={16} />
    );
  }

  return (
    <Activity
      className={isConnected ? "text-green-500" : "text-red-500"}
      size={16}
    />
  );
}
