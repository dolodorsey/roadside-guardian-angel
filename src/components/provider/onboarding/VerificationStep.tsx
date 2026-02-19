import React, { useState } from 'react';
import { Upload, CheckCircle, Shield, Truck, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmergencyButton from '@/components/EmergencyButton';

interface VerificationStepProps {
  onNext: () => void;
  onDataUpdate: (data: any) => void;
  data: any;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ onNext, onDataUpdate, data }) => {
  const [verificationItems, setVerificationItems] = useState({
    driversLicense: false,
    vehicleRegistration: false,
    insurance: false,
    backgroundCheck: false,
    businessVerification: false
  });

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    vehicleType: '',
    serviceTypes: [],
    businessName: '',
    ...data
  });

  const handleFileUpload = (type: string) => {
    // Simulate file upload
    setVerificationItems(prev => ({ ...prev, [type]: true }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(service)
        ? prev.serviceTypes.filter((s: string) => s !== service)
        : [...prev.serviceTypes, service]
    }));
  };

  const serviceOptions = [
    { id: 'tow', label: 'Towing Services', icon: '🚛' },
    { id: 'jumpstart', label: 'Jump Start', icon: '⚡' },
    { id: 'tire', label: 'Tire Change', icon: '🛞' },
    { id: 'lockout', label: 'Lockout Service', icon: '🔑' },
    { id: 'fuel', label: 'Fuel Delivery', icon: '⛽' }
  ];

  const allItemsVerified = Object.values(verificationItems).every(Boolean);

  const handleContinue = () => {
    onDataUpdate({ ...formData, verificationItems });
    onNext();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
          <Shield className="w-10 h-10 text-neon-green" />
        </div>
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Hero Verification
        </h2>
        <p className="text-muted-foreground">
          Help us verify your credentials to join our trusted network
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="font-guardian text-xl text-foreground mb-4">Personal Information</h3>
          
          <div>
            <Label className="text-foreground font-tech">Full Name</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="mt-2 tech-surface border-border/50 focus:border-neon-green"
              placeholder="John Smith"
            />
          </div>

          <div>
            <Label className="text-foreground font-tech">Phone Number</Label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="mt-2 tech-surface border-border/50 focus:border-neon-green"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <Label className="text-foreground font-tech">Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-2 tech-surface border-border/50 focus:border-neon-green"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label className="text-foreground font-tech">Vehicle Type</Label>
            <Input
              value={formData.vehicleType}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
              className="mt-2 tech-surface border-border/50 focus:border-neon-green"
              placeholder="2022 Ford F-250 Tow Truck"
            />
          </div>

          <div>
            <Label className="text-foreground font-tech">Business Name (Optional)</Label>
            <Input
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="mt-2 tech-surface border-border/50 focus:border-neon-green"
              placeholder="Mike's Rescue Services"
            />
          </div>
        </div>

        {/* Verification Documents */}
        <div className="space-y-6">
          <h3 className="font-guardian text-xl text-foreground mb-4">Document Verification</h3>
          
          {/* Drivers License */}
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-electric-blue" />
                <span className="text-foreground font-tech">Driver's License</span>
              </div>
              {verificationItems.driversLicense && (
                <CheckCircle className="w-5 h-5 text-neon-green" />
              )}
            </div>
            {!verificationItems.driversLicense ? (
              <button
                onClick={() => handleFileUpload('driversLicense')}
                className="w-full p-3 border-2 border-dashed border-border/50 rounded-lg hover:border-electric-blue/50 transition-colors"
              >
                <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Upload Driver's License</span>
              </button>
            ) : (
              <div className="text-neon-green text-sm">✓ Verified</div>
            )}
          </div>

          {/* Vehicle Registration */}
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-electric-blue" />
                <span className="text-foreground font-tech">Vehicle Registration</span>
              </div>
              {verificationItems.vehicleRegistration && (
                <CheckCircle className="w-5 h-5 text-neon-green" />
              )}
            </div>
            {!verificationItems.vehicleRegistration ? (
              <button
                onClick={() => handleFileUpload('vehicleRegistration')}
                className="w-full p-3 border-2 border-dashed border-border/50 rounded-lg hover:border-electric-blue/50 transition-colors"
              >
                <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Upload Registration</span>
              </button>
            ) : (
              <div className="text-neon-green text-sm">✓ Verified</div>
            )}
          </div>

          {/* Insurance */}
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-electric-blue" />
                <span className="text-foreground font-tech">Insurance Certificate</span>
              </div>
              {verificationItems.insurance && (
                <CheckCircle className="w-5 h-5 text-neon-green" />
              )}
            </div>
            {!verificationItems.insurance ? (
              <button
                onClick={() => handleFileUpload('insurance')}
                className="w-full p-3 border-2 border-dashed border-border/50 rounded-lg hover:border-electric-blue/50 transition-colors"
              >
                <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Upload Insurance</span>
              </button>
            ) : (
              <div className="text-neon-green text-sm">✓ Verified</div>
            )}
          </div>

          {/* Background Check */}
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-electric-blue" />
                <span className="text-foreground font-tech">Background Check</span>
              </div>
              {verificationItems.backgroundCheck && (
                <CheckCircle className="w-5 h-5 text-neon-green" />
              )}
            </div>
            {!verificationItems.backgroundCheck ? (
              <button
                onClick={() => handleFileUpload('backgroundCheck')}
                className="w-full p-3 rounded-lg bg-electric-blue/10 border border-electric-blue/30 hover:bg-electric-blue/20 transition-colors"
              >
                <span className="text-electric-blue text-sm">Consent to Background Check</span>
              </button>
            ) : (
              <div className="text-neon-green text-sm">✓ Consent Given</div>
            )}
          </div>
        </div>
      </div>

      {/* Service Types */}
      <div className="mt-8">
        <h3 className="font-guardian text-xl text-foreground mb-4">Services You Provide</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {serviceOptions.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceToggle(service.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.serviceTypes.includes(service.id)
                  ? 'border-neon-green bg-neon-green/10 shadow-guardian'
                  : 'border-border/50 tech-surface hover:border-electric-blue/50'
              }`}
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className={`text-sm font-tech ${
                formData.serviceTypes.includes(service.id) ? 'text-neon-green' : 'text-foreground'
              }`}>
                {service.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
        <EmergencyButton
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!allItemsVerified || !formData.fullName || !formData.phoneNumber}
          className="px-12"
          showBeacon={true}
        >
          Continue to Training
        </EmergencyButton>
      </div>
    </div>
  );
};

export default VerificationStep;