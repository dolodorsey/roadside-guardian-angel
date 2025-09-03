import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Copy, Share2, MessageCircle, Mail, Users, Car, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralFlowProps {
  onClose?: () => void;
}

const ReferralFlow: React.FC<ReferralFlowProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [referralCode, setReferralCode] = useState("ROADHERO5");
  const [shareMethod, setShareMethod] = useState<string | null>(null);
  const [friendsReferred, setFriendsReferred] = useState(3);
  const [earnedCredits, setEarnedCredits] = useState(15);
  
  const shareLink = `https://roadside.app/join?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Referral link copied!");
      
      // Simulate earning animation
      setTimeout(() => {
        setStep(3);
      }, 1000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareViaMethod = (method: string) => {
    setShareMethod(method);
    
    const shareText = "Just joined Roadside - the premium roadside assistance app! Use my code ROADHERO5 and we both get $5 credit. Never be stranded again! 🚗✨";
    
    switch (method) {
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText + ' ' + shareLink)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Join Roadside&body=${encodeURIComponent(shareText + '\n\n' + shareLink)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareLink)}`);
        break;
    }
    
    // Show success after sharing
    setTimeout(() => {
      setStep(3);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-black/80 backdrop-blur-sm p-4">
      <Motion.SlideInUp className="w-full max-w-md">
        <Card className="tech-surface border-pulse-green/30">
          
          {/* Step 1: Introduction */}
          {step === 1 && (
            <div className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <Motion.HoverGlow variant="success">
                  <div className="w-20 h-20 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
                    <Car className="w-10 h-10 text-pulse-green animate-pulse" />
                  </div>
                </Motion.HoverGlow>
                
                <Typography.Headline className="text-pulse-green">
                  Save Your Friends
                </Typography.Headline>
                
                <Typography.Body className="text-center">
                  Share Roadside with friends and you both earn $5 credit. The more you share, the more you save!
                </Typography.Body>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-asphalt-gray/50">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-pulse-green" />
                    <Typography.Small>Friends referred</Typography.Small>
                  </div>
                  <Typography.Tech className="text-pulse-green">{friendsReferred}</Typography.Tech>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-asphalt-gray/50">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-pulse-green" />
                    <Typography.Small>Credits earned</Typography.Small>
                  </div>
                  <Typography.Tech className="text-pulse-green">${earnedCredits}</Typography.Tech>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => setStep(2)}
                  className="w-full bg-pulse-green hover:bg-pulse-green/80 text-midnight-black font-tech"
                >
                  Start Sharing
                </Button>
                
                {onClose && (
                  <Button 
                    variant="ghost" 
                    onClick={onClose}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Maybe Later
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Share Options */}
          {step === 2 && (
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <Typography.Subheadline>Share Your Code</Typography.Subheadline>
                <Typography.Small className="text-muted-foreground">
                  Choose how you want to share Roadside
                </Typography.Small>
              </div>

              {/* Referral Code Display */}
              <div className="space-y-3">
                <Typography.Small>Your referral code:</Typography.Small>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={shareLink}
                    readOnly
                    className="tech-surface border-pulse-green/30"
                  />
                  <Button
                    size="sm"
                    onClick={copyToClipboard}
                    className="bg-pulse-green/20 hover:bg-pulse-green/30 text-pulse-green border border-pulse-green/30"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Share Methods */}
              <div className="space-y-3">
                <Typography.Small>Or share directly:</Typography.Small>
                
                <div className="grid grid-cols-1 gap-3">
                  <Motion.HoverScale>
                    <Button
                      variant="outline"
                      onClick={() => shareViaMethod('sms')}
                      className="w-full flex items-center space-x-3 border-beacon-blue/30 text-beacon-blue hover:bg-beacon-blue/10"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Text Message</span>
                    </Button>
                  </Motion.HoverScale>

                  <Motion.HoverScale>
                    <Button
                      variant="outline"
                      onClick={() => shareViaMethod('email')}
                      className="w-full flex items-center space-x-3 border-metallic-silver/30 text-metallic-silver hover:bg-metallic-silver/10"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email</span>
                    </Button>
                  </Motion.HoverScale>

                  <Motion.HoverScale>
                    <Button
                      variant="outline"
                      onClick={() => shareViaMethod('whatsapp')}
                      className="w-full flex items-center space-x-3 border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </Button>
                  </Motion.HoverScale>
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Back
              </Button>
            </div>
          )}

          {/* Step 3: Success Animation */}
          {step === 3 && (
            <div className="p-6 space-y-6">
              <Motion.CompletionGlow className="text-center space-y-4">
                <Motion.SOSRipple className="w-24 h-24 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-pulse-green animate-heartbeat" />
                </Motion.SOSRipple>
                
                <Typography.Emergency className="text-pulse-green">
                  LINK SHARED!
                </Typography.Emergency>
                
                <Typography.Body className="text-center">
                  When your friend signs up, you'll both receive $5 Roadside credit automatically!
                </Typography.Body>
              </Motion.CompletionGlow>

              <div className="space-y-4">
                <div className="p-4 rounded-lg tech-surface border border-pulse-green/30">
                  <div className="flex items-center justify-between">
                    <Typography.Small>Pending reward:</Typography.Small>
                    <Typography.Tech className="text-pulse-green">$5 credit</Typography.Tech>
                  </div>
                  <Typography.Caption className="text-muted-foreground">
                    Activated when friend completes signup
                  </Typography.Caption>
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="w-full border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10"
                >
                  Share with More Friends
                </Button>

                {onClose && (
                  <Button 
                    onClick={onClose}
                    className="w-full bg-pulse-green hover:bg-pulse-green/80 text-midnight-black font-tech"
                  >
                    Done
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </Motion.SlideInUp>
    </div>
  );
};

export default ReferralFlow;