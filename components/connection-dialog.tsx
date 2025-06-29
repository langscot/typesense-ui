import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TypesenseConnection } from "@/lib/typesense/client";
import { typesenseConnectionSchema } from "@/lib/typesense/schemas";
import { useManageConnections } from "@/lib/typesense/typesense-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ConnectionDialog({
  children,
  open,
  setOpen,
  mode,
  connection,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
} & (
  | {
      mode: "add";
      connection?: never;
    }
  | {
      mode: "edit";
      connection: TypesenseConnection;
    }
)) {
  const {
    testConnection,
    createConnection,
    updateConnection,
    setActiveConnection,
  } = useManageConnections();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: connection?.name ?? "Localhost",
      host: connection?.host ?? "localhost",
      port: connection?.port ?? 8108,
      protocol: connection?.protocol ?? ("http" as const),
      apiKey: connection?.apiKey ?? "",
    },
    resolver: zodResolver(typesenseConnectionSchema),
  });

  async function onSubmit(values: z.infer<typeof typesenseConnectionSchema>) {
    if (mode === "edit") {
      const result = await updateConnection(connection?.id as string, values);
      if (result.ok) {
        toast.success("Connection successfully updated");
        setActiveConnection(connection.id);
        router.push(`/dashboard`);
      } else if (result.ok === false) {
        toast.error(`Connection failed: ${result.error}`);
        setOpen(false);
      }
    } else {
      const result = await createConnection(values);
      if (result.ok) {
        toast.success("Connection successfully added");
        setActiveConnection(result.id);
        router.push(`/dashboard`);
      } else if (result.ok === false) {
        toast.error(`Connection failed: ${result.error}`);
        setOpen(false);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add connection" : "Edit connection"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new connection to your Typesense instance."
              : "Edit the connection details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name of the connection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-4 items-start gap-4">
              <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Protocol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="https">HTTPS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input placeholder="127.0.0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="8108"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="xyz" {...field} />
                  </FormControl>
                  <FormDescription>
                    You should use an{" "}
                    <a
                      href="https://typesense.org/docs/28.0/api/api-keys.html#create-an-api-key"
                      target="_blank"
                      rel="noopener"
                      className="underline"
                    >
                      admin API key
                    </a>{" "}
                    to benefit from all features.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8">
              <Button
                variant="outline"
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) {
                    const result = await testConnection(form.getValues());
                    if (result.ok) {
                      toast.success("Connection successful");
                    } else {
                      toast.error(`Connection failed: ${result.error}`);
                    }
                  }
                }}
                disabled={form.formState.isSubmitting}
              >
                Test connection
              </Button>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {mode === "add" ? "Add connection" : "Update connection"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
