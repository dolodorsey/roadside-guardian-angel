import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Share2, Copy, Twitter, Instagram, Facebook, MessageCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface SocialSharingProps {
  achievement: {
    type: 'badge' | 'milestone' | 'referral' | 'anniversary';
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
    value?: string | number;
  };
  onClose?: () => void;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ achievement, onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const getShareContent = () => {
    const baseMessages = {
      badge: `🏆 Just unlocked "${achievement.title}" on S.O.S! ${achievement.description}`,
      milestone: `🚗 Milestone achieved: ${achievement.title}! ${achievement.value} rescues completed with S.O.S.`,
      referral: `💪 Saved ${achievement.value} friends with S.O.S referrals! Join the safety network.`,
      anniversary: `🎉 ${achievement.title} with S.O.S! ${achievement.description}`
    };

    const hashtags = '#SOSApp #RoadSafety #NeverStrandedAgain #RoadHero';
    const link = 'https://sos.app/join';
    
    return `${baseMessages[achievement.type]} ${hashtags} ${link}`;
  };

  const copyToClipboard = async () => {
    const content = customMessage || getShareContent();
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareToSocial = (platform: string) => {
    const content = customMessage || getShareContent();
    const encodedContent = encodeURIComponent(content);
    const url = encodeURIComponent('https://sos.app/join');
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedContent}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedContent}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
      whatsapp: `https://wa.me/?text=${encodedContent}`,
      messages: `sms:?body=${encodedContent}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
      setSelectedPlatform(platform);
      
      // Show success after a brief delay
      setTimeout(() => {
        toast.success(`Shared to ${platform}!`);
      }, 1000);
    }
  };

  const getAchievementIcon = () => {
    if (achievement.icon) {
      const IconComponent = achievement.icon;
      return <IconComponent className="w-12 h-12 text-pulse-green" />;
    }
    return <Trophy className="w-12 h-12 text-pulse-green" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-black/80 backdrop-blur-sm p-4">
      <Motion.SlideInUp className="w-full max-w-md">
        <Card className="tech-surface border-pulse-green/30 p-6 space-y-6">
          
          {/* Achievement Preview */}
          <div className="text-center space-y-4">
            <Motion.CompletionGlow>
              <div className="w-20 h-20 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
                {getAchievementIcon()}
              </div>
            </Motion.CompletionGlow>
            
            <div>
              <Typography.Subheadline className="text-pulse-green">
                {achievement.title}
              </Typography.Subheadline>
              <Typography.Body className="text-muted-foreground text-center">
                {achievement.description}
              </Typography.Body>
            </div>
          </div>

          {/* Share Message Preview */}
          <div className="space-y-3">
            <Typography.Small>Share message:</Typography.Small>
            <div className="p-3 rounded-lg tech-surface border border-border/50">
              <Typography.Small className="text-muted-foreground">
                {getShareContent()}
              </Typography.Small>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="space-y-4">
            <Typography.Small>Choose platform:</Typography.Small>
            
            <div className="grid grid-cols-2 gap-3">
              <Motion.HoverScale>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('twitter')}
                  className="flex items-center space-x-2 border-beacon-blue/30 text-beacon-blue hover:bg-beacon-blue/10"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </Button>
              </Motion.HoverScale>

              <Motion.HoverScale>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('instagram')}
                  className="flex items-center space-x-2 border-emergency-red/30 text-emergency-red hover:bg-emergency-red/10"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </Button>
              </Motion.HoverScale>

              <Motion.HoverScale>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('facebook')}
                  className="flex items-center space-x-2 border-beacon-blue/30 text-beacon-blue hover:bg-beacon-blue/10"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </Button>
              </Motion.HoverScale>

              <Motion.HoverScale>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('whatsapp')}
                  className="flex items-center space-x-2 border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Button>
              </Motion.HoverScale>
            </div>

            {/* Copy Link Option */}
            <Motion.HoverScale>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-2 border-metallic-silver/30 text-metallic-silver hover:bg-metallic-silver/10"
              >
                <Copy className="w-5 h-5" />
                <span>Copy to Clipboard</span>
              </Button>
            </Motion.HoverScale>
          </div>

          {/* Share Stats */}
          <div className="p-4 rounded-lg bg-asphalt-gray/30 space-y-2">
            <Typography.Small className="text-pulse-green font-medium">
              Why share your achievements?
            </Typography.Small>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Inspire friends to prioritize road safety</li>
              <li>• Build the S.O.S community</li>
              <li>• Show off your road hero status</li>
              <li>• Earn referral credits when friends join</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {onClose && (
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="flex-1 text-muted-foreground hover:text-foreground"
              >
                Maybe Later
              </Button>
            )}
            
            <Button 
              onClick={() => shareToSocial('twitter')}
              className="flex-1 bg-pulse-green hover:bg-pulse-green/80 text-midnight-black font-tech"
            >
              Share Now
            </Button>
          </div>
        </Card>
      </Motion.SlideInUp>
    </div>
  );
};

export default SocialSharing;