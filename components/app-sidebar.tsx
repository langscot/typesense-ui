"use client";

import { useCollections } from "@/lib/typesense/typesense-store";
import { ChevronDownIcon, EllipsisVertical, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { CollectionDropDialog } from "./collection-drop-dialog";
import { CollectionSelector } from "./collection-selector";
import { ConnectionSelector } from "./connection-selector";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function AppSidebar() {
  const { collections } = useCollections();
  const { collectionName } = useParams<{ collectionName: string }>();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <ConnectionSelector />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {collectionName ? (
        <CollectionSidebarNav collectionName={collectionName} />
      ) : (
        <SidebarContent>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="hover:bg-sidebar-accent cursor-pointer">
                  Collections
                  <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {collections.map((collection) => (
                      <SidebarMenuItem key={collection.name}>
                        <div className="flex space-x-2">
                          <SidebarMenuButton asChild>
                            <Link
                              href={`/dashboard/${collection.name}`}
                              className="flex justify-between"
                            >
                              {collection.name}
                            </Link>
                          </SidebarMenuButton>
                          <CollectionDropDialog collection={collection}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="px-0 cursor-pointer"
                                >
                                  <EllipsisVertical size={8} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem>
                                    <Trash />
                                    Drop
                                  </DropdownMenuItem>
                                </DialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CollectionDropDialog>
                        </div>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
      )}

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="https://github.com/langscot/typesense-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function CollectionSidebarNav({
  collectionName,
}: {
  collectionName: string;
}) {
  const { collections } = useCollections();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      category: "Documents",
      items: [
        {
          label: "All",
          href: `/dashboard/${collectionName}`,
        },
        // {
        //   label: "Search",
        //   href: `/dashboard/${collectionName}/search`,
        // },
        // {
        //   label: "Import",
        //   href: `/dashboard/${collectionName}/import`,
        // },
      ],
    },
    // {
    //   category: "General",
    //   items: [
    //     {
    //       label: "Schema",
    //       href: `/dashboard/${collectionName}/schema`,
    //     },
    //     {
    //       label: "Synonyms",
    //       href: `/dashboard/${collectionName}/synonyms`,
    //     },
    //     {
    //       label: "Aliases",
    //       href: `/dashboard/${collectionName}/aliases`,
    //     },
    //     {
    //       label: "Overrides",
    //       href: `/dashboard/${collectionName}/overrides`,
    //     },
    //     {
    //       label: "Analytics",
    //       href: `/dashboard/${collectionName}/analytics`,
    //     },
    //   ],
    // },
  ];

  return (
    <SidebarContent>
      <SidebarGroup className="py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <CollectionSelector
              selectedCollectionName={collectionName}
              onSelect={(collectionName) => {
                router.push(`/dashboard/${collectionName}`);
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      {navItems.map((category) => (
        <SidebarGroup key={category.category}>
          <SidebarGroupLabel>{category.category}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {category.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}
