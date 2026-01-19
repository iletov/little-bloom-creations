import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import '../globals.css';
import { createClient } from '@/lib/supabaseServer';
import AppSidebar from '@/component/dashboard/sidebar/AppSidebar';
import { Geist, Monsieur_La_Doulaise } from 'next/font/google';
import QueryProvider from '../(store)/query-provider';
import BackButton from '@/component/dashboard/back-button/BackButton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const monsieurLa = Monsieur_La_Doulaise({
  variable: '--font-monsieur-la-doulaise',
  subsets: ['latin'],
  display: 'swap',
  // You can also specify weight if needed
  weight: ['400'],
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${monsieurLa.variable} antialiased tracking-tight font-sans min-h-screen dark`}>
        <SidebarProvider>
          <QueryProvider>
            <AppSidebar />

            <SidebarInset>
              <SidebarTrigger className="" />
              {children}
            </SidebarInset>
          </QueryProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
