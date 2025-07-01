import { Eye } from "lucide-react";
import type { FieldType } from "typesense/lib/Typesense/Collection";
import { Code } from "./code";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function DataTableCellExplorer({
  title,
  value,
  type,
  children,
}: {
  title: string;
  value: string | string[];
  type: FieldType;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <div className="flex items-center gap-2">
        {children}
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Eye size={16} />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {Array.isArray(value) ? (
          <Accordion type="multiple">
            {value.map((item, index) => (
              <AccordionItem
                key={`${JSON.stringify(item)}-${index}`}
                value={`item-${index}`}
              >
                <AccordionTrigger>Index {index}</AccordionTrigger>
                <AccordionContent>
                  <Code content={item} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div>{value}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
