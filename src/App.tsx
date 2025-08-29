import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Landing from "./pages/EnhancedLanding";
import Predictions from "./pages/EnhancedPredictions";
import Dashboard from "./pages/ProDashboard";
import SimpleDashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import RealTimeBridge from "./components/RealTimeBridge";
import WeatherExplorer from "./pages/WeatherExplorer";
import ErrorBoundary from "./components/ErrorBoundary";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { trackPageView } from "./utils/monitoring";
import { Refine } from "@refinedev/core";
import { dataProvider, liveProvider, notificationProvider } from "./lib/refine";



const queryClient = new QueryClient();

// Component to track page views
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }, [location.pathname]);

  return null;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {(() => {
            const useHash =
              import.meta.env.VITE_HASH_ROUTER === 'true' ||
              (typeof window !== 'undefined' && (
                window.location.hostname === 'disastroscope.site' ||
                window.location.hostname === 'www.disastroscope.site'
              ));
            const RouterImpl: any = useHash ? HashRouter : BrowserRouter;
            return (
              <RouterImpl>
                <Refine
                  dataProvider={dataProvider}
                  liveProvider={liveProvider}
                  notificationProvider={notificationProvider}
                  resources={[
                    { name: 'events' },
                    { name: 'predictions' },
                    { name: 'sensors' },
                    { name: 'reports' },
                  ]}
                >
                  <PerformanceMonitor />
                  <PageViewTracker />
                  <RealTimeBridge />
                  <Navigation />

                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/predictions" element={<Predictions />} />
                    <Route path="/weather" element={<WeatherExplorer />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard-simple" element={<SimpleDashboard />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/about" element={<About />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Refine>
              </RouterImpl>
            );
          })()}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );

export default App;
