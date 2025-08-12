import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  FileText, 
  Image, 
  Map as MapIcon, 
  Database, 
  FileSpreadsheet,
  FileImage,
  Globe,
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
import { useDisasterEvents, usePredictions, useSensorData } from '@/hooks/useMockData';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

interface ExportManagerProps {
  isOpen: boolean;
  onClose: () => void;
  mapRef?: React.RefObject<HTMLDivElement>;
}

type ExportFormat = 'csv' | 'pdf' | 'geojson' | 'png' | 'excel' | 'kml';
type DataType = 'events' | 'predictions' | 'sensors' | 'historical' | 'all';

interface ExportOptions {
  format: ExportFormat;
  dataType: DataType;
  includeMap: boolean;
  includeStats: boolean;
  includeTimestamp: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  severityFilter: string[];
  locationFilter: string;
}

export default function ExportManager({ isOpen, onClose, mapRef }: ExportManagerProps) {
  const { events } = useDisasterEvents();
  const { predictions } = usePredictions();
  const { sensorData } = useSensorData();
  
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dataType: 'events',
    includeMap: false,
    includeStats: true,
    includeTimestamp: true,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    severityFilter: [],
    locationFilter: ''
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const formatOptions = [
    { value: 'csv', label: 'CSV Spreadsheet', icon: FileSpreadsheet, description: 'Comma-separated values for Excel/Sheets' },
    { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Professional formatted report' },
    { value: 'geojson', label: 'GeoJSON', icon: Globe, description: 'Geographic data for GIS applications' },
    { value: 'png', label: 'PNG Image', icon: FileImage, description: 'High-resolution map image' },
    { value: 'kml', label: 'KML File', icon: MapIcon, description: 'Google Earth compatible format' }
  ];

  const dataTypeOptions = [
    { value: 'events', label: 'Disaster Events', count: events.length },
    { value: 'predictions', label: 'AI Predictions', count: predictions.length },
    { value: 'sensors', label: 'Sensor Data', count: sensorData.length },
    { value: 'all', label: 'All Data', count: events.length + predictions.length + sensorData.length }
  ];

  const severityOptions = ['Critical', 'High', 'Major', 'Moderate', 'Minor', 'Low'];

  const updateOptions = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const getFilteredData = () => {
    let data: any[] = [];
    
    switch (exportOptions.dataType) {
      case 'events':
        data = events;
        break;
      case 'predictions':
        data = predictions;
        break;
      case 'sensors':
        data = sensorData;
        break;
      case 'all':
        data = [
          ...events.map(e => ({ ...e, dataType: 'event' })),
          ...predictions.map(p => ({ ...p, dataType: 'prediction' })),
          ...sensorData.map(s => ({ ...s, dataType: 'sensor' }))
        ];
        break;
    }

    // Apply filters
    if (exportOptions.severityFilter.length > 0) {
      data = data.filter(item => {
        const severity = item.severity || item.severity_level;
        return severity && exportOptions.severityFilter.some(filter => 
          severity.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }

    if (exportOptions.locationFilter) {
      data = data.filter(item => 
        item.location?.toLowerCase().includes(exportOptions.locationFilter.toLowerCase())
      );
    }

    // Apply date range
    data = data.filter(item => {
      const itemDate = new Date(item.created_at || item.reading_time || item.timeframe_start);
      const startDate = new Date(exportOptions.dateRange.start);
      const endDate = new Date(exportOptions.dateRange.end);
      return itemDate >= startDate && itemDate <= endDate;
    });

    return data;
  };

  const exportToCSV = (data: any[]) => {
    const csv = Papa.unparse(data, {
      header: true,
      columns: Object.keys(data[0] || {}).filter(key => 
        !['coordinates', 'metadata', 'details'].includes(key)
      )
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `disaster-data-${exportOptions.dataType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToGeoJSON = (data: any[]) => {
    const features = data
      .filter(item => item.coordinates)
      .map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.coordinates.lng, item.coordinates.lat]
        },
        properties: {
          ...item,
          coordinates: undefined
        }
      }));

    const geoJSON = {
      type: 'FeatureCollection',
      features
    };

    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: 'application/geo+json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `disaster-data-${exportOptions.dataType}-${new Date().toISOString().split('T')[0]}.geojson`;
    link.click();
  };

  const exportToKML = (data: any[]) => {
    const kmlFeatures = data
      .filter(item => item.coordinates)
      .map(item => {
        const name = item.name || `${item.prediction_type || item.event_type || item.sensor_type} - ${item.location}`;
        const description = `
          <![CDATA[
            <div>
              <h3>${name}</h3>
              <p><strong>Type:</strong> ${item.event_type || item.prediction_type || item.sensor_type}</p>
              <p><strong>Location:</strong> ${item.location}</p>
              ${item.severity ? `<p><strong>Severity:</strong> ${item.severity}</p>` : ''}
              ${item.probability ? `<p><strong>Probability:</strong> ${item.probability}%</p>` : ''}
              ${item.confidence_score ? `<p><strong>Confidence:</strong> ${item.confidence_score}%</p>` : ''}
              <p><strong>Date:</strong> ${new Date(item.created_at || item.reading_time || item.timeframe_start).toLocaleDateString()}</p>
            </div>
          ]]>
        `;

        return `
          <Placemark>
            <name>${name}</name>
            <description>${description}</description>
            <Point>
              <coordinates>${item.coordinates.lng},${item.coordinates.lat},0</coordinates>
            </Point>
          </Placemark>
        `;
      }).join('');

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Disaster Data Export</name>
    <description>Generated on ${new Date().toISOString()}</description>
    ${kmlFeatures}
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `disaster-data-${exportOptions.dataType}-${new Date().toISOString().split('T')[0]}.kml`;
    link.click();
  };

  const exportToPDF = async (data: any[]) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Title
    pdf.setFontSize(20);
    pdf.text('Disaster Monitoring Report', 20, yPosition);
    yPosition += 15;

    // Metadata
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Data Type: ${exportOptions.dataType.toUpperCase()}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Records: ${data.length}`, 20, yPosition);
    yPosition += 20;

    // Statistics if enabled
    if (exportOptions.includeStats) {
      pdf.setFontSize(16);
      pdf.text('Summary Statistics', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      const stats = {
        'Total Records': data.length,
        'Critical Events': data.filter(d => d.severity?.toLowerCase().includes('critical')).length,
        'High Priority': data.filter(d => d.severity?.toLowerCase().includes('high')).length,
        'Active Status': data.filter(d => d.status === 'active').length
      };

      Object.entries(stats).forEach(([key, value]) => {
        pdf.text(`${key}: ${value}`, 20, yPosition);
        yPosition += 7;
      });
      yPosition += 10;
    }

    // Map if enabled and available
    if (exportOptions.includeMap && mapRef?.current) {
      try {
        const canvas = await html2canvas(mapRef.current, {
          useCORS: true,
          allowTaint: true,
          scale: 0.5
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Threat Map', 20, 20);
        pdf.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);
      } catch (error) {
        console.error('Failed to capture map:', error);
      }
    }

    // Data table
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Detailed Data', 20, 20);
    
    const tableData = data.slice(0, 50).map(item => [
      item.name || item.prediction_type || item.sensor_type || 'N/A',
      item.location || 'N/A',
      item.severity || item.severity_level || 'N/A',
      item.status || 'N/A',
      new Date(item.created_at || item.reading_time || item.timeframe_start).toLocaleDateString()
    ]);

    // Simple table implementation
    pdf.setFontSize(8);
    yPosition = 40;
    
    // Headers
    const headers = ['Name', 'Location', 'Severity', 'Status', 'Date'];
    const colWidths = [40, 35, 25, 25, 25];
    let xPosition = 20;
    
    headers.forEach((header, i) => {
      pdf.text(header, xPosition, yPosition);
      xPosition += colWidths[i];
    });
    yPosition += 10;

    // Data rows
    tableData.forEach(row => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      xPosition = 20;
      row.forEach((cell, i) => {
        pdf.text(String(cell).substring(0, 15), xPosition, yPosition);
        xPosition += colWidths[i];
      });
      yPosition += 7;
    });

    pdf.save(`disaster-report-${exportOptions.dataType}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportMapImage = async () => {
    if (!mapRef?.current) {
      toast.error('Map not available for export');
      return;
    }

    try {
      const canvas = await html2canvas(mapRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `disaster-map-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Map export failed:', error);
      toast.error('Failed to export map image');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const data = getFilteredData();
      
      if (data.length === 0) {
        toast.error('No data matches the current filters');
        return;
      }

      setExportProgress(25);

      switch (exportOptions.format) {
        case 'csv':
          exportToCSV(data);
          break;
        case 'pdf':
          await exportToPDF(data);
          break;
        case 'geojson':
          exportToGeoJSON(data);
          break;
        case 'png':
          await exportMapImage();
          break;
        case 'kml':
          exportToKML(data);
          break;
      }

      setExportProgress(100);
      toast.success(`Successfully exported ${data.length} records as ${exportOptions.format.toUpperCase()}`);
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Export Data</h2>
              <p className="text-muted-foreground">Generate reports and export disaster monitoring data</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Export Format Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Export Format</Label>
                <p className="text-sm text-muted-foreground mb-3">Choose your preferred file format</p>
                <div className="space-y-2">
                  {formatOptions.map(option => (
                    <div
                      key={option.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        exportOptions.format === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => updateOptions('format', option.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Type Selection */}
              <div>
                <Label className="text-base font-semibold">Data Type</Label>
                <p className="text-sm text-muted-foreground mb-3">Select which data to export</p>
                <Select value={exportOptions.dataType} onValueChange={(value: DataType) => updateOptions('dataType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          <Badge variant="secondary" className="ml-2">
                            {option.count}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filters and Options */}
            <div className="space-y-4">
              {/* Date Range */}
              <div>
                <Label className="text-base font-semibold">Date Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Input
                      type="date"
                      value={exportOptions.dateRange.start}
                      onChange={(e) => updateOptions('dateRange', { ...exportOptions.dateRange, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input
                      type="date"
                      value={exportOptions.dateRange.end}
                      onChange={(e) => updateOptions('dateRange', { ...exportOptions.dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Severity Filter */}
              <div>
                <Label className="text-base font-semibold">Severity Filter</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {severityOptions.map(severity => (
                    <div key={severity} className="flex items-center space-x-2">
                      <Checkbox
                        id={severity}
                        checked={exportOptions.severityFilter.includes(severity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateOptions('severityFilter', [...exportOptions.severityFilter, severity]);
                          } else {
                            updateOptions('severityFilter', exportOptions.severityFilter.filter(s => s !== severity));
                          }
                        }}
                      />
                      <Label htmlFor={severity} className="text-sm">{severity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <Label className="text-base font-semibold">Location Filter</Label>
                <Input
                  placeholder="Filter by location..."
                  value={exportOptions.locationFilter}
                  onChange={(e) => updateOptions('locationFilter', e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Export Options */}
              <div>
                <Label className="text-base font-semibold">Export Options</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeMap"
                      checked={exportOptions.includeMap}
                      onCheckedChange={(checked) => updateOptions('includeMap', checked)}
                    />
                    <Label htmlFor="includeMap" className="text-sm">Include map visualization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeStats"
                      checked={exportOptions.includeStats}
                      onCheckedChange={(checked) => updateOptions('includeStats', checked)}
                    />
                    <Label htmlFor="includeStats" className="text-sm">Include summary statistics</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeTimestamp"
                      checked={exportOptions.includeTimestamp}
                      onCheckedChange={(checked) => updateOptions('includeTimestamp', checked)}
                    />
                    <Label htmlFor="includeTimestamp" className="text-sm">Include generation timestamp</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <Separator className="my-6" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Export Preview</h3>
              <Badge variant="outline">
                {getFilteredData().length} records
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Data Records</div>
                    <div className="text-sm text-muted-foreground">{getFilteredData().length} items</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Date Range</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(exportOptions.dateRange.start).toLocaleDateString()} - {new Date(exportOptions.dateRange.end).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Active Filters</div>
                    <div className="text-sm text-muted-foreground">
                      {exportOptions.severityFilter.length > 0 || exportOptions.locationFilter ? 
                        `${exportOptions.severityFilter.length + (exportOptions.locationFilter ? 1 : 0)} applied` : 
                        'None'
                      }
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-primary animate-spin" />
                <span className="font-medium">Exporting data...</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting || getFilteredData().length === 0}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : `Export ${exportOptions.format.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}