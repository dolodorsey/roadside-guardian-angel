import React from 'react';
import { 
  Shield, 
  Clock, 
  DollarSign, 
  Users,
  Star,
  Check,
  Phone
} from 'lucide-react';

const TrustIndicators: React.FC = () => {
  return (
    <div className="mt-16 space-y-12">
      {/* Trust Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-xl tech-surface border border-border/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-neon-green" />
          </div>
          <h3 className="font-guardian text-lg text-foreground mb-2">No Hidden Fees</h3>
          <p className="text-muted-foreground text-sm">
            What you see is what you pay. No surprise charges, ever.
          </p>
        </div>

        <div className="text-center p-6 rounded-xl tech-surface border border-border/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-blue/20 border border-electric-blue/30 flex items-center justify-center">
            <Shield className="w-8 h-8 text-electric-blue" />
          </div>
          <h3 className="font-guardian text-lg text-foreground mb-2">Cancel Anytime</h3>
          <p className="text-muted-foreground text-sm">
            No contracts, no penalties. Cancel your Shield plan anytime.
          </p>
        </div>

        <div className="text-center p-6 rounded-xl tech-surface border border-border/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emergency-red/20 border border-emergency-red/30 flex items-center justify-center">
            <Clock className="w-8 h-8 text-emergency-red" />
          </div>
          <h3 className="font-guardian text-lg text-foreground mb-2">24/7 Availability</h3>
          <p className="text-muted-foreground text-sm">
            Round-the-clock service, 365 days a year. We're always here.
          </p>
        </div>
      </div>

      {/* Social Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Stats */}
        <div className="space-y-6">
          <h3 className="font-guardian text-2xl text-foreground">Trusted by Millions</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-xl bg-neon-green/5 border border-neon-green/20">
              <div className="font-guardian text-3xl text-neon-green mb-1">2.5M+</div>
              <div className="text-muted-foreground text-sm">Citizens Protected</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-electric-blue/5 border border-electric-blue/20">
              <div className="font-guardian text-3xl text-electric-blue mb-1">4.9★</div>
              <div className="text-muted-foreground text-sm">App Rating</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-emergency-red/5 border border-emergency-red/20">
              <div className="font-guardian text-3xl text-emergency-red mb-1">8 min</div>
              <div className="text-muted-foreground text-sm">Avg Response Time</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-metallic-silver/5 border border-metallic-silver/20">
              <div className="font-guardian text-3xl text-foreground mb-1">98%</div>
              <div className="text-muted-foreground text-sm">Missions Completed</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          <h3 className="font-guardian text-2xl text-foreground">What Citizens Say</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl tech-surface border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-neon-green fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                "S.O.S saved me when I was stranded with a flat tire at 2 AM. 
                The Hero arrived in 6 minutes and had me back on the road quickly."
              </p>
              <div className="text-foreground text-sm font-tech">Sarah M., Shield Member</div>
            </div>
            
            <div className="p-4 rounded-xl tech-surface border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-neon-green fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                "As a rideshare driver, S.O.S keeps me earning. The family plan 
                covers my whole fleet at an amazing price."
              </p>
              <div className="text-foreground text-sm font-tech">Mike R., Family Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Coverage */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-neon-green/5 to-electric-blue/5 border border-neon-green/20">
        <div className="text-center mb-8">
          <h3 className="font-guardian text-2xl text-foreground mb-4">
            Your Safety is Our Promise
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every S.O.S mission comes with comprehensive protection and verified professional Heroes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon-green/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-neon-green" />
            </div>
            <h4 className="font-tech text-foreground mb-2">Verified Heroes</h4>
            <p className="text-muted-foreground text-sm">
              Licensed, insured, and background-checked professionals only
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-electric-blue/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-electric-blue" />
            </div>
            <h4 className="font-tech text-foreground mb-2">Insurance Coverage</h4>
            <p className="text-muted-foreground text-sm">
              Full liability coverage for every mission
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emergency-red/20 flex items-center justify-center">
              <Phone className="w-6 h-6 text-emergency-red" />
            </div>
            <h4 className="font-tech text-foreground mb-2">24/7 Command Center</h4>
            <p className="text-muted-foreground text-sm">
              Real human support available anytime you need help
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-metallic-silver/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-foreground" />
            </div>
            <h4 className="font-tech text-foreground mb-2">Satisfaction Guarantee</h4>
            <p className="text-muted-foreground text-sm">
              100% satisfaction guaranteed or your money back
            </p>
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="text-center">
        <h3 className="font-guardian text-2xl text-foreground mb-8">
          Compare to Traditional Services
        </h3>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Traditional Services */}
            <div className="p-6 rounded-xl tech-surface border border-border/50">
              <h4 className="font-tech text-foreground mb-4">Traditional Services</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="w-4 h-4 text-emergency-red">×</div>
                  Long wait times (1-3 hours)
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="w-4 h-4 text-emergency-red">×</div>
                  Hidden fees and surprises
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="w-4 h-4 text-emergency-red">×</div>
                  Unclear Hero credentials
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="w-4 h-4 text-emergency-red">×</div>
                  Annual contracts required
                </div>
              </div>
            </div>

            {/* S.O.S Shield Free */}
            <div className="p-6 rounded-xl tech-surface border border-electric-blue/30">
              <h4 className="font-tech text-electric-blue mb-4">S.O.S Shield Free</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  Fast response (15-30 min avg)
                </div>
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  Transparent, upfront pricing
                </div>
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  Verified, licensed Heroes
                </div>
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  No contracts or commitments
                </div>
              </div>
            </div>

            {/* S.O.S Shield Pro */}
            <div className="p-6 rounded-xl border-2 border-neon-green bg-neon-green/5 shadow-guardian">
              <h4 className="font-tech text-neon-green mb-4">S.O.S Shield Pro</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  Priority response (8-15 min avg)
                </div>
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  Unlimited missions
                </div>
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  Dedicated concierge support
                </div>
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="w-4 h-4 text-neon-green" />
                  Covers multiple vehicles
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
