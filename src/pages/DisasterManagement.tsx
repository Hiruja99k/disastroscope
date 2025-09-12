import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  AlertTriangle,
  Users,
  Clock,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Settings,
  Bell,
  FileText,
  Send,
  Archive,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProfessionalDisasterChart from '@/components/charts/ProfessionalDisasterChart';
import MetricCard from '@/components/ui/MetricCard';
import DisasterCard from '@/components/ui/DisasterCard';
import EnhancedSearchFilter from '@/components/ui/EnhancedSearchFilter';
import { disasterManagementServiceV2, DisasterReport, CreateDisasterData } from '@/services/disasterManagementServiceV2';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function DisasterManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterReport | null>(null);
  const [disasters, setDisasters] = useState<DisasterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState({
    status: '',
    severity: '',
    type: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDisasters();
    loadStatistics();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadDisasters = async () => {
    try {
      setLoading(true);
      const response = await disasterManagementServiceV2.getDisasters();
      setDisasters(response.disasters);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading disasters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load disaster reports',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await disasterManagementServiceV2.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadDisasters(), loadStatistics()]);
      toast({
        title: 'Data Refreshed',
        description: 'Disaster data has been updated',
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const [newDisaster, setNewDisaster] = useState<CreateDisasterData>({
    title: '',
    type: '',
    severity: '' as any,
    location: '',
    description: '',
    affected_people: 0,
    estimated_damage: '$0.0M',
    contact_info: { phone: '', email: '' }
  });

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleCreateDisaster = async () => {
    try {
      const disaster = await disasterManagementServiceV2.createDisaster(newDisaster);
      setDisasters([disaster, ...disasters]);
      setNewDisaster({ title: '', type: '', severity: '' as any, location: '', description: '', affected_people: 0, estimated_damage: '$0.0M', contact_info: { phone: '', email: '' } });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Disaster Report Created',
        description: 'New disaster report has been successfully created.'
      });
    } catch (error) {
      console.error('Error creating disaster:', error);
      toast({
        title: 'Error',
        description: 'Failed to create disaster report',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDisaster = async (id: string) => {
    try {
      await disasterManagementServiceV2.deleteDisaster(id);
      setDisasters(disasters.filter(d => d.id !== id));
      toast({
        title: 'Disaster Report Deleted',
        description: 'Disaster report has been successfully removed.'
      });
    } catch (error) {
      console.error('Error deleting disaster:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete disaster report',
        variant: 'destructive'
      });
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? '' : value
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({ status: '', severity: '', type: '' });
  };

  const filteredAndSortedDisasters = React.useMemo(() => {
    let filtered = disasters.filter(disaster => {
    const matchesSearch = disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !activeFilters.status || disaster.status === activeFilters.status;
    const matchesSeverity = !activeFilters.severity || disaster.severity === activeFilters.severity;
    const matchesType = !activeFilters.type || disaster.type === activeFilters.type;

    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'severity':
          const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = (severityOrder[a.severity as keyof typeof severityOrder] || 0) - 
                      (severityOrder[b.severity as keyof typeof severityOrder] || 0);
          break;
        case 'status':
          const statusOrder = { 'Active': 3, 'Warning': 2, 'Resolved': 1 };
          comparison = (statusOrder[a.status as keyof typeof statusOrder] || 0) - 
                      (statusOrder[b.status as keyof typeof statusOrder] || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [disasters, searchTerm, activeFilters, sortBy, sortOrder]);

  const filterOptions = {
    status: [
      { label: 'Active', value: 'Active', count: disasters.filter(d => d.status === 'Active').length },
      { label: 'Warning', value: 'Warning', count: disasters.filter(d => d.status === 'Warning').length },
      { label: 'Resolved', value: 'Resolved', count: disasters.filter(d => d.status === 'Resolved').length }
    ],
    severity: [
      { label: 'High', value: 'High', count: disasters.filter(d => d.severity === 'High').length },
      { label: 'Medium', value: 'Medium', count: disasters.filter(d => d.severity === 'Medium').length },
      { label: 'Low', value: 'Low', count: disasters.filter(d => d.severity === 'Low').length }
    ],
    type: [
      { label: 'Wildfire', value: 'Wildfire', count: disasters.filter(d => d.type === 'Wildfire').length },
      { label: 'Flood', value: 'Flood', count: disasters.filter(d => d.type === 'Flood').length },
      { label: 'Earthquake', value: 'Earthquake', count: disasters.filter(d => d.type === 'Earthquake').length },
      { label: 'Storm', value: 'Storm', count: disasters.filter(d => d.type === 'Storm').length },
      { label: 'Tornado', value: 'Tornado', count: disasters.filter(d => d.type === 'Tornado').length },
      { label: 'Landslide', value: 'Landslide', count: disasters.filter(d => d.type === 'Landslide').length },
      { label: 'Drought', value: 'Drought', count: disasters.filter(d => d.type === 'Drought').length }
    ]
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full border-2 border-background">
                    <div className="w-full h-full bg-destructive rounded-full animate-pulse"></div>
                  </div>
            </div>
            <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Disaster Management
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Real-time monitoring and response</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span>System Online</span>
                    </div>
                    <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                  </div>
            </div>
          </div>
              
              <div className="flex items-center gap-3">
                {/* Auto-refresh toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`${autoRefresh ? 'bg-primary/10 border-primary/30' : ''}`}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                      Auto-refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-refresh every 30 seconds</p>
                  </TooltipContent>
                </Tooltip>

                {/* Manual refresh */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data now</p>
                  </TooltipContent>
                </Tooltip>

                {/* Export button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => {
                      // Export filtered results to CSV
                      const rows = filteredAndSortedDisasters.map(d => ({
                        id: d.id,
                        title: d.title,
                        type: d.type,
                        severity: d.severity,
                        status: d.status,
                        location: d.location,
                        affected_people: d.affected_people,
                        estimated_damage: d.estimated_damage,
                        created_at: d.created_at
                      }));
                      const csv = [
                        Object.keys(rows[0] || { id: '', title: '', type: '', severity: '', status: '', location: '', affected_people: 0, estimated_damage: '', created_at: '' }).join(','),
                        ...rows.map(r => Object.values(r).map(v => typeof v === 'string' ? `"${(v as string).replace(/"/g, '""')}"` : v).join(','))
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'disaster_reports.csv');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export disaster data</p>
                  </TooltipContent>
                </Tooltip>

                {/* Create disaster dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                      <Plus className="h-4 w-4 mr-2" />
                      Report Disaster
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Report New Disaster</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={newDisaster.title}
                          onChange={(e) => setNewDisaster({ ...newDisaster, title: e.target.value })}
                          placeholder="Enter disaster title"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <Select value={newDisaster.type} onValueChange={(value) => setNewDisaster({ ...newDisaster, type: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Wildfire">Wildfire</SelectItem>
                              <SelectItem value="Flood">Flood</SelectItem>
                              <SelectItem value="Earthquake">Earthquake</SelectItem>
                              <SelectItem value="Storm">Storm</SelectItem>
                              <SelectItem value="Tornado">Tornado</SelectItem>
                              <SelectItem value="Landslide">Landslide</SelectItem>
                              <SelectItem value="Drought">Drought</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Severity</label>
                          <Select value={newDisaster.severity} onValueChange={(value) => setNewDisaster({ ...newDisaster, severity: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={newDisaster.location}
                          onChange={(e) => setNewDisaster({ ...newDisaster, location: e.target.value })}
                          placeholder="Enter location"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={newDisaster.description}
                          onChange={(e) => setNewDisaster({ ...newDisaster, description: e.target.value })}
                          placeholder="Describe the disaster situation"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Contact Phone</label>
                          <Input
                            value={newDisaster.contact_info.phone}
                            onChange={(e) => setNewDisaster({ ...newDisaster, contact_info: { ...newDisaster.contact_info, phone: e.target.value } })}
                            placeholder="+1-555-0123"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Contact Email</label>
                          <Input
                            value={newDisaster.contact_info.email}
                            onChange={(e) => setNewDisaster({ ...newDisaster, contact_info: { ...newDisaster.contact_info, email: e.target.value } })}
                            placeholder="contact@example.com"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateDisaster}>Create Report</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>

          {/* Enhanced KPI Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Key Performance Indicators</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last 24 hours</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && (
            <>
              {[0,1,2,3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-9 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </Card>
              ))}
            </>
          )}
              {!loading && (
                <>
          <MetricCard
            title="Active Disasters"
            value={statistics?.active_disasters || disasters.filter(d => d.status === 'Active').length}
            change={{ value: '+2 this week', type: 'increase' }}
            icon={AlertTriangle}
            status="active"
            color="destructive"
            trend={[0.8, 0.6, 0.9, 0.7, 0.8, 0.9, 1.0]}
            delay={0}
          />
          <MetricCard
            title="People Affected"
            value={statistics?.total_affected_people || disasters.reduce((sum, d) => sum + d.affected_people, 0)}
            change={{ value: '+15% this month', type: 'increase' }}
            icon={Users}
            status="warning"
            color="primary"
            trend={[0.6, 0.8, 0.7, 0.9, 0.8, 0.9, 1.0]}
            delay={1}
          />
          <MetricCard
            title="Total Damage"
            value="$3.7M"
            change={{ value: '+8% this month', type: 'increase' }}
            icon={Activity}
            status="warning"
            color="warning"
            trend={[0.5, 0.7, 0.6, 0.8, 0.7, 0.8, 0.9]}
            delay={2}
          />
          <MetricCard
            title="Response Time"
            value="2.3h"
            change={{ value: '-12% improvement', type: 'decrease' }}
            icon={Clock}
            status="resolved"
            color="success"
            trend={[1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]}
            delay={3}
          />
                </>
              )}
            </div>
        </div>

          {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-auto grid-cols-3">
                <TabsTrigger value="overview" className="rounded-md flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
              <TabsTrigger value="disasters" className="rounded-md flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                Reports
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary/20 text-primary px-2 py-0.5 text-xs font-medium">
                    {filteredAndSortedDisasters.length}
                </span>
              </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-md flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Analytics
              </TabsTrigger>
            </TabsList>

              {/* View Controls */}
              {activeTab === 'disasters' && (
                <div className="flex items-center gap-2">
                  {/* Sort controls */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <SortAsc className="h-4 w-4 mr-2" />
                        Sort by {sortBy}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSortBy('date')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Date
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('severity')}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Severity
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('status')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sort order */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>

                  {/* View mode */}
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
          </div>

          <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Disasters */}
                <Card className="p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground flex items-center">
                      <div className="w-3 h-3 bg-destructive rounded-full mr-3 animate-pulse" />
                  Recent Disasters
                </h3>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('disasters')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                <div className="space-y-4">
                  {loading && (
                    <>
                      {[0,1,2].map((i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <Skeleton className="h-5 w-2/3 mb-2" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      ))}
                    </>
                  )}
                    {!loading && disasters.slice(0, 4).map((disaster, index) => (
                      <motion.div 
                        key={disaster.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-card/50 transition-colors"
                      >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          disaster.severity === 'High' ? 'bg-destructive' :
                          disaster.severity === 'Medium' ? 'bg-warning' : 'bg-success'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">{disaster.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{disaster.location}</span>
                              <span>•</span>
                              <span>{new Date(disaster.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                      <Badge variant={disaster.severity === 'High' ? 'destructive' : disaster.severity === 'Medium' ? 'secondary' : 'outline'}>
                        {disaster.severity}
                      </Badge>
                          <Badge variant={disaster.status === 'Active' ? 'destructive' : disaster.status === 'Warning' ? 'secondary' : 'outline'}>
                            {disaster.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">High Priority</span>
                      <span className="font-semibold text-destructive">
                        {disasters.filter(d => d.severity === 'High').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Cases</span>
                      <span className="font-semibold text-warning">
                        {disasters.filter(d => d.status === 'Active').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Resolved</span>
                      <span className="font-semibold text-success">
                        {disasters.filter(d => d.status === 'Resolved').length}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Affected</span>
                      <span className="font-semibold text-primary">
                        {disasters.reduce((sum, d) => sum + d.affected_people, 0).toLocaleString()}
                      </span>
                    </div>
                </div>
              </Card>
              </div>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                {loading ? (
                  <>
                    <Skeleton className="h-6 w-56 mb-4" />
                    <Skeleton className="h-72 w-full" />
                  </>
                ) : (
                  <ProfessionalDisasterChart
                    type="area"
                    data={[
                      { name: 'Wildfire', value: disasters.filter(d => d.type === 'Wildfire').length },
                      { name: 'Flood', value: disasters.filter(d => d.type === 'Flood').length },
                      { name: 'Earthquake', value: disasters.filter(d => d.type === 'Earthquake').length },
                      { name: 'Storm', value: disasters.filter(d => d.type === 'Storm').length },
                      { name: 'Tornado', value: disasters.filter(d => d.type === 'Tornado').length },
                      { name: 'Landslide', value: disasters.filter(d => d.type === 'Landslide').length }
                    ]}
                    title="Disaster Type Distribution"
                    height={300}
                    showLegend={true}
                    showTooltip={true}
                  />
                )}
              </Card>
                <Card className="p-6">
                  {loading ? (
                    <>
                      <Skeleton className="h-6 w-56 mb-4" />
                      <Skeleton className="h-72 w-full" />
                    </>
                  ) : (
                    <ProfessionalDisasterChart
                      type="clustered"
                      data={[
                        { name: 'Jan', value: 12, secondary: 8, tertiary: 5 },
                        { name: 'Feb', value: 8, secondary: 6, tertiary: 3 },
                        { name: 'Mar', value: 15, secondary: 10, tertiary: 7 },
                        { name: 'Apr', value: 10, secondary: 7, tertiary: 4 },
                        { name: 'May', value: 18, secondary: 12, tertiary: 9 },
                        { name: 'Jun', value: 14, secondary: 9, tertiary: 6 }
                      ]}
                      title="Monthly Disaster Trends"
                      height={300}
                      showLegend={true}
                      showTooltip={true}
                    />
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="disasters" className="space-y-6">
            <EnhancedSearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredAndSortedDisasters.length} of {disasters.length} disasters
                  </span>
                  {Object.values(activeFilters).some(Boolean) && (
                    <Badge variant="secondary" className="text-xs">
                      Filtered
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Sort by {sortBy} ({sortOrder})</span>
                </div>
              </div>

              {/* Disasters Grid/List */}
              {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {!loading && filteredAndSortedDisasters.map((disaster, index) => (
                <DisasterCard
                  key={disaster.id}
                  disaster={disaster}
                  index={index}
                  onView={(d) => setSelectedDisaster(d)}
                  onEdit={(d) => setSelectedDisaster(d)}
                  onDelete={() => handleDeleteDisaster(disaster.id)}
                />
              ))}
              {loading && (
                <>
                      {[0,1,2,3,4,5].map((i) => (
                    <Card key={i} className="p-4">
                      <Skeleton className="h-5 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-28 w-full mt-3" />
                    </Card>
                  ))}
                </>
              )}
            </div>
              ) : (
                <div className="space-y-4">
                  {!loading && filteredAndSortedDisasters.map((disaster, index) => (
                    <motion.div
                      key={disaster.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${
                              disaster.severity === 'High' ? 'bg-destructive' :
                              disaster.severity === 'Medium' ? 'bg-warning' : 'bg-success'
                            }`} />
                            <div>
                              <h3 className="font-semibold text-foreground">{disaster.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {disaster.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(disaster.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {disaster.affected_people.toLocaleString()} affected
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={disaster.severity === 'High' ? 'destructive' : disaster.severity === 'Medium' ? 'secondary' : 'outline'}>
                              {disaster.severity}
                            </Badge>
                            <Badge variant={disaster.status === 'Active' ? 'destructive' : disaster.status === 'Warning' ? 'secondary' : 'outline'}>
                              {disaster.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setSelectedDisaster(disaster)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedDisaster(disaster)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteDisaster(disaster.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  {loading && (
                    <>
                      {[0,1,2,3].map((i) => (
                        <Card key={i} className="p-6">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              )}

              {filteredAndSortedDisasters.length === 0 && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center py-12"
                >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No disasters found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
              </motion.div>
            )}
          </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Response Time Analysis
                  </h3>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <ProfessionalDisasterChart
                      type="line"
                      data={[
                        { name: 'Week 1', value: 2.5 },
                        { name: 'Week 2', value: 2.1 },
                        { name: 'Week 3', value: 1.8 },
                        { name: 'Week 4', value: 2.3 },
                        { name: 'Week 5', value: 1.9 },
                        { name: 'Week 6', value: 2.0 }
                      ]}
                      title="Average Response Time (hours)"
                      height={250}
                      showLegend={false}
                      showTooltip={true}
                    />
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Severity Distribution
                  </h3>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <ProfessionalDisasterChart
                      type="clustered"
                      data={[
                        { name: 'High', value: disasters.filter(d => d.severity === 'High').length, secondary: disasters.filter(d => d.severity === 'High' && d.status === 'Active').length, tertiary: disasters.filter(d => d.severity === 'High' && d.status === 'Warning').length },
                        { name: 'Medium', value: disasters.filter(d => d.severity === 'Medium').length, secondary: disasters.filter(d => d.severity === 'Medium' && d.status === 'Active').length, tertiary: disasters.filter(d => d.severity === 'Medium' && d.status === 'Warning').length },
                        { name: 'Low', value: disasters.filter(d => d.severity === 'Low').length, secondary: disasters.filter(d => d.severity === 'Low' && d.status === 'Active').length, tertiary: disasters.filter(d => d.severity === 'Low' && d.status === 'Warning').length }
                      ]}
                      title="Disasters by Severity"
                      height={250}
                      showLegend={true}
                      showTooltip={true}
                    />
                  )}
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Rate</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resolution Rate</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Geographic Coverage</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Regions</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monitored Areas</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Alert Zones</span>
                      <span className="font-semibold">8</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Data Feed</span>
                      </div>
                      <span className="text-xs text-success">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">AI Models</span>
                      </div>
                      <span className="text-xs text-success">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span className="text-sm">Notifications</span>
                      </div>
                      <span className="text-xs text-warning">Limited</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedDisaster} onOpenChange={(open) => { if (!open) setSelectedDisaster(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selectedDisaster && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedDisaster.title}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <Badge variant={selectedDisaster.severity === 'High' ? 'destructive' : selectedDisaster.severity === 'Medium' ? 'secondary' : 'outline'}>
                      {selectedDisaster.severity}
                    </Badge>
                    <Badge variant={selectedDisaster.status === 'Active' ? 'destructive' : selectedDisaster.status === 'Warning' ? 'secondary' : 'outline'}>
                      {selectedDisaster.status}
                    </Badge>
                    <span>{selectedDisaster.type}</span>
                    <span>•</span>
                    <span>{selectedDisaster.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/90">{selectedDisaster.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Affected Population</div>
                  <div className="text-lg font-semibold">{selectedDisaster.affected_people.toLocaleString()}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Estimated Economic Impact</div>
                  <div className="text-lg font-semibold">{selectedDisaster.estimated_damage}</div>
                </Card>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Operational Updates</h4>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {selectedDisaster.updates?.map((u, i) => (
                    <div key={i} className="text-sm p-2 border rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{u.author}</span>
                        <span className="text-muted-foreground">{new Date(u.timestamp).toLocaleString()}</span>
                      </div>
                      <div>{u.message}</div>
                    </div>
                  ))}
                  {(!selectedDisaster.updates || selectedDisaster.updates.length === 0) && (
                    <div className="text-sm text-muted-foreground">No updates yet.</div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedDisaster(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}