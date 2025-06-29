import { Breadcrumb, BreadcrumbList } from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

export function AppPage({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
}) {
  return (
    <main className="p-4">
      <div className="flex flex-row gap-4 items-center">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </main>
  );
}
