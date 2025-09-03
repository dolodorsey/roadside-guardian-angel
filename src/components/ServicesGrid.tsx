import React from 'react';
import ServiceCard from './ServiceCard';
import { 
  Car, 
  Fuel, 
  Key, 
  Wrench,
  MapPin,
  Shield
} from 'lucide-react';

const ServicesGrid: React.FC = () => {
  const services = [
    {
      icon: <Car className="w-6 h-6 text-midnight-black" />,
      title: "Emergency Towing",
      description: "Fast, reliable towing service to get you and your vehicle to safety",
      estimatedTime: "15-30 min",
      onRequest: () => console.log('Towing requested')
    },
    {
      icon: <Fuel className="w-6 h-6 text-midnight-black" />,
      title: "Fuel Delivery",
      description: "Emergency fuel delivery right to your location, any time of day",
      estimatedTime: "10-20 min",
      onRequest: () => console.log('Fuel requested')
    },
    {
      icon: <Key className="w-6 h-6 text-midnight-black" />,
      title: "Lockout Service",
      description: "Professional lockout assistance to get you back in your vehicle",
      estimatedTime: "15-25 min",
      onRequest: () => console.log('Lockout requested')
    },
    {
      icon: <Wrench className="w-6 h-6 text-midnight-black" />,
      title: "Jump Start",
      description: "Dead battery? We'll get you running again with professional jump start",
      estimatedTime: "10-15 min",
      onRequest: () => console.log('Jump start requested')
    },
    {
      icon: <Shield className="w-6 h-6 text-midnight-black" />,
      title: "Tire Change",
      description: "Flat tire replacement service by certified roadside professionals",
      estimatedTime: "20-30 min",
      onRequest: () => console.log('Tire change requested')
    },
    {
      icon: <MapPin className="w-6 h-6 text-midnight-black" />,
      title: "GPS Recovery",
      description: "Lost or stuck? We'll help you navigate back to safety",
      estimatedTime: "Variable",
      onRequest: () => console.log('GPS recovery requested')
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-guardian text-4xl md:text-5xl text-foreground mb-6">
            Emergency Services
          </h2>
          <div className="neon-accent w-24 mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional roadside assistance at your fingertips. 
            Verified providers, transparent pricing, real-time tracking.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              estimatedTime={service.estimatedTime}
              onRequest={service.onRequest}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;