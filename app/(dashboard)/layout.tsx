import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import '../globals.css';
import { createClient } from '@/lib/supabaseServer';
import AppSidebar from '@/component/dashboard/sidebar/AppSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* <Header /> */}
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
