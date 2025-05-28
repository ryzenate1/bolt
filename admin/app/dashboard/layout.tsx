import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Header } from '@/components/dashboard/header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 border-r bg-card md:block">
        <ScrollArea className="h-full">
          <DashboardNav />
        </ScrollArea>
      </aside>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}