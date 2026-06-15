'use client'
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
import { usePathname } from 'next/navigation';
import React from 'react';

const AppSidebar = () => {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="">
          <div className="flex items-center justify-between ">
            <SidebarGroupLabel className="text-[2rem] font-semibold group-data-[collapsible=icon]:hidden">
              Dashboard
            </SidebarGroupLabel>
          </div>

          <SidebarGroupContent className="mt-4">
            <SidebarMenu className=" group">
              {navigation?.map(item => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item?.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`gap-3 min-w-12 h-auto px-4 rounded-xl transition-all duration-100 !overflow-visible ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-blue-300' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <Link href={item?.href}>
                        <item.icon className={`!size-6 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                        <span className="text-[1.6rem] font-medium leading-normal tracking-wide pb-0.5">{item?.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
