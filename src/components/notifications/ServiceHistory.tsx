import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, Clock, User, CheckCircle, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ServiceHistoryItem {
  id: string;
  serviceType: string;
  date: Date;
  location: string;
  provider: {
    name: string;
    company: string;
    rating: number;
  };
  cost: {
    subtotal: number;
    membershipDiscount: number;
    credits: number;
    total: number;
  };
  status: 'completed' | 'cancelled' | 'refunded';
  timeline: {
    requested: Date;
    dispatched: Date;
    enroute: Date;
    arrived: Date;
    completed: Date;
  };
  receipt?: {
    id: string;
    downloadUrl: string;
  };
}

interface ServiceHistoryProps {
  items: ServiceHistoryItem[];
  onDownloadReceipt?: (receiptId: string) => void;
  onRateService?: (serviceId: string) => void;
}

const ServiceHistory: React.FC<ServiceHistoryProps> = ({
  items,
  onDownloadReceipt,
  onRateService
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'towing':
        return '🚛';
      case 'jump start':
        return '⚡';
      case 'tire change':
        return '🛞';
      case 'fuel delivery':
        return '⛽';
      case 'lockout':
        return '🔑';
      default:
        return '🔧';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'cancelled':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'refunded':
        return 'bg-electric-blue/20 text-electric-blue border-electric-blue/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-guardian text-xl text-foreground mb-2">No Service History</h3>
        <p className="text-muted-foreground">Your past services will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        
        return (
          <div key={item.id} className="tech-surface rounded-xl border border-border/50 overflow-hidden">
            {/* Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">{getServiceIcon(item.serviceType)}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-guardian text-lg text-foreground mb-1">
                      {item.serviceType}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatCurrency(item.cost.total)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full border text-xs font-tech ${getStatusStyle(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-border/30 p-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Details */}
                  <div>
                    <h4 className="font-tech text-foreground mb-3">Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-electric-blue mr-2" />
                        <span className="text-muted-foreground">{item.location}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-neon-green mr-2" />
                        <span className="text-foreground">{item.provider.name}</span>
                        <span className="text-muted-foreground ml-2">({item.provider.company})</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-2">★</span>
                        <span className="text-foreground">{item.provider.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div>
                    <h4 className="font-tech text-foreground mb-3">Cost Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee:</span>
                        <span className="text-foreground">{formatCurrency(item.cost.subtotal)}</span>
                      </div>
                      {item.cost.membershipDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-neon-green">Membership Discount:</span>
                          <span className="text-neon-green">-{formatCurrency(item.cost.membershipDiscount)}</span>
                        </div>
                      )}
                      {item.cost.credits > 0 && (
                        <div className="flex justify-between">
                          <span className="text-electric-blue">Credits Applied:</span>
                          <span className="text-electric-blue">-{formatCurrency(item.cost.credits)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-border/30 pt-2 font-tech">
                        <span className="text-foreground">Total:</span>
                        <span className="text-foreground">{formatCurrency(item.cost.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-6">
                  <h4 className="font-tech text-foreground mb-3">Service Timeline</h4>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border/30" />
                    
                    <div className="space-y-4">
                      {Object.entries(item.timeline).map(([step, timestamp], index) => (
                        <div key={step} className="relative flex items-center">
                          <div className="w-8 h-8 bg-neon-green/20 border-2 border-neon-green rounded-full flex items-center justify-center mr-4">
                            <CheckCircle className="w-4 h-4 text-neon-green" />
                          </div>
                          <div>
                            <span className="font-tech text-foreground capitalize">{step.replace(/([A-Z])/g, ' $1')}</span>
                            <p className="text-muted-foreground text-sm">
                              {timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-border/30">
                  {item.receipt && (
                    <Button
                      onClick={() => onDownloadReceipt?.(item.receipt!.id)}
                      variant="outline"
                      className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                    >
                      Download Receipt
                    </Button>
                  )}
                  
                  {item.status === 'completed' && (
                    <Button
                      onClick={() => onRateService?.(item.id)}
                      variant="outline"
                      className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                    >
                      Rate Service
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ServiceHistory;