import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, RefreshCw, Download, PieChart, Activity, Thermometer, Wind, Target } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { format, subDays } from 'date-fns';

interface AdvancedChartsProps {
	type: 'trends' | 'analytics';
	data?: any;
}

type ChartKind = 'line' | 'bar' | 'heatmap' | 'stacked';

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ type }) => {
	const [chartType, setChartType] = useState<ChartKind>('line');
	const [timeframeDays, setTimeframeDays] = useState<number>(30);
	const [smooth, setSmooth] = useState<boolean>(true);
	const [showEarthquakes, setShowEarthquakes] = useState<boolean>(true);
	const [showFloods, setShowFloods] = useState<boolean>(true);
	const [showWildfires, setShowWildfires] = useState<boolean>(true);

	const generateTrendData = () => {
		const now = new Date();
		const rows: Array<{ date: string; Earthquakes: number; Floods: number; Wildfires: number }> = [];
		for (let i = timeframeDays; i >= 0; i--) {
			const date = subDays(now, i);
			rows.push({
				date: format(date, 'MMM dd'),
				Earthquakes: Math.floor(Math.random() * 50) + 10,
				Floods: Math.floor(Math.random() * 30) + 5,
				Wildfires: Math.floor(Math.random() * 20) + 2,
			});
		}
		return rows;
	};

	const generateAnalyticsData = () => {
		return [
			{ label: 'Response Time', value: 85 },
			{ label: 'Accuracy', value: 94 },
			{ label: 'Coverage', value: 87 },
			{ label: 'Efficiency', value: 92 },
		];
	};

	const generateHeatmapData = () => {
		const data: { x: string; y: string; value: number }[] = [];
		const regions = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Oceania'];
		const metrics = ['Response Time', 'Accuracy', 'Coverage', 'Efficiency'];
		regions.forEach((region) => {
			metrics.forEach((metric) => {
				data.push({ x: region, y: metric, value: Math.floor(Math.random() * 100) });
			});
		});
		return data;
	};

	const renderChart = () => {
		switch (chartType) {
			case 'line': {
				const rows = generateTrendData();
				const categories = rows.map(r => r.date);
				const series = [
					showEarthquakes ? { name: 'Earthquakes', type: 'column', data: rows.map(r => r.Earthquakes) } : null,
					showFloods ? { name: 'Floods', type: 'area', data: rows.map(r => r.Floods) } : null,
					showWildfires ? { name: 'Wildfires', type: 'line', data: rows.map(r => r.Wildfires) } : null,
				].filter(Boolean) as any[];
				const options: ApexOptions = {
					chart: { type: 'line', stacked: false, toolbar: { show: false } },
					stroke: { curve: smooth ? 'smooth' : 'straight', width: 2 },
					dataLabels: { enabled: false },
					colors: ['#ef4444', '#3b82f6', '#f97316'],
					xaxis: { categories, labels: { rotate: -30 } },
					legend: { position: 'top' },
					fill: { type: ['solid', 'gradient', 'solid'], gradient: { shadeIntensity: 0.3, opacityFrom: 0.4, opacityTo: 0.05 } as any },
					grid: { borderColor: 'rgba(0,0,0,0.1)' },
				};
				return <ReactApexChart key={`apex-${chartType}`} options={options} series={series} type="line" height={330} />;
			}
			case 'bar': {
				const data = [
					{ region: 'North America', earthquakes: 45, floods: 23, wildfires: 12 },
					{ region: 'Europe', earthquakes: 32, floods: 18, wildfires: 8 },
					{ region: 'Asia', earthquakes: 67, floods: 34, wildfires: 15 },
					{ region: 'Africa', earthquakes: 28, floods: 41, wildfires: 6 },
					{ region: 'South America', earthquakes: 38, floods: 29, wildfires: 9 },
					{ region: 'Oceania', earthquakes: 15, floods: 12, wildfires: 4 },
				];
				const options: ApexOptions = {
					chart: { type: 'bar', stacked: false, toolbar: { show: false } },
					plotOptions: { bar: { horizontal: false, columnWidth: '45%' } },
					xaxis: { categories: data.map(d => d.region), labels: { rotate: -30 } },
					colors: ['#ef4444', '#3b82f6', '#f97316'],
					legend: { position: 'top' },
					grid: { borderColor: 'rgba(0,0,0,0.1)' },
				};
				const series = [
					{ name: 'Earthquakes', data: data.map(d => d.earthquakes) },
					{ name: 'Floods', data: data.map(d => d.floods) },
					{ name: 'Wildfires', data: data.map(d => d.wildfires) },
				];
				return <ReactApexChart key={`apex-${chartType}`} options={options} series={series} type="bar" height={300} />;
			}
			case 'heatmap': {
				const d = generateHeatmapData();
				const regions = Array.from(new Set(d.map(x => x.x)));
				const metrics = Array.from(new Set(d.map(x => x.y)));
				const series = metrics.map(metric => ({
					name: metric,
					data: regions.map(region => ({ x: region, y: d.find(row => row.x === region && row.y === metric)?.value || 0 }))
				}));
				const options: ApexOptions = {
					chart: { type: 'heatmap', toolbar: { show: false } },
					dataLabels: { enabled: false },
					plotOptions: {
						heatmap: {
							colorScale: {
								ranges: [
									{ from: 0, to: 20, color: '#e0f2fe' },
									{ from: 21, to: 40, color: '#bfdbfe' },
									{ from: 41, to: 60, color: '#93c5fd' },
									{ from: 61, to: 80, color: '#60a5fa' },
									{ from: 81, to: 100, color: '#3b82f6' },
								]
							}
						}
					}
				};
				return <ReactApexChart key={`apex-${chartType}`} options={options} series={series as any} type="heatmap" height={300} />;
			}
			case 'stacked': {
				const rows = generateTrendData();
				const categories = rows.map(r => r.date);
				const series = [
					{ name: 'Earthquakes', data: rows.map(r => r.Earthquakes) },
					{ name: 'Floods', data: rows.map(r => r.Floods) },
					{ name: 'Wildfires', data: rows.map(r => r.Wildfires) },
				];
				const options: ApexOptions = {
					chart: { type: 'area', stacked: true, toolbar: { show: false } },
					stroke: { curve: smooth ? 'smooth' : 'straight', width: 2 },
					fill: { type: 'gradient', gradient: { shadeIntensity: 0.35, opacityFrom: 0.4, opacityTo: 0.1 } },
					colors: ['#ef4444', '#3b82f6', '#f97316'],
					xaxis: { categories, labels: { rotate: -30 } },
					legend: { position: 'top' },
					grid: { borderColor: 'rgba(0,0,0,0.1)' },
				};
				return <ReactApexChart key={`apex-${chartType}`} options={options} series={series} type="area" height={300} />;
			}
			default:
				return null;
		}
	};

	if (type === 'trends') {
		return (
			<div className="space-y-4">
				<div className="flex flex-wrap gap-3 justify-between items-center">
					<div className="flex items-center gap-2">
						<Button variant={chartType === 'line' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('line')}>
							<LineChart className="h-4 w-4 mr-2" />
							Trends
						</Button>
						<Button variant={chartType === 'bar' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('bar')}>
							<BarChart3 className="h-4 w-4 mr-2" />
							Distribution
						</Button>
						<Button variant={chartType === 'heatmap' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('heatmap')}>
							<BarChart3 className="h-4 w-4 mr-2" />
							Heatmap
						</Button>
						<Button variant={chartType === 'stacked' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('stacked')}>
							<PieChart className="h-4 w-4 mr-2" />
							Stacked Area
						</Button>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<select
							className="text-xs border rounded px-2 py-1"
							value={timeframeDays}
							onChange={(e)=>setTimeframeDays(Number(e.target.value))}
						>
							<option value={7}>7d</option>
							<option value={14}>14d</option>
							<option value={30}>30d</option>
							<option value={60}>60d</option>
						</select>

						<div className="flex items-center gap-2">
							<label className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border bg-white/70 shadow-sm">
								<input type="checkbox" className="accent-blue-600" checked={showEarthquakes} onChange={(e)=>setShowEarthquakes(e.target.checked)} />
								<span>Earthquakes</span>
							</label>
							<label className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border bg-white/70 shadow-sm">
								<input type="checkbox" className="accent-blue-600" checked={showFloods} onChange={(e)=>setShowFloods(e.target.checked)} />
								<span>Floods</span>
							</label>
							<label className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border bg-white/70 shadow-sm">
								<input type="checkbox" className="accent-blue-600" checked={showWildfires} onChange={(e)=>setShowWildfires(e.target.checked)} />
								<span>Wildfires</span>
							</label>
							<label className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border bg-white/70 shadow-sm">
								<input type="checkbox" className="accent-blue-600" checked={smooth} onChange={(e)=>setSmooth(e.target.checked)} />
								<span>Smooth</span>
							</label>
						</div>
						<Button variant="outline" size="sm">
							<Download className="h-4 w-4 mr-2" />
							Export
						</Button>
						<Button variant="outline" size="sm">
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh
						</Button>
					</div>
				</div>
				{renderChart()}
			</div>
		);
	}

	if (type === 'analytics') {
		// helpers
		const categories12 = Array.from({ length: 12 }, (_, i) => `M${i + 1}`);
		const randSeries = (len: number, base = 50, spread = 25) => Array.from({ length: len }, () => Math.max(0, Math.round(base + (Math.random() - 0.5) * spread)));
		const bubbleGrid = (rows: number, cols: number) => Array.from({ length: rows }, (_, r) => ({
			name: `R${r + 1}`,
			data: Array.from({ length: cols }, (_, c) => ({ x: c + 1, y: Math.max(1, Math.round((Math.random() * 10))) }))
		}));

		return (
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* 1) AI-Powered Multi-Hazard Risk Fusion (Layered Heatmap + Radar Hybrid) */}
				<Card>
					<CardHeader>
						<CardTitle>AI-Powered Multi-Hazard Risk Fusion</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div style={{ height: '300px' }}>
								<ReactApexChart
									key="fusion-heatmap"
									options={{
										chart: { type: 'heatmap', toolbar: { show: false } },
										plotOptions: { heatmap: { shadeIntensity: 0.5, colorScale: { ranges: [
											{ from: 0, to: 25, color: '#dcfce7' },
											{ from: 26, to: 50, color: '#fde68a' },
											{ from: 51, to: 75, color: '#fdba74' },
											{ from: 76, to: 100, color: '#fecaca' }
										] } } },
									xaxis: { categories: ['EQ','Flood','Wildfire','Storm','Drought'] },
									dataLabels: { enabled: false },
									legend: { position: 'bottom' }
								} as ApexOptions}
									series={[
										{ name: 'Now', data: [20, 45, 60, 35, 40].map((v, i) => ({ x: ['EQ','Flood','Wildfire','Storm','Drought'][i], y: v })) },
										{ name: '+24h', data: [25, 50, 55, 40, 45].map((v, i) => ({ x: ['EQ','Flood','Wildfire','Storm','Drought'][i], y: v })) }
									] as any}
									type="heatmap"
									height={300}
								/>
							</div>
							<div style={{ height: '300px' }}>
								<ReactApexChart
									key="fusion-bars"
									options={{
										chart: { type: 'bar', stacked: false, toolbar: { show: false } },
										plotOptions: { bar: { columnWidth: '45%' } },
										xaxis: { categories: ['EQ','Flood','Wildfire','Storm','Drought'] },
										legend: { position: 'bottom' }
									} as ApexOptions}
									series={[
										{ name: 'Exposure', data: [30, 60, 55, 45, 35] },
										{ name: 'Vulnerability', data: [20, 40, 65, 35, 25] }
									]}
									type="bar"
									height={300}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 2) Extreme Weather Probability Cone (Fan Line Projection) */}
				<Card>
					<CardHeader>
						<CardTitle>Extreme Weather Probability Cone</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="prob-cone"
								options={{
									chart: { type: 'area', stacked: false, toolbar: { show: false } },
									xaxis: { categories: categories12 },
									stroke: { curve: 'smooth' },
									fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'P90', data: randSeries(12, 70, 10) },
									{ name: 'P50', data: randSeries(12, 55, 10) },
									{ name: 'P10', data: randSeries(12, 40, 10) }
								]}
								type="area"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 3) Compound Event Network (Graph/Sankey Hybrid) */}
				<Card>
					<CardHeader>
						<CardTitle>Compound Event Network</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="compound-network"
								options={{
									chart: { type: 'bar', stacked: true, toolbar: { show: false } },
									plotOptions: { bar: { horizontal: true, barHeight: '65%' } },
									xaxis: { categories: ['EQ→Landslide', 'Storm→Flood', 'Heat→Wildfire', 'Rain→Landslide'] },
									colors: ['#3b82f6','#22c55e','#f59e0b','#ef4444'],
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'Trigger', data: [40, 55, 30, 25] },
									{ name: 'Amplifier', data: [20, 15, 10, 15] },
									{ name: 'Result', data: [35, 45, 50, 40] }
								]}
								type="bar"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 4) Disaster Severity vs. Recovery Curve (Logistic Line Chart) */}
				<Card>
					<CardHeader>
						<CardTitle>Disaster Severity vs. Recovery Curve</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="recovery-curve"
								options={{
									chart: { type: 'line', toolbar: { show: false } },
									xaxis: { categories: Array.from({ length: 24 }, (_, i) => `t${i}`) },
									stroke: { curve: 'smooth', width: 2 },
									yaxis: [{ max: 100, min: 0, title: { text: 'Index' } }],
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'Severity', data: Array.from({ length: 24 }, (_, i) => Math.round(100 / (1 + Math.exp(-(i - 8) / 2)))) },
									{ name: 'Recovery', data: Array.from({ length: 24 }, (_, i) => Math.round(100 / (1 + Math.exp(-(16 - i) / 2)))) }
								]}
								type="line"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 5) Climate Drivers vs. Disaster Onset -> Advanced Area Fusion */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2"><Wind className="h-5 w-5" />Climate Drivers vs. Disaster Onset</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '380px' }}>
							<ReactApexChart
								key="drivers-advanced-area"
								options={{
									chart: { type: 'area', stacked: true, toolbar: { show: false } },
									xaxis: { categories: categories12 },
									stroke: { curve: 'smooth', width: 2 },
									fill: { type: 'gradient', gradient: { shadeIntensity: 0.3, opacityFrom: 0.45, opacityTo: 0.05 } },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'ENSO', data: randSeries(12, 30, 20) },
									{ name: 'SST Anomaly', data: randSeries(12, 20, 20) },
									{ name: 'Storm Count', data: randSeries(12, 25, 25) }
								]}
								type="area"
								height={380}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 6) Hazard Impact Probability Surfaces -> Advanced Stacked Area */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2"><Thermometer className="h-5 w-5" />Hazard Impact Probability Surfaces</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '380px' }}>
							<ReactApexChart
								key="hazard-stacked-area"
								options={{
									chart: { type: 'area', stacked: true, toolbar: { show: false } },
									xaxis: { categories: categories12 },
									stroke: { curve: 'smooth' },
									fill: { type: 'gradient', gradient: { shadeIntensity: 0.35, opacityFrom: 0.5, opacityTo: 0.1 } },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'EQ Impact', data: randSeries(12, 15, 15) },
									{ name: 'Flood Impact', data: randSeries(12, 18, 18) },
									{ name: 'Wildfire Impact', data: randSeries(12, 12, 14) }
								]}
								type="area"
								height={380}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 7) Infrastructure Fragility Spectrum (Horizontal Range Bars) */}
				<Card>
					<CardHeader>
						<CardTitle>Infrastructure Fragility Spectrum</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="fragility-range"
								options={{
									chart: { type: 'rangeBar', toolbar: { show: false } },
									plotOptions: { bar: { horizontal: true, barHeight: '60%' } },
									xaxis: { type: 'numeric' },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[{
									name: 'Fragility Range',
									data: [
										{ x: 'Power Grid', y: [20, 75] },
										{ x: 'Hospitals', y: [30, 65] },
										{ x: 'Roads', y: [10, 55] },
										{ x: 'Bridges', y: [15, 70] }
									]
								}] as any}
								type="rangeBar"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 8) Socio-Economic Vulnerability Profile (Grouped Horizontal Bars) */}
				<Card>
					<CardHeader>
						<CardTitle>Socio-Economic Vulnerability Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="vulnerability-bars"
								options={{
									chart: { type: 'bar', toolbar: { show: false } },
									plotOptions: { bar: { horizontal: true, barHeight: '60%' } },
									xaxis: { categories: ['Income', 'Health', 'Access', 'Density', 'Exposure'] },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'Urban', data: [70, 60, 80, 75, 65] },
									{ name: 'Rural', data: [55, 50, 45, 40, 35] }
								]}
								type="bar"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 9) Disaster Forecast Skill Score (Calibration & Reliability) */}
				<Card>
					<CardHeader>
						<CardTitle>Disaster Forecast Skill Score</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="skill-score"
								options={{
									chart: { type: 'scatter', toolbar: { show: false } },
									xaxis: { title: { text: 'Forecast Probability' }, max: 100 },
									yaxis: { title: { text: 'Observed Frequency' }, max: 100 },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[{
									name: 'Calibration',
									data: Array.from({ length: 20 }, () => [Math.round(Math.random() * 100), Math.round(Math.random() * 100)])
								}]}
								type="scatter"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 10) Critical Threshold Exceedance (Step Area Threshold Chart) */}
				<Card>
					<CardHeader>
						<CardTitle>Critical Threshold Exceedance</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="threshold-step"
								options={{
									chart: { type: 'area', toolbar: { show: false } },
									xaxis: { categories: categories12 },
									annotations: { yaxis: [{ y: 60, borderColor: '#ef4444', label: { text: 'Critical', style: { color: '#fff', background: '#ef4444' } } }] },
									stroke: { curve: 'stepline' as any },
									fill: { opacity: 0.4 }
								} as ApexOptions}
								series={[{ name: 'Index', data: randSeries(12, 55, 25) }]}
								type="area"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 11) Disaster Synchronization & Lag Analysis (Cross-Correlation Heatmap) */}
				<Card>
					<CardHeader>
						<CardTitle>Disaster Synchronization & Lag Analysis</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="lag-heatmap"
								options={{
									chart: { type: 'heatmap', toolbar: { show: false } },
									plotOptions: { heatmap: { colorScale: { ranges: [
										{ from: -1, to: -0.5, color: '#dbeafe' },
										{ from: -0.5, to: 0, color: '#bfdbfe' },
										{ from: 0, to: 0.5, color: '#fecaca' },
										{ from: 0.5, to: 1, color: '#fca5a5' }
									] } } },
									xaxis: { categories: ['-3','-2','-1','0','+1','+2','+3'] },
									dataLabels: { enabled: false }
								} as ApexOptions}
								series={['EQ','Flood','Wildfire'].map(name => ({
									name,
									data: ['-3','-2','-1','0','+1','+2','+3'].map(lag => ({ x: lag, y: Math.round((Math.random() - 0.5) * 200) / 100 }))
								})) as any}
								type="heatmap"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 12) Human Mobility & Evacuation Effectiveness (Flow Approx via stacked bars) */}
				<Card>
					<CardHeader>
						<CardTitle>Human Mobility & Evacuation Effectiveness</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="evac-flow"
								options={{
									chart: { type: 'bar', stacked: true, toolbar: { show: false } },
									plotOptions: { bar: { horizontal: true, barHeight: '60%' } },
									xaxis: { categories: ['Zone A','Zone B','Zone C','Zone D'] },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'Stayed', data: [20, 25, 30, 15] },
									{ name: 'Evacuated', data: [60, 55, 45, 70] },
									{ name: 'Returned', data: [10, 15, 15, 10] }
								]}
								type="bar"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 13) Multi-Scenario Climate Stress Test (Scenario Comparison Chart) */}
				<Card>
					<CardHeader>
						<CardTitle>Multi-Scenario Climate Stress Test</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="scenario-compare"
								options={{
									chart: { type: 'line', toolbar: { show: false } },
									xaxis: { categories: categories12 },
									stroke: { curve: 'smooth', width: 2 },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'Scenario A', data: randSeries(12, 40, 15) },
									{ name: 'Scenario B', data: randSeries(12, 55, 15) },
									{ name: 'Scenario C', data: randSeries(12, 65, 15) }
								]}
								type="line"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 14) Real-Time Crisis Dashboard (Large Composite Timeline) */}
				<Card>
					<CardHeader>
						<CardTitle>Real-Time Crisis Dashboard</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '420px' }}>
							<ReactApexChart
								key="crisis-composite"
								options={{
									chart: { type: 'line', stacked: false, toolbar: { show: false } },
									xaxis: { categories: Array.from({ length: 36 }, (_, i) => `t${i}`) },
									stroke: { curve: 'smooth', width: 2 },
									fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
									legend: { position: 'bottom' },
									annotations: { yaxis: [{ y: 80, borderColor: '#f59e0b', label: { text: 'Alert Threshold', style: { color: '#000', background: '#fbbf24' } } }] }
								} as ApexOptions}
								series={[
									{ name: 'Alerts', type: 'area', data: randSeries(36, 40, 30) },
									{ name: 'Incidents', type: 'area', data: randSeries(36, 30, 25) },
									{ name: 'Latency (ms)', type: 'line', data: randSeries(36, 70, 20) }
								] as any}
								type="line"
								height={420}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 15) Cumulative Multi-Hazard Damage Index (Stacked Area + Regression) */}
				<Card>
					<CardHeader>
						<CardTitle>Cumulative Multi-Hazard Damage Index</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '300px' }}>
							<ReactApexChart
								key="damage-index"
								options={{
									chart: { type: 'area', stacked: true, toolbar: { show: false } },
									xaxis: { categories: categories12 },
									dataLabels: { enabled: false },
									stroke: { curve: 'smooth' },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'EQ', data: randSeries(12, 10, 10) },
									{ name: 'Flood', data: randSeries(12, 15, 10) },
									{ name: 'Wildfire', data: randSeries(12, 12, 10) },
									{ name: 'Regression', type: 'line', data: categories12.map((_, i) => 8 + i * 3) }
								] as any}
								type="area"
								height={300}
							/>
						</div>
					</CardContent>
				</Card>

				{/* 16) Adaptive Recovery Pathways -> Advanced Area Timeline */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Adaptive Recovery Pathways</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={{ height: '420px' }}>
							<ReactApexChart
								key="recovery-area"
								options={{
									chart: { type: 'area', stacked: true, toolbar: { show: false } },
									xaxis: { categories: Array.from({ length: 24 }, (_, i) => `Phase ${i + 1}`) },
									stroke: { curve: 'smooth', width: 2 },
									fill: { type: 'gradient', gradient: { shadeIntensity: 0.35, opacityFrom: 0.5, opacityTo: 0.1 } },
									legend: { position: 'bottom' }
								} as ApexOptions}
								series={[
									{ name: 'Relief', data: randSeries(24, 20, 10) },
									{ name: 'Stabilize', data: randSeries(24, 30, 12) },
									{ name: 'Rebuild', data: randSeries(24, 45, 14) },
									{ name: 'Adapt', data: randSeries(24, 55, 12) }
								]}
								type="area"
								height={420}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return null;
};

export default AdvancedCharts;
