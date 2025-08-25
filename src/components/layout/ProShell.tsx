import { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Activity, Bell, GaugeCircle, Map, Sparkles } from 'lucide-react';

type ProShellProps = {
  title?: string;
  className?: string;
  rightArea?: ReactNode;
  children: ReactNode;
};

export function ProShell({ title = 'Operations Command', className, rightArea, children }: ProShellProps) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-semibold">DisastroScope</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <GaugeCircle />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Map">
                    <Map />
                    <span>Map</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Models">
                    <Sparkles />
                    <span>Models</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Status">
                    <Activity />
                    <span>Status</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="px-2">
            <Badge variant="outline" className="w-full justify-center">Enterprise</Badge>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-3 px-4">
            <SidebarTrigger />
            <div className="font-semibold tracking-tight">{title}</div>
            <div className="ml-auto flex items-center gap-2">
              <Input placeholder="Search" className="w-56" />
              <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
              {rightArea}
            </div>
          </div>
        </header>
        <div className={cn('p-4 md:p-6', className)}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ProShell;


