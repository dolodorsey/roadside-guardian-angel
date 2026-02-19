import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import RewardsHub from './RewardsHub';
import ReferralFlow from './ReferralFlow';
import BadgeSystem from './BadgeSystem';
import SocialSharing from './SocialSharing';

const GamificationShowcase = () => {
  const [showReferralFlow, setShowReferralFlow] = useState(false);
  const [showSocialSharing, setShowSocialSharing] = useState(false);
  const [socialAchievement, setSocialAchievement] = useState(null);

  // Mock user stats for demo
  const mockUserStats = {
    totalRescues: 12,
    referrals: 3,
    loginStreak: 7,
    avgResponseTime: 4.2,
    yearsSafe: 1
  };

  const triggerSocialShare = (achievement: any) => {
    setSocialAchievement(achievement);
    setShowSocialSharing(true);
  };

  const mockAchievements = [
    {
      type: 'badge' as const,
      title: 'Road Hero',
      description: 'Completed 50 roadside rescues',
      value: 50
    },
    {
      type: 'milestone' as const,
      title: 'First Month Complete',
      description: 'One month of safe driving with S.O.S',
      value: '1 month'
    },
    {
      type: 'referral' as const,
      title: 'Friend Saver',
      description: 'Referred 5 friends to S.O.S',
      value: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Motion.GuardianEnter className="text-center space-y-4">
          <Typography.Hero className="text-4xl md:text-6xl">
            Roadside Rewards
          </Typography.Hero>
          <Typography.Subheadline className="text-muted-foreground">
            Gamification & Loyalty System
          </Typography.Subheadline>
          <Typography.Body className="max-w-2xl mx-auto">
            Cash App meets Fortnite meets Amex Platinum — cultural fun, financial perks, and premium credibility.
          </Typography.Body>
        </Motion.GuardianEnter>

        {/* Main Content */}
        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="rewards">Rewards Hub</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          {/* Rewards Hub */}
          <TabsContent value="rewards">
            <div className="max-w-2xl mx-auto">
              <RewardsHub />
            </div>
          </TabsContent>

          {/* Badge System */}
          <TabsContent value="badges">
            <BadgeSystem userStats={mockUserStats} />
          </TabsContent>

          {/* Referral System */}
          <TabsContent value="referrals" className="space-y-6">
            <div className="text-center space-y-4">
              <Typography.Subheadline>Referral System</Typography.Subheadline>
              <Typography.Body className="text-muted-foreground">
                "Save your friends — and earn credit"
              </Typography.Body>
            </div>
            
            <div className="max-w-md mx-auto">
              <Motion.HoverScale>
                <div 
                  className="p-8 rounded-2xl tech-surface border border-pulse-green/30 cursor-pointer text-center space-y-4"
                  onClick={() => setShowReferralFlow(true)}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <Typography.Subheadline className="text-pulse-green">
                    Start Referring
                  </Typography.Subheadline>
                  <Typography.Body className="text-muted-foreground">
                    Share your code and earn $5 for each friend who signs up
                  </Typography.Body>
                </div>
              </Motion.HoverScale>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emergency-red/20 flex items-center justify-center">
                  <span className="font-guardian text-xl text-emergency-red">1</span>
                </div>
                <Typography.Body className="font-medium">Share Your Code</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Send friends your unique referral link via text, email, or social media
                </Typography.Small>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-beacon-blue/20 flex items-center justify-center">
                  <span className="font-guardian text-xl text-beacon-blue">2</span>
                </div>
                <Typography.Body className="font-medium">Friend Signs Up</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Your friend downloads Roadside and completes registration
                </Typography.Small>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
                  <span className="font-guardian text-xl text-pulse-green">3</span>
                </div>
                <Typography.Body className="font-medium">Both Earn $5</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Instant credit added to both S.O.S Wallets automatically
                </Typography.Small>
              </div>
            </div>
          </TabsContent>

          {/* Social Sharing */}
          <TabsContent value="social" className="space-y-6">
            <div className="text-center space-y-4">
              <Typography.Subheadline>Social Achievements</Typography.Subheadline>
              <Typography.Body className="text-muted-foreground">
                Share your road hero moments with the world
              </Typography.Body>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {mockAchievements.map((achievement, index) => (
                <Motion.HoverScale key={index}>
                  <div 
                    className="p-6 rounded-xl tech-surface border border-border/50 cursor-pointer"
                    onClick={() => triggerSocialShare(achievement)}
                  >
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
                        <span className="text-xl">🏆</span>
                      </div>
                      <Typography.Body className="font-medium text-pulse-green">
                        {achievement.title}
                      </Typography.Body>
                      <Typography.Small className="text-muted-foreground">
                        {achievement.description}
                      </Typography.Small>
                      <Typography.Caption className="text-beacon-blue">
                        Click to share
                      </Typography.Caption>
                    </div>
                  </div>
                </Motion.HoverScale>
              ))}
            </div>

            <div className="max-w-2xl mx-auto p-6 rounded-xl tech-surface border border-pulse-green/30">
              <Typography.Body className="font-medium text-pulse-green mb-4">
                Why Share Achievements?
              </Typography.Body>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Build your road hero reputation</li>
                <li>• Inspire friends to prioritize safety</li>
                <li>• Grow the S.O.S community</li>
                <li>• Earn bonus credits through engagement</li>
                <li>• Showcase your driving responsibility</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Overlay Components */}
        {showReferralFlow && (
          <ReferralFlow onClose={() => setShowReferralFlow(false)} />
        )}

        {showSocialSharing && socialAchievement && (
          <SocialSharing 
            achievement={socialAchievement}
            onClose={() => setShowSocialSharing(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GamificationShowcase;