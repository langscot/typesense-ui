"use client";

import { AppPage } from "@/components/app-page";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collectionName } = useParams<{ collectionName: string }>();

  return (
    <AppPage
      breadcrumbs={
        <>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{collectionName}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      }
    >
      {children}
    </AppPage>
  );
}
