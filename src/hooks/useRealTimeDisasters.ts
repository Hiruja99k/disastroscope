import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeDisasters = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchRealDisasters = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-real-disasters');
      
      if (error) {
        throw error;
      }

      setLastUpdate(new Date());
      toast({
        title: "Data Updated",
        description: `Fetched ${data.count} real disaster events from global sources`,
      });

      // Also generate AI predictions based on new data
      await supabase.functions.invoke('generate-ai-predictions');
      
    } catch (error) {
      console.error('Error fetching real disasters:', error);
      toast({
        title: "Update Failed",
        description: "Failed to fetch real disaster data. Using cached data.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Auto-update every 30 minutes
  useEffect(() => {
    fetchRealDisasters();
    
    const interval = setInterval(() => {
      fetchRealDisasters();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    isUpdating,
    lastUpdate,
    fetchRealDisasters
  };
};