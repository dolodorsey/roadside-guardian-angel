import React from 'react';
import { Link } from 'react-router-dom';
import EmergencyButton from '@/components/EmergencyButton';
import RoadsideBeacon from '@/components/RoadsideBeacon';
import LiveSafetySupport from '@/components/safety/LiveSafetySupport';
import AIConcierge from '@/components/concierge/AIConcierge';
import NotificationManager from '@/components/notifications/NotificationManager';
import DesignSystemShowcase from '@/components/design-system/DesignSystemShowcase';
import GamificationShowcase from '@/components/gamification/GamificationShowcase';
import ExpansionShowcase from '@/components/expansion/ExpansionShowcase';
import InvestorShowcase from '@/components/investor/InvestorShowcase';
import RoadsideMasterBlueprint from '@/components/master/RoadsideMasterBlueprint';
import CinematicDemo from '@/components/demo/CinematicDemo';
import { MapPin, Clock, Shield, Star, Zap, Phone } from 'lucide-react';

const Index = () => {
  // Show design system if URL contains 'design-system'
  const showDesignSystem = React.useMemo(() => {
    return window.location.search.includes('design-system');
  }, []);

  // Show gamification if URL contains 'rewards'
  const showGamification = React.useMemo(() => {
    return window.location.search.includes('rewards');
  }, []);

  // Show expansion if URL contains 'expansion'
  const showExpansion = React.useMemo(() => {
    return window.location.search.includes('expansion');
  }, []);

  // Show investor pitch if URL contains 'investor'
  const showInvestor = React.useMemo(() => {
    return window.location.search.includes('investor');
  }, []);

  // Show master blueprint if URL contains 'blueprint'
  const showBlueprint = React.useMemo(() => {
    return window.location.search.includes('blueprint');
  }, []);

  // Show cinematic demo if URL contains 'demo'
  const showDemo = React.useMemo(() => {
    return window.location.search.includes('demo');
  }, []);

  if (showDesignSystem) {
    return <DesignSystemShowcase />;
  }

  if (showGamification) {
    return <GamificationShowcase />;
  }

  if (showExpansion) {
    return <ExpansionShowcase />;
  }

  if (showInvestor) {
    return <InvestorShowcase />;
  }

  if (showBlueprint) {
    return <RoadsideMasterBlueprint />;
  }

  if (showDemo) {
    return <CinematicDemo autoPlay={true} />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-8 right-8 z-10">
        <div className="flex gap-4">
          <Link 
            to="/membership"
            className="px-4 py-2 rounded-lg tech-surface border border-border/50 hover:border-electric-blue/50 transition-colors"
          >
            <span className="text-electric-blue font-tech">Membership Shield Plans</span>
          </Link>
          <Link 
            to="/provider/onboarding"
            className="px-4 py-2 rounded-lg tech-surface border border-border/50 hover:border-neon-green/50 transition-colors"
          >
            <span className="text-neon-green font-tech">Hero Portal</span>
          </Link>
          <button className="text-muted-foreground text-sm hover:text-neon-green transition-colors duration-300 font-tech">
            Sign In / Create Account
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-electric-blue rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-emergency-red/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Main Beacon */}
          <div className="mb-8 flex justify-center">
            <RoadsideBeacon size="lg" variant="guardian" />
          </div>

          {/* Hero Text */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/lovable-uploads/faf67814-8153-400b-a3ea-b4203d7bf2c8.png"
              alt="S.O.S"
              className="h-16 md:h-20 lg:h-24 object-contain"
            />
          </div>
          
          <p className="text-sm md:text-base text-muted-foreground mb-2 font-tech">
            Superheros On Standby
          </p>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-tech">
            Real-world rescue when you need it most
          </p>
          
          <p className="text-lg text-electric-blue mb-12 font-tech">
            There's Always a Superhero On Standby!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <EmergencyButton 
              variant="primary" 
              size="lg"
              showBeacon={true}
              className="min-w-[200px]"
            >
              Get Help Now
            </EmergencyButton>
            
            <EmergencyButton 
              variant="ghost" 
              size="lg"
              className="min-w-[200px] border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              Become a Hero
            </EmergencyButton>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-green" />
              <span>Verified Heroes</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-electric-blue" />
              <span>Average 8min Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-neon-green" />
              <span>4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-guardian text-4xl text-foreground mb-4">
              Professional Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Elite Heroes ready to solve your emergency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Towing */}
            <div className="group p-8 rounded-2xl tech-surface border border-border/50 hover:border-neon-green/50 transition-all duration-500 hover:shadow-guardian">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emergency-red/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚛</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4 text-center">
                Emergency Towing
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Professional towing services with GPS tracking and real-time updates
              </p>
              <div className="text-center">
                <span className="text-neon-green font-tech">From $89</span>
              </div>
            </div>

            {/* Jump Start */}
            <div className="group p-8 rounded-2xl tech-surface border border-border/50 hover:border-electric-blue/50 transition-all duration-500 hover:shadow-tech">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-electric-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-electric-blue" />
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4 text-center">
                Jump Start
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Quick battery jump start to get you back on the road
              </p>
              <div className="text-center">
                <span className="text-electric-blue font-tech">From $45</span>
              </div>
            </div>

            {/* Lockout */}
            <div className="group p-8 rounded-2xl tech-surface border border-border/50 hover:border-neon-green/50 transition-all duration-500 hover:shadow-guardian">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔑</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4 text-center">
                Lockout Service
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Professional lockout assistance without damage to your vehicle
              </p>
              <div className="text-center">
                <span className="text-neon-green font-tech">From $65</span>
              </div>
            </div>

            {/* Tire Change */}
            <div className="group p-8 rounded-2xl tech-surface border border-border/50 hover:border-emergency-red/50 transition-all duration-500 hover:shadow-emergency">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emergency-red/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🛞</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4 text-center">
                Tire Change
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Expert tire change with proper safety equipment
              </p>
              <div className="text-center">
                <span className="text-emergency-red font-tech">From $55</span>
              </div>
            </div>

            {/* Fuel Delivery */}
            <div className="group p-8 rounded-2xl tech-surface border border-border/50 hover:border-electric-blue/50 transition-all duration-500 hover:shadow-tech">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-electric-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⛽</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4 text-center">
                Fuel Delivery
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Emergency fuel delivery to get you to the nearest gas station
              </p>
              <div className="text-center">
                <span className="text-electric-blue font-tech">From $35</span>
              </div>
            </div>

            {/* Winch Out */}
            <div className="group p-8 rounded-2xl tech-surface border border-border/50 hover:border-neon-green/50 transition-all duration-500 hover:shadow-guardian">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🪝</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4 text-center">
                Winch Out
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Professional winch service for stuck or off-road vehicles
              </p>
              <div className="text-center">
                <span className="text-neon-green font-tech">From $125</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-asphalt-gray/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-guardian text-4xl text-foreground mb-4">
              How S.O.S Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Help in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emergency-red/20 border-2 border-emergency-red/30 flex items-center justify-center">
                <span className="font-guardian text-2xl text-emergency-red">1</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4">
                Send Your Signal
              </h3>
              <p className="text-muted-foreground">
                Tap SOS NOW and describe your situation. We instantly locate verified Heroes near you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-electric-blue/20 border-2 border-electric-blue/30 flex items-center justify-center">
                <span className="font-guardian text-2xl text-electric-blue">2</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4">
                Hero Dispatched
              </h3>
              <p className="text-muted-foreground">
                We match you with the closest qualified Hero. Track their arrival in real-time with GPS.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 border-2 border-neon-green/30 flex items-center justify-center">
                <span className="font-guardian text-2xl text-neon-green">3</span>
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-4">
                Mission Complete
              </h3>
              <p className="text-muted-foreground">
                Professional service with transparent pricing. Pay securely through the app when the mission is complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-guardian text-4xl text-foreground mb-4">
              Your Safety is Our Mission
            </h2>
            <p className="text-muted-foreground text-lg">
              Every Hero is thoroughly vetted and verified
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl tech-surface border border-border/50 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-neon-green" />
              <h4 className="font-tech text-foreground mb-2">Background Checked</h4>
              <p className="text-muted-foreground text-sm">
                Comprehensive verification for all Heroes
              </p>
            </div>

            <div className="p-6 rounded-xl tech-surface border border-border/50 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-electric-blue" />
              <h4 className="font-tech text-foreground mb-2">Highly Rated</h4>
              <p className="text-muted-foreground text-sm">
                Only top-rated professionals with proven track records
              </p>
            </div>

            <div className="p-6 rounded-xl tech-surface border border-border/50 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-emergency-red" />
              <h4 className="font-tech text-foreground mb-2">GPS Tracked</h4>
              <p className="text-muted-foreground text-sm">
                Real-time location sharing for complete transparency
              </p>
            </div>

            <div className="p-6 rounded-xl tech-surface border border-border/50 text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-neon-green" />
              <h4 className="font-tech text-foreground mb-2">24/7 Command Center</h4>
              <p className="text-muted-foreground text-sm">
                Always available support and emergency hotline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-midnight-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <RoadsideBeacon size="lg" variant="guardian" />
          </div>
          
          <h2 className="font-guardian text-4xl text-foreground mb-6">
            Ready When You Need Us
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of Citizens who trust S.O.S for their emergency needs
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <EmergencyButton 
              variant="primary" 
              size="lg"
              showBeacon={true}
              className="min-w-[250px]"
            >
              Download S.O.S App
            </EmergencyButton>
            
            <EmergencyButton 
              variant="ghost" 
              size="lg"
              className="min-w-[250px] border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
            >
              Learn More
            </EmergencyButton>
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            Available on iOS and Android • No subscription required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <RoadsideBeacon size="sm" variant="guardian" />
                <span className="font-guardian text-xl text-foreground">S.O.S</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Help. Here. Now.
              </p>
            </div>

            <div>
              <h4 className="font-tech text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Emergency Towing</li>
                <li>Jump Start</li>
                <li>Lockout Service</li>
                <li>Tire Change</li>
                <li>Fuel Delivery</li>
              </ul>
            </div>

            <div>
              <h4 className="font-tech text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>How It Works</li>
                <li>Safety</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>

            <div>
              <h4 className="font-tech text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Emergency: 911</li>
                <li>S.O.S: (555) HELP</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2026 S.O.S. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-neon-green text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-neon-green text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Always-available safety support */}
      <LiveSafetySupport />

      {/* AI Concierge */}
      <AIConcierge 
        serviceRequestState="idle"
        onServiceAction={(action, data) => {
          console.log('Service action:', action, data);
        }}
      />

      {/* Notification System */}
      <NotificationManager
        serviceState="idle"
        userPreferences={{
          enablePushNotifications: true,
          enableHapticFeedback: true,
          enableSoundAlerts: true
        }}
      />
    </div>
  );
};

export default Index;
