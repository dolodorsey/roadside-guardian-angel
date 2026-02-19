import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '../design-system/RoadsideTypography';
import { RoadsideIcons } from '../design-system/RoadsideIcons';
import { Motion } from '../design-system/RoadsideMotion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Trophy, Shield, Star, Gift, Users, Clock, Zap } from 'lucide-react';

interface UserStats {
  walletBalance: number;
  totalRescues: number;
  referrals: number;
  currentBadge: 'bronze' | 'silver' | 'gold' | 'platinum';
  loginStreak: number;
  yearsSafe: number;
}

const RewardsHub = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    walletBalance: 25,
    totalRescues: 12,
    referrals: 3,
    currentBadge: 'silver',
    loginStreak: 7,
    yearsSafe: 1
  });

  const [recentReward, setRecentReward] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Mock new reward animation
  const simulateReward = (amount: number, reason: string) => {
    setUserStats(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));
    setRecentReward(`+$${amount} ${reason}`);
    setShowCelebration(true);
    
    setTimeout(() => {
      setShowCelebration(false);
      setRecentReward(null);
    }, 3000);
  };

  const getBadgeInfo = (badge: string) => {
    const badges = {
      bronze: { 
        name: 'First Rescue', 
        icon: Trophy, 
        color: 'text-yellow-600',
        glow: 'drop-shadow-[0_0_8px_hsl(45_100%_50%/0.4)]'
      },
      silver: { 
        name: 'Road Helper', 
        icon: Shield, 
        color: 'text-metallic-silver',
        glow: 'drop-shadow-[0_0_8px_hsl(var(--metallic-silver)/0.4)]'
      },
      gold: { 
        name: 'Road Hero', 
        icon: Star, 
        color: 'text-yellow-400',
        glow: 'drop-shadow-[0_0_8px_hsl(45_100%_60%/0.5)]'
      },
      platinum: { 
        name: 'Road Legend', 
        icon: Shield, 
        color: 'text-pulse-green',
        glow: 'drop-shadow-[0_0_12px_hsl(var(--pulse-green)/0.6)]'
      }
    };
    return badges[badge as keyof typeof badges];
  };

  const getNextBadgeRequirement = () => {
    const requirements = {
      bronze: 1,
      silver: 10,
      gold: 50,
      platinum: 100
    };
    
    const current = requirements[userStats.currentBadge as keyof typeof requirements];
    const next = Object.entries(requirements).find(([key, value]) => value > current);
    
    if (!next) return { name: 'Max Level', required: 0, progress: 100 };
    
    return {
      name: getBadgeInfo(next[0]).name,
      required: next[1],
      progress: (userStats.totalRescues / next[1]) * 100
    };
  };

  const currentBadge = getBadgeInfo(userStats.currentBadge);
  const nextBadge = getNextBadgeRequirement();

  return (
    <div className="space-y-6 p-6">
      {/* Celebration Overlay */}
      {showCelebration && (
        <Motion.CompletionGlow className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-black/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <Motion.SOSRipple className="w-24 h-24 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
              <Coins className="w-12 h-12 text-pulse-green animate-heartbeat" />
            </Motion.SOSRipple>
            <Typography.Emergency className="text-pulse-green">
              REWARD EARNED!
            </Typography.Emergency>
            <Typography.Headline className="text-pulse-green">
              {recentReward}
            </Typography.Headline>
          </div>
        </Motion.CompletionGlow>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <Typography.Headline>Rewards Hub</Typography.Headline>
        <Typography.Body className="text-muted-foreground">
          Earn credit, unlock badges, and share the safety
        </Typography.Body>
      </div>

      {/* Wallet Balance */}
      <Motion.GuardianEnter>
        <Card className="tech-surface p-6 relative overflow-hidden">
          <Motion.PremiumShimmer>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-pulse-green/20 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-pulse-green" />
                </div>
                <div>
                  <Typography.Subheadline>S.O.S Wallet</Typography.Subheadline>
                  <Typography.Small>Available credit</Typography.Small>
                </div>
              </div>
              <div className="text-right">
                <Typography.Hero className="text-3xl text-pulse-green">
                  ${userStats.walletBalance}
                </Typography.Hero>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10"
                onClick={() => simulateReward(5, "Referral Bonus")}
              >
                Add Funds
              </Button>
              <Button 
                variant="outline"
                className="border-beacon-blue/30 text-beacon-blue hover:bg-beacon-blue/10"
              >
                View History
              </Button>
            </div>
          </Motion.PremiumShimmer>
        </Card>
      </Motion.GuardianEnter>

      {/* Current Badge */}
      <Motion.SlideInUp>
        <Card className="tech-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <Typography.Subheadline>Your Status</Typography.Subheadline>
            <Badge className="bg-pulse-green/20 text-pulse-green border-pulse-green/30">
              {userStats.totalRescues} Rescues
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <Motion.ProviderLock className="relative">
              <div className={`w-16 h-16 rounded-full bg-gradient-luxury flex items-center justify-center ${currentBadge.glow}`}>
                <currentBadge.icon className={`w-8 h-8 ${currentBadge.color}`} />
              </div>
            </Motion.ProviderLock>
            
            <div className="flex-1">
              <Typography.Subheadline className={currentBadge.color}>
                {currentBadge.name}
              </Typography.Subheadline>
              <Typography.Small>
                Next: {nextBadge.name} ({nextBadge.required - userStats.totalRescues} rescues to go)
              </Typography.Small>
              <Progress value={nextBadge.progress} className="mt-2" />
            </div>
          </div>
        </Card>
      </Motion.SlideInUp>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Motion.HoverGlow variant="beacon">
          <Card className="tech-surface p-4 cursor-pointer" onClick={() => simulateReward(5, "Referral Bonus")}>
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-beacon-blue" />
              <div>
                <Typography.Tech>Refer Friends</Typography.Tech>
                <Typography.Caption>Earn $5 each</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.HoverGlow>

        <Motion.HoverGlow variant="success">
          <Card className="tech-surface p-4 cursor-pointer">
            <div className="flex items-center space-x-3">
              <Gift className="w-8 h-8 text-pulse-green" />
              <div>
                <Typography.Tech>Daily Bonus</Typography.Tech>
                <Typography.Caption>Login streak: {userStats.loginStreak}</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.HoverGlow>
      </div>

      {/* Achievements Grid */}
      <Card className="tech-surface p-6">
        <Typography.Subheadline className="mb-4">Achievements</Typography.Subheadline>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Referral Achievement */}
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
              userStats.referrals >= 3 ? 'bg-pulse-green/20' : 'bg-muted/20'
            }`}>
              <Users className={`w-6 h-6 ${
                userStats.referrals >= 3 ? 'text-pulse-green' : 'text-muted-foreground'
              }`} />
            </div>
            <Typography.Caption>Friend Saver</Typography.Caption>
            <Typography.Small className="text-muted-foreground">
              {userStats.referrals}/3
            </Typography.Small>
          </div>

          {/* Streak Achievement */}
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
              userStats.loginStreak >= 7 ? 'bg-beacon-blue/20' : 'bg-muted/20'
            }`}>
              <Clock className={`w-6 h-6 ${
                userStats.loginStreak >= 7 ? 'text-beacon-blue' : 'text-muted-foreground'
              }`} />
            </div>
            <Typography.Caption>Week Warrior</Typography.Caption>
            <Typography.Small className="text-muted-foreground">
              {userStats.loginStreak}/7 days
            </Typography.Small>
          </div>

          {/* Safe Driver Achievement */}
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
              userStats.yearsSafe >= 1 ? 'bg-metallic-silver/20' : 'bg-muted/20'
            }`}>
              <Shield className={`w-6 h-6 ${
                userStats.yearsSafe >= 1 ? 'text-metallic-silver' : 'text-muted-foreground'
              }`} />
            </div>
            <Typography.Caption>Safe Driver</Typography.Caption>
            <Typography.Small className="text-muted-foreground">
              {userStats.yearsSafe} year{userStats.yearsSafe !== 1 ? 's' : ''}
            </Typography.Small>
          </div>

          {/* Speed Achievement */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-muted-foreground" />
            </div>
            <Typography.Caption>Quick Responder</Typography.Caption>
            <Typography.Small className="text-muted-foreground">
              0/5 fast requests
            </Typography.Small>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="tech-surface p-6">
        <Typography.Subheadline className="mb-4">Recent Activity</Typography.Subheadline>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-pulse-green/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-pulse-green" />
              </div>
              <div>
                <Typography.Small className="text-foreground">Referral bonus earned</Typography.Small>
                <Typography.Caption>2 days ago</Typography.Caption>
              </div>
            </div>
            <Typography.Tech className="text-pulse-green">+$5</Typography.Tech>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-beacon-blue/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-beacon-blue" />
              </div>
              <div>
                <Typography.Small className="text-foreground">Weekly login streak</Typography.Small>
                <Typography.Caption>1 week ago</Typography.Caption>
              </div>
            </div>
            <Typography.Tech className="text-beacon-blue">+$2</Typography.Tech>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-metallic-silver/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-metallic-silver" />
              </div>
              <div>
                <Typography.Small className="text-foreground">Silver Badge unlocked</Typography.Small>
                <Typography.Caption>1 month ago</Typography.Caption>
              </div>
            </div>
            <Typography.Tech className="text-metallic-silver">Badge</Typography.Tech>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RewardsHub;