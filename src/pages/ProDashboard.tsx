import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DisasterMap from '@/components/DisasterMap';
import { apiService, DisasterEvent, Prediction, SensorData } from '@/services/api';
import gsap from 'gsap';
import { BarChart3, Bell, MapPin, RefreshCw, TrendingUp } from 'lucide-react';
import ProShell from '@/components/layout/ProShell';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ProDashboard() {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.out' } });
    if (headerRef.current) {
      tl.from(headerRef.current, { y: 20, opacity: 0 });
    }
  }, []);

  useEffect(() => {
    const asArray = (data: any, key: string) => {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data[key])) return data[key];
      return [] as any[];
    };

    const load = async () => {
      setLoading(true);
      try {
        const [ev, pr] = await Promise.all([
          apiService.getEvents(),
          apiService.getPredictions(),
        ]);
        setEvents(asArray(ev, 'events'));
        setPredictions(asArray(pr, 'predictions'));
        // sensors optional endpoint
        try {
          const resp = await fetch((import.meta.env.VITE_API_BASE_URL || 'https://web-production-47673.up.railway.app').replace(/\/$/, '') + '/api/sensors');
          if (resp.ok) {
            const data = await resp.json();
            setSensors(asArray(data, 'sensors'));
          }
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const criticalEvents = useMemo(() => (events || []).filter(e => (e.severity || '').toLowerCase().includes('critical')), [events]);

  const sales = 12875;
  const projectData = [
    { year: '2014', done: 80, new: 20, late: 10 },
    { year: '2015', done: 120, new: 30, late: 14 },
    { year: '2016', done: 210, new: 40, late: 16 },
    { year: '2017', done: 172, new: 25, late: 12 },
    { year: '2018', done: 165, new: 28, late: 15 },
    { year: '2019', done: 140, new: 18, late: 9 },
    { year: '2020', done: 155, new: 22, late: 11 },
  ];

  const tasksData = [
    { name: 'Late', value: 20, fill: 'hsl(var(--destructive))' },
    { name: 'New', value: 40, fill: 'hsl(var(--primary))' },
    { name: 'In Progress', value: 60, fill: 'hsl(var(--secondary-foreground))' },
    { name: 'Done', value: 80, fill: 'hsl(var(--muted-foreground))' },
  ];

  const ops = Array.from({ length: 5 }).map((_, i) => ({
    id: 1300 + i * 11,
    name: 'Operation text goes here',
    status: [70, 40, 50, 30, 50][i],
    value: [77, 12, 43, 42, 65][i],
  }));

  return (
    <ProShell title="Operations Command">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div ref={headerRef} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Operations Command</h1>
            <p className="text-muted-foreground">Real-time monitoring, prediction, and response</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{events.length} Events</Badge>
            <Badge variant="outline">{predictions.length} Predictions</Badge>
            <Badge variant="outline">{sensors.length} Sensors</Badge>
            <Button variant="outline" size="sm" onClick={() => location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Overall Sales</div>
            <div className="text-4xl font-bold">${sales.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 mt-1">+12% compared to last year</div>
            <div className="mt-4 space-y-2 text-sm">
              {[
                { label: 'March', value: 60 },
                { label: 'April', value: 40 },
                { label: 'May', value: 50 },
                { label: 'June', value: 70 },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className="w-16 text-muted-foreground">{m.label}</div>
                  <div className="flex-1 h-2 rounded bg-muted relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-primary/70" style={{ width: `${m.value}%` }} />
                  </div>
                  <div className="w-10 text-right text-muted-foreground">{m.value}%</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 lg:col-span-1 lg:col-span-1 lg:col-start-2 lg:col-end-4">
            <div className="text-sm text-muted-foreground mb-2">My Projects</div>
            <ChartContainer
              config={{ done: { label: 'Done', color: 'hsl(var(--primary))' }, new: { label: 'New', color: 'hsl(var(--chart-2, 210 98% 50%))' }, late: { label: 'Late', color: 'hsl(var(--destructive))' } }}
              className="aspect-[2.8/1]"
            >
              <BarChart data={projectData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="done" fill="var(--color-done)" radius={[4,4,0,0]} />
                <Bar dataKey="new" fill="var(--color-new)" radius={[4,4,0,0]} />
                <Bar dataKey="late" fill="var(--color-late)" radius={[4,4,0,0]} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">My Tasks</div>
            <ChartContainer config={{ tasks: { label: 'Tasks', color: 'hsl(var(--primary))' } }} className="aspect-square">
              <RadialBarChart innerRadius={40} outerRadius={90} data={tasksData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" background cornerRadius={6} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </RadialBarChart>
            </ChartContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Live Threat Map</h2>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Interactive
              </Badge>
            </div>
            <DisasterMap events={events as any} predictions={predictions as any} height="460px" />
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">System Health</h3>
                <Badge variant="outline">Operational</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>API Uptime</span><span>99.8%</span></div>
                  <Progress value={98} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Data Freshness</span><span>Live</span></div>
                  <Progress value={95} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Prediction Accuracy</span><span>87%</span></div>
                  <Progress value={87} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Critical Alerts</h3>
                <Badge variant="destructive">{criticalEvents.length}</Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(criticalEvents.slice(0,6)).map((e) => (
                  <div key={e.id} className="border rounded p-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{e.event_type} • {e.location}</div>
                      <div className="text-xs text-muted-foreground">severity: {e.severity}</div>
                    </div>
                    <Button size="icon" variant="ghost"><Bell className="h-4 w-4" /></Button>
                  </div>
                ))}
                {criticalEvents.length === 0 && (
                  <div className="text-sm text-muted-foreground">No critical alerts.</div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="sensors">Sensors</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Events</div>
                  <div className="text-2xl font-bold">{events.length}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Active Predictions</div>
                  <div className="text-2xl font-bold flex items-center gap-2">{predictions.length}<TrendingUp className="h-4 w-4 text-primary" /></div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Online Sensors</div>
                  <div className="text-2xl font-bold">{sensors.length}</div>
                </Card>
              </div>
              <div className="mt-6">
                <div className="text-sm font-semibold mb-3">Latest Operations</div>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-64">Status</TableHead>
                        <TableHead className="w-24 text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ops.map(o => (
                        <TableRow key={o.id}>
                          <TableCell>{o.id}</TableCell>
                          <TableCell className="text-muted-foreground">{o.name}</TableCell>
                          <TableCell>
                            <div className="h-2 rounded bg-muted relative overflow-hidden">
                              <div className="absolute left-0 top-0 h-full bg-primary/70" style={{ width: `${o.status}%` }} />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="px-2">{o.value}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="predictions">
              <div className="grid md:grid-cols-2 gap-3">
                {(predictions || []).slice(0,8).map(p => (
                  <Card key={p.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{p.event_type}</div>
                      <Badge variant="outline">{Math.round((p.probability||0)*100)}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{p.location}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sensors">
              <div className="grid md:grid-cols-2 gap-3">
                {(sensors || []).slice(0,8).map(s => (
                  <Card key={s.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{s.station_name || s.id}</div>
                      <Badge variant="outline">{s.sensor_type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{s.location}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </ProShell>
  );
}


