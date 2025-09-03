import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Shield, 
  Clock, 
  MapPin, 
  Star,
  CheckCircle,
  Smartphone
} from 'lucide-react';

const TrustSection: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-neon-green" />,
      title: "Verified Providers",
      description: "All technicians are licensed, insured, and background-checked for your safety"
    },
    {
      icon: <Clock className="w-8 h-8 text-electric-blue" />,
      title: "Real-time ETA",
      description: "Live tracking and accurate arrival times so you're never left wondering"
    },
    {
      icon: <MapPin className="w-8 h-8 text-emergency-red" />,
      title: "GPS Precision",
      description: "Exact location sharing eliminates confusion and reduces wait times"
    },
    {
      icon: <Star className="w-8 h-8 text-neon-green" />,
      title: "Quality Guarantee",
      description: "5-star rated service with 100% satisfaction guarantee or your money back"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-electric-blue" />,
      title: "Transparent Pricing",
      description: "Upfront pricing with no hidden fees or surprise charges ever"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-emergency-red" />,
      title: "Instant Connection",
      description: "One-tap emergency assistance connects you immediately to nearby help"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-asphalt-gray/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-guardian text-4xl md:text-5xl text-foreground mb-6">
            Why Choose Roadside?
          </h2>
          <div className="neon-accent w-24 mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            We're not just another roadside service. We're the guardian angel in your pocket, 
            transforming emergency assistance into a premium, predictable experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="tech-surface p-8 text-center hover:shadow-luxury transition-all duration-300 animate-guardian-enter border-border/50"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-2xl bg-gradient-neon/10 border border-current/20">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="font-guardian text-xl text-foreground mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        
        {/* Trust Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-guardian-enter">
            <div className="font-guardian text-3xl md:text-4xl text-neon-green mb-2">15min</div>
            <div className="text-muted-foreground text-sm">Avg Response Time</div>
          </div>
          <div className="animate-guardian-enter">
            <div className="font-guardian text-3xl md:text-4xl text-electric-blue mb-2">98%</div>
            <div className="text-muted-foreground text-sm">Customer Satisfaction</div>
          </div>
          <div className="animate-guardian-enter">
            <div className="font-guardian text-3xl md:text-4xl text-emergency-red mb-2">24/7</div>
            <div className="text-muted-foreground text-sm">Available</div>
          </div>
          <div className="animate-guardian-enter">
            <div className="font-guardian text-3xl md:text-4xl text-neon-green mb-2">500K+</div>
            <div className="text-muted-foreground text-sm">Lives Helped</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;