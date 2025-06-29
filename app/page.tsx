"use client";

import { ConnectionDialog } from "@/components/connection-dialog";
import { ConnectionStatusIcon } from "@/components/connection-status-icon";
import { Button } from "@/components/ui/button";
import { useManageConnections } from "@/lib/typesense/typesense-store";
import { Pencil, Trash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [addConnectionDialogOpen, setAddConnectionDialogOpen] = useState(false);
  const [editConnectionDialogOpen, setEditConnectionDialogOpen] = useState<
    string[]
  >([]);
  const router = useRouter();
  const { deleteConnection, setActiveConnection, connections } =
    useManageConnections();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <AnimatePresence>
        <main className="flex flex-col row-start-2 items-center sm:items-start max-w-2xl">
          {connections.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-bold">Get started</h1>
              <p className="text-muted-foreground mt-4">
                To get started, connect to your Typesense instance. All
                connections are made in your browser.{" "}
              </p>
            </motion.div>
          )}

          {connections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full"
            >
              <h1 className="text-2xl font-bold">Connections</h1>
              <ConnectionDialog
                open={addConnectionDialogOpen}
                setOpen={setAddConnectionDialogOpen}
                mode="add"
              >
                <Button>Add connection</Button>
              </ConnectionDialog>
            </motion.div>
          )}

          {connections.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="flex items-center justify-center border rounded-md border-dashed border-primary w-full p-8 my-8"
            >
              <ConnectionDialog
                open={addConnectionDialogOpen}
                setOpen={setAddConnectionDialogOpen}
                mode="add"
              >
                <Button size="lg">Add connection</Button>
              </ConnectionDialog>
            </motion.div>
          )}

          {connections.length > 0 && (
            <ul className="flex flex-col gap-4 my-8 w-full">
              {connections.map((connection) => (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                  key={connection.id}
                  className="flex items-center gap-2"
                >
                  <button
                    key={connection.id}
                    type="button"
                    onClick={() => {
                      router.push(`/dashboard`);
                      setActiveConnection(connection.id);
                    }}
                    className="flex-1 text-foreground px-4 py-2 rounded-md bg-muted/50 flex justify-between items-center hover:bg-muted"
                  >
                    <span>{connection.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {connection.protocol}://{connection.host}:
                        {connection.port}
                      </span>
                      <ConnectionStatusIcon connection={connection} />
                    </div>
                  </button>

                  <div className="flex items-center bg-muted/50 rounded-md py-0.5">
                    <ConnectionDialog
                      open={editConnectionDialogOpen.includes(connection.id)}
                      setOpen={(open) =>
                        setEditConnectionDialogOpen(
                          open
                            ? [...editConnectionDialogOpen, connection.id]
                            : editConnectionDialogOpen.filter(
                                (id) => id !== connection.id,
                              ),
                        )
                      }
                      mode="edit"
                      connection={connection}
                    >
                      <Button variant="ghost" size="icon">
                        <Pencil className="text-muted-foreground" size={16} />
                      </Button>
                    </ConnectionDialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteConnection(connection.id)}
                    >
                      <Trash className="text-muted-foreground" size={16} />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="text-foreground mt-4"
          >
            <strong>
              Your data and connection details remain private and are never
              transmitted to our servers.
            </strong>
          </motion.p>

          <motion.footer
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.4 }}
            className="flex justify-between items-center w-full mt-8 text-sm text-muted-foreground"
          >
            <span>Not affiliated with Typesense.</span>
            <a
              href="https://typesense.org/about?utm_source=typesense-ui"
              target="_blank"
              rel="noopener"
              className="hover:underline"
            >
              What is Typesense?
            </a>
          </motion.footer>
        </main>
      </AnimatePresence>
    </div>
  );
}
