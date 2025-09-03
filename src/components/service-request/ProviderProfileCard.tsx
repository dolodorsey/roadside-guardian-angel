import React from 'react';
import { Shield, Phone, MessageCircle, X, Star, CheckCircle } from 'lucide-react';

interface ProviderProfileCardProps {
  provider: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    reviews: number;
    vehicle: string;
    company: string;
    verified: boolean;
    license?: string;
    insurance?: string;
  };
  onClose: () => void;
}

const ProviderProfileCard: React.FC<ProviderProfileCardProps> = ({ provider, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-midnight-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Card */}
      <div className="relative w-full bg-gradient-to-b from-asphalt-gray to-midnight-black border-t border-border/50 rounded-t-3xl p-6 animate-slide-in-up">
        {/* Handle */}
        <div className="w-12 h-1 bg-metallic-silver/30 rounded-full mx-auto mb-6"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-guardian text-xl text-foreground">Provider Details</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-metallic-silver/10 hover:bg-metallic-silver/20 transition-colors"
          >
            <X className="w-5 h-5 text-metallic-silver" />
          </button>
        </div>
        
        {/* Provider Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-electric-blue flex items-center justify-center">
              <span className="text-foreground text-2xl font-bold">
                {provider.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {provider.verified && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center border-2 border-background">
                <Shield className="w-4 h-4 text-midnight-black" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-guardian text-lg text-foreground mb-1">{provider.name}</h4>
            <p className="text-muted-foreground text-sm mb-2">{provider.company}</p>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-neon-green fill-current" />
                <span className="text-neon-green font-tech">{provider.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">({provider.reviews} reviews)</span>
            </div>
          </div>
        </div>
        
        {/* Vehicle & Credentials */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-electric-blue/20 flex items-center justify-center">
                <span className="text-electric-blue text-sm">🚗</span>
              </div>
              <span className="text-foreground font-tech">Vehicle Information</span>
            </div>
            <p className="text-muted-foreground">{provider.vehicle}</p>
          </div>
          
          {provider.license && (
            <div className="p-4 rounded-xl tech-surface border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                </div>
                <span className="text-foreground font-tech">Licensed & Insured</span>
              </div>
              <p className="text-muted-foreground text-sm">License: {provider.license}</p>
              <p className="text-muted-foreground text-sm">{provider.insurance}</p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-electric-blue/30 bg-electric-blue/5 hover:bg-electric-blue/10 transition-colors">
            <Phone className="w-5 h-5 text-electric-blue" />
            <span className="text-electric-blue font-tech">Call Provider</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/10 transition-colors">
            <MessageCircle className="w-5 h-5 text-neon-green" />
            <span className="text-neon-green font-tech">Send Message</span>
          </button>
        </div>
        
        {/* Safety Note */}
        <div className="mt-6 p-4 rounded-xl bg-emergency-red/5 border border-emergency-red/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emergency-red" />
            <span className="text-emergency-red text-sm font-tech">Safety Reminder</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Verify provider ID and vehicle details before accepting service. Your safety is our priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileCard;