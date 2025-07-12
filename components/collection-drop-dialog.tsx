import { useCollections } from "@/lib/typesense/typesense-store";
import { useState } from "react";
import { toast } from "sonner";
import type { CollectionSchema } from "typesense/lib/Typesense/Collection";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function CollectionDropDialog({
  collection,
  children,
}: {
  collection: CollectionSchema;
  children: React.ReactNode;
}) {
  const [confirmText, setConfirmText] = useState("");
  const { deleteCollection } = useCollections();

  const onDelete = async () => {
    const success = await deleteCollection(collection.name);
    if (success) {
      toast.success("Collection deleted");
    } else {
      toast.error("Failed to delete collection");
    }
  };

  return (
    <Dialog>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Drop collection "{collection.name}"</DialogTitle>
          <DialogDescription>
            This will delete all {collection.num_documents} document
            {collection.num_documents === 1 ? "" : "s"} in your collection. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Type "{collection.name}" below to confirm deletion.</Label>
          <Input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={onDelete}
              disabled={confirmText !== collection.name}
              type="submit"
            >
              Yes, drop.
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
