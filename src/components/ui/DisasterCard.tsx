import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { DisasterReport } from '@/services/disasterManagementServiceV2';
import StatusIndicator from './StatusIndicator';

interface DisasterCardProps {
  disaster: DisasterReport;
  onView?: (disaster: DisasterReport) => void;
  onEdit?: (disaster: DisasterReport) => void;
  onDelete?: (disaster: DisasterReport) => void;
  index?: number;
}

export default function DisasterCard({ 
  disaster, 
  onView, 
  onEdit, 
  onDelete, 
  index = 0 
}: DisasterCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'destructive';
      case 'Warning': return 'secondary';
      case 'Resolved': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityGradient = (severity: string) => {
    switch (severity) {
      case 'High': return 'from-red-500/20 to-red-600/10';
      case 'Medium': return 'from-orange-500/20 to-orange-600/10';
      case 'Low': return 'from-green-500/20 to-green-600/10';
      default: return 'from-gray-500/20 to-gray-600/10';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'Active': return 'from-red-500/30 to-red-600/20';
      case 'Warning': return 'from-orange-500/30 to-orange-600/20';
      case 'Resolved': return 'from-green-500/30 to-green-600/20';
      default: return 'from-gray-500/30 to-gray-600/20';
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateX: -10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayLocation =
    disaster.location && !/unknown/i.test(disaster.location)
      ? disaster.location
      : '';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className={`
        relative overflow-hidden p-6 
        bg-card/50 backdrop-blur-sm
        border-primary/20 hover:border-primary/40
        hover:shadow-glow
        transition-all duration-300
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent
        before:translate-x-[-100%] group-hover:before:translate-x-[100%]
        before:transition-transform before:duration-700
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>

        {/* Enhanced Status Indicator */}
        <div className="absolute top-4 right-4">
          <StatusIndicator 
            status={disaster.status === 'Active' ? 'active' : 
                   disaster.status === 'Warning' ? 'warning' : 'resolved'}
            size="sm"
            animated={true}
          />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-12 md:pr-16">
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors break-words">
                {disaster.title}
              </h3>
              {displayLocation && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{displayLocation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {disaster.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                {disaster.affected_people.toLocaleString()} affected
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="h-4 w-4 text-success" />
              <span className="text-foreground">{disaster.estimated_damage}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>{disaster.contact_info.phone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{disaster.contact_info.email}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-primary/20">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {disaster.created_at && (
                <>
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(disaster.created_at)}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView?.(disaster)}
                className="h-8 w-8 p-0 hover:bg-primary/10 text-muted-foreground hover:text-primary hover:shadow-glow"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(disaster)}
                className="h-8 w-8 p-0 hover:bg-primary/10 text-muted-foreground hover:text-primary hover:shadow-glow"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(disaster)}
                className="h-8 w-8 p-0 hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Updates Indicator */}
          {disaster.updates.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-primary">
              <MessageSquare className="h-3 w-3" />
              <span>{disaster.updates.length} update{disaster.updates.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </Card>
    </motion.div>
  );
}
