import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { useGSAPAnimations, useGSAPHover } from '@/hooks/useGSAPAnimations';
import { cn } from '@/lib/utils';

interface GSAPEnhancedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function GSAPEnhancedCard({ 
  children, 
  className, 
  hover = true, 
  delay = 0 
}: GSAPEnhancedCardProps) {
  const animatedRef = useGSAPAnimations();
  const hoverRef = useGSAPHover();

  return (
    <Card 
      ref={hover ? hoverRef : animatedRef}
      className={cn(
        "transition-all duration-300 hover:shadow-elevation border-border/50",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
}