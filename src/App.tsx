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
import DisasterManagement from "./pages/DisasterManagement";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import RealTimeBridge from "./components/RealTimeBridge";
import WeatherExplorer from "./pages/WeatherExplorer";
import ErrorBoundary from "./components/ErrorBoundary";
import PerformanceMonitor from "./components/PerformanceMonitor";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/EnhancedAuthContext";
import { trackPageView } from "./utils/monitoring";
import { Refine } from "@refinedev/core";
import CursorFollower from "./components/CursorFollower";
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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CursorFollower />
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
                    { name: 'disaster-management/disasters' },
                  ]}
                >
                  <PerformanceMonitor />
                  <PageViewTracker />
                  <RealTimeBridge />
                  <Navigation />

                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/about" element={<About />} />
                    
                    {/* Auth Route - Only accessible when not authenticated */}
                    <Route 
                      path="/auth" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <AuthPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Protected Routes - Require authentication */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard-simple" 
                      element={
                        <ProtectedRoute>
                          <SimpleDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/predictions" 
                      element={
                        <ProtectedRoute>
                          <Predictions />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/weather" 
                      element={
                        <ProtectedRoute>
                          <WeatherExplorer />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/disaster-management" 
                      element={
                        <ProtectedRoute>
                          <DisasterManagement />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Refine>
              </RouterImpl>
            );
          })()}
        </TooltipProvider>
      </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );

export default App;
