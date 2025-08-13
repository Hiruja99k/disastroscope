import { useGSAPCountUp } from '@/hooks/useGSAPAnimations';

interface StatCounterProps {
  value: string;
}

export default function StatCounter({ value }: StatCounterProps) {
  // Extract numeric value for animation
  const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
  const suffix = value.replace(/[\d.]/g, '');
  
  const countRef = useGSAPCountUp(numericValue, 2);
  
  return (
    <>
      <span ref={countRef}>0</span>
      {suffix}
    </>
  );
}