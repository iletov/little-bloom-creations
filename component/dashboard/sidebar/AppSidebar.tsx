import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const AppSidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="py-6">
      <SidebarContent>
        <SidebarGroup className="">
          {/* Header with Trigger and Label */}
          <div className="flex items-center justify-between mb-6 ">
            <SidebarGroupLabel className="text-[1.8rem] font-semibold group-data-[collapsible=icon]:hidden">
              Application
            </SidebarGroupLabel>
            <SidebarTrigger className="ml-auto" />
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 group">
              {navigation?.map(item => (
                <SidebarMenuItem key={item?.name} className="">
                  <SidebarMenuButton asChild className="gap-3 min-w-12 h-auto">
                    <Link href={item?.href}>
                      <item.icon className="!size-8 shrink-0" />
                      <span className="text-[1.6rem]">{item?.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
