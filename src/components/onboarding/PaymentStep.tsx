import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import EmergencyButton from '../EmergencyButton';
import { CreditCard, Smartphone, Shield } from 'lucide-react';

interface PaymentStepProps {
  onNext: () => void;
  onBack?: () => void;
  isLastStep: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onNext, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState<'apple' | 'google' | 'card' | null>(null);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [cardAdded, setCardAdded] = useState(false);

  const handlePaymentMethodSelect = (method: 'apple' | 'google' | 'card') => {
    setSelectedMethod(method);
    if (method !== 'card') {
      setCardAdded(true);
    }
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    
    // Check if card is complete
    const isComplete = cardData.number && cardData.expiry && cardData.cvv && cardData.name && value;
    if (isComplete && !cardAdded) {
      setCardAdded(true);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Secure Payment Setup
        </h2>
        <p className="text-muted-foreground text-sm">
          Only charged when you request service. No hidden fees.
        </p>
      </div>

      {/* Payment Options */}
      <div className="space-y-4 mb-8">
        {/* Apple Pay */}
        <div 
          onClick={() => handlePaymentMethodSelect('apple')}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            selectedMethod === 'apple' 
              ? 'border-neon-green bg-neon-green/5 shadow-guardian' 
              : 'border-border/50 tech-surface hover:border-electric-blue/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-metallic-silver to-asphalt-gray flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-tech text-foreground font-medium">Apple Pay</div>
              <div className="text-muted-foreground text-sm">Quick & secure</div>
            </div>
            {selectedMethod === 'apple' && (
              <div className="w-6 h-6 bg-neon-green rounded-full flex items-center justify-center animate-scale-in">
                <span className="text-midnight-black text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Google Pay */}
        <div 
          onClick={() => handlePaymentMethodSelect('google')}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            selectedMethod === 'google' 
              ? 'border-electric-blue bg-electric-blue/5 shadow-tech' 
              : 'border-border/50 tech-surface hover:border-electric-blue/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-neon-green flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-tech text-foreground font-medium">Google Pay</div>
              <div className="text-muted-foreground text-sm">One-tap payment</div>
            </div>
            {selectedMethod === 'google' && (
              <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center animate-scale-in">
                <span className="text-midnight-black text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Credit/Debit Card */}
        <div 
          onClick={() => handlePaymentMethodSelect('card')}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            selectedMethod === 'card' 
              ? 'border-emergency-red bg-emergency-red/5 shadow-emergency' 
              : 'border-border/50 tech-surface hover:border-emergency-red/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emergency-red to-metallic-silver flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-tech text-foreground font-medium">Credit/Debit Card</div>
              <div className="text-muted-foreground text-sm">Visa, Mastercard, Amex</div>
            </div>
            {selectedMethod === 'card' && cardAdded && (
              <div className="w-6 h-6 bg-emergency-red rounded-full flex items-center justify-center animate-scale-in">
                <span className="text-foreground text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Details Form */}
      {selectedMethod === 'card' && (
        <div className="space-y-4 mb-8 animate-fade-in">
          {/* Card UI Representation */}
          <div className="relative mb-6">
            <div className={`w-full h-48 rounded-xl p-6 flex flex-col justify-between transition-all duration-500 ${
              cardAdded 
                ? 'bg-gradient-to-br from-emergency-red to-asphalt-gray shadow-emergency' 
                : 'bg-gradient-to-br from-asphalt-gray to-midnight-black border border-border/50'
            }`}>
              <div className="flex justify-between items-start">
                <div className="w-12 h-8 rounded bg-metallic-silver/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-metallic-silver" />
                </div>
                {cardAdded && (
                  <div className="animate-pulse">
                    <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="font-tech text-lg text-foreground tracking-widest mb-2">
                  {cardData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between text-sm text-metallic-silver">
                  <span>{cardData.name || 'Your Name'}</span>
                  <span>{cardData.expiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="cardNumber" className="text-foreground font-tech">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardData.number}
              onChange={(e) => handleCardInputChange('number', e.target.value)}
              className="mt-2 tech-surface border-border/50 focus:border-emergency-red"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry" className="text-foreground font-tech">Expiry</Label>
              <Input
                id="expiry"
                value={cardData.expiry}
                onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                className="mt-2 tech-surface border-border/50 focus:border-emergency-red"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-foreground font-tech">CVV</Label>
              <Input
                id="cvv"
                value={cardData.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                className="mt-2 tech-surface border-border/50 focus:border-emergency-red"
                placeholder="123"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="cardName" className="text-foreground font-tech">Cardholder Name</Label>
            <Input
              id="cardName"
              value={cardData.name}
              onChange={(e) => handleCardInputChange('name', e.target.value)}
              className="mt-2 tech-surface border-border/50 focus:border-emergency-red"
              placeholder="John Doe"
            />
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 mb-8">
        <Shield className="w-5 h-5 text-neon-green" />
        <div className="text-sm text-muted-foreground">
          <span className="text-neon-green font-medium">256-bit encryption.</span> Your payment info is secure and never stored on our servers.
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {onBack && (
          <EmergencyButton
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </EmergencyButton>
        )}
        <EmergencyButton
          variant="primary"
          size="lg"
          onClick={onNext}
          className="flex-1"
          disabled={!selectedMethod || (selectedMethod === 'card' && !cardAdded)}
        >
          Continue
        </EmergencyButton>
      </div>
    </div>
  );
};

export default PaymentStep;