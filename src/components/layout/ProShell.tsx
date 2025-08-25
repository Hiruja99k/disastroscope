import { ReactNode, useMemo, useState } from 'react';
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
import { Activity, Bell, GaugeCircle, Map, Settings, Sparkles, Home, FileText, BellRing } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type ProShellProps = {
  title?: string;
  className?: string;
  rightArea?: ReactNode;
  children: ReactNode;
};

export function ProShell({ title = 'Operations Command', className, rightArea, children }: ProShellProps) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'guest' | 'analyst' | 'admin'>('admin');

  const commands = useMemo(() => [
    'Go to Dashboard',
    'Open Predictions',
    'Show Disasters Map',
    'Open Reports',
    'Open Alerts',
    'Open Settings',
  ], []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as string[];
    return commands.filter(c => c.toLowerCase().includes(q)).slice(0, 6);
  }, [commands, query]);

  return (
    <div className="min-h-svh bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
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
                  <SidebarMenuButton isActive tooltip="Home">
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Predictions">
                    <GaugeCircle />
                    <span>Predictions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Disasters Map">
                    <Map />
                    <span>Disasters Map</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Multi-level: Analytics */}
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <Sparkles />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <div className="ms-8 mt-1 space-y-1 text-muted-foreground text-xs">
                  <div className="flex items-center gap-2"><span className="inline-block w-1 h-1 rounded-full bg-current" /> Executive KPIs</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-1 h-1 rounded-full bg-current" /> Comparative Views</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-1 h-1 rounded-full bg-current" /> Anomaly Reports</div>
                </div>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Reports">
                    <FileText />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Alerts">
                    <BellRing />
                    <span>Alerts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {role === 'admin' && (
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
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
              <div className="relative">
                <Input
                  placeholder="Ask AI or search..."
                  className="w-64"
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <div className="absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md z-20">
                    {suggestions.map((s)=> (
                      <div key={s} className="px-2 py-1.5 text-sm hover:bg-muted/60 cursor-pointer" onClick={()=>setQuery(s)}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
              {/* Role switch (mock RABC) */}
              <select
                aria-label="Role"
                value={role}
                onChange={(e)=>setRole(e.target.value as any)}
                className="text-xs border rounded px-1 py-1 bg-background"
              >
                <option value="guest">Guest</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
              {rightArea}
              <Avatar className="h-7 w-7">
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <div className="p-3 md:p-6">
          <div className={cn('rounded-xl bg-muted/40 p-4 md:p-6 shadow-xl', className)}>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  );
}

export default ProShell;


