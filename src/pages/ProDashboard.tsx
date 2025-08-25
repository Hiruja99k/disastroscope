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

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
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
    </div>
  );
}


