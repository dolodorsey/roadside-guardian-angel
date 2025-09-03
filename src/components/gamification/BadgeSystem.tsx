import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Trophy, Shield, Star, Crown, Medal, Award, Zap, Users, Clock, Target } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'special';
  requirement: number | string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface BadgeSystemProps {
  userStats: {
    totalRescues: number;
    referrals: number;
    loginStreak: number;
    avgResponseTime: number;
    yearsSafe: number;
  };
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ userStats }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Badge | null>(null);

  const badges: Badge[] = [
    // Rescue Badges
    {
      id: 'first-rescue',
      name: 'First Rescue',
      description: 'Complete your first Roadside service',
      icon: Trophy,
      tier: 'bronze',
      requirement: 1,
      unlocked: userStats.totalRescues >= 1,
      progress: Math.min(userStats.totalRescues, 1),
      maxProgress: 1
    },
    {
      id: 'road-helper',
      name: 'Road Helper',
      description: 'Complete 10 Roadside services',
      icon: Shield,
      tier: 'silver',
      requirement: 10,
      unlocked: userStats.totalRescues >= 10,
      progress: Math.min(userStats.totalRescues, 10),
      maxProgress: 10
    },
    {
      id: 'road-hero',
      name: 'Road Hero',
      description: 'Complete 50 Roadside services',
      icon: Star,
      tier: 'gold',
      requirement: 50,
      unlocked: userStats.totalRescues >= 50,
      progress: Math.min(userStats.totalRescues, 50),
      maxProgress: 50
    },
    {
      id: 'road-legend',
      name: 'Road Legend',
      description: 'Complete 100+ Roadside services',
      icon: Crown,
      tier: 'platinum',
      requirement: 100,
      unlocked: userStats.totalRescues >= 100,
      progress: Math.min(userStats.totalRescues, 100),
      maxProgress: 100
    },

    // Referral Badges
    {
      id: 'friend-saver',
      name: 'Friend Saver',
      description: 'Refer 3 friends to Roadside',
      icon: Users,
      tier: 'bronze',
      requirement: 3,
      unlocked: userStats.referrals >= 3,
      progress: Math.min(userStats.referrals, 3),
      maxProgress: 3
    },
    {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Refer 10 friends to Roadside',
      icon: Users,
      tier: 'gold',
      requirement: 10,
      unlocked: userStats.referrals >= 10,
      progress: Math.min(userStats.referrals, 10),
      maxProgress: 10
    },

    // Engagement Badges
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Login 7 days in a row',
      icon: Clock,
      tier: 'bronze',
      requirement: 7,
      unlocked: userStats.loginStreak >= 7,
      progress: Math.min(userStats.loginStreak, 7),
      maxProgress: 7
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Average response time under 5 minutes',
      icon: Zap,
      tier: 'special',
      requirement: '< 5 min avg',
      unlocked: userStats.avgResponseTime < 5,
      progress: userStats.avgResponseTime < 5 ? 1 : 0,
      maxProgress: 1
    },

    // Safety Badges
    {
      id: 'safe-driver',
      name: 'Safe Driver',
      description: 'One full year without emergencies',
      icon: Shield,
      tier: 'silver',
      requirement: '1 year safe',
      unlocked: userStats.yearsSafe >= 1,
      progress: userStats.yearsSafe >= 1 ? 1 : 0,
      maxProgress: 1
    }
  ];

  const getTierColors = (tier: Badge['tier']) => {
    const colors = {
      bronze: {
        bg: 'bg-yellow-600/20',
        text: 'text-yellow-600',
        border: 'border-yellow-600/30',
        glow: 'drop-shadow-[0_0_8px_hsl(45_100%_50%/0.4)]'
      },
      silver: {
        bg: 'bg-metallic-silver/20',
        text: 'text-metallic-silver',
        border: 'border-metallic-silver/30',
        glow: 'drop-shadow-[0_0_8px_hsl(var(--metallic-silver)/0.4)]'
      },
      gold: {
        bg: 'bg-yellow-400/20',
        text: 'text-yellow-400',
        border: 'border-yellow-400/30',
        glow: 'drop-shadow-[0_0_8px_hsl(45_100%_60%/0.5)]'
      },
      platinum: {
        bg: 'bg-pulse-green/20',
        text: 'text-pulse-green',
        border: 'border-pulse-green/30',
        glow: 'drop-shadow-[0_0_12px_hsl(var(--pulse-green)/0.6)]'
      },
      special: {
        bg: 'bg-beacon-blue/20',
        text: 'text-beacon-blue',
        border: 'border-beacon-blue/30',
        glow: 'drop-shadow-[0_0_10px_hsl(var(--beacon-blue)/0.5)]'
      }
    };
    return colors[tier];
  };

  // Simulate badge unlock animation
  const simulateBadgeUnlock = (badge: Badge) => {
    if (!badge.unlocked) return;
    
    setNewlyUnlocked(badge);
    setTimeout(() => {
      setNewlyUnlocked(null);
    }, 3000);
  };

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  return (
    <div className="space-y-6">
      {/* New Badge Unlock Animation */}
      {newlyUnlocked && (
        <Motion.CompletionGlow className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-black/80 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <Motion.ProviderLock>
              <div className={`w-32 h-32 mx-auto rounded-full ${getTierColors(newlyUnlocked.tier).bg} border-2 ${getTierColors(newlyUnlocked.tier).border} flex items-center justify-center ${getTierColors(newlyUnlocked.tier).glow}`}>
                <newlyUnlocked.icon className={`w-16 h-16 ${getTierColors(newlyUnlocked.tier).text}`} />
              </div>
            </Motion.ProviderLock>
            
            <div className="space-y-2">
              <Typography.Emergency className={getTierColors(newlyUnlocked.tier).text}>
                BADGE UNLOCKED!
              </Typography.Emergency>
              <Typography.Headline className={getTierColors(newlyUnlocked.tier).text}>
                {newlyUnlocked.name}
              </Typography.Headline>
              <Typography.Body className="max-w-sm mx-auto">
                {newlyUnlocked.description}
              </Typography.Body>
            </div>
          </div>
        </Motion.CompletionGlow>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <Typography.Subheadline>Achievement Badges</Typography.Subheadline>
        <Typography.Small className="text-muted-foreground">
          {unlockedBadges.length} of {badges.length} badges unlocked
        </Typography.Small>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div>
          <Typography.Body className="mb-4 font-medium">Unlocked Badges</Typography.Body>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unlockedBadges.map((badge) => {
              const colors = getTierColors(badge.tier);
              return (
                <Motion.HoverScale key={badge.id}>
                  <Card 
                    className={`tech-surface p-4 cursor-pointer border ${colors.border} hover:border-opacity-60 transition-all`}
                    onClick={() => simulateBadgeUnlock(badge)}
                  >
                    <div className="text-center space-y-3">
                      <div className={`w-16 h-16 mx-auto rounded-full ${colors.bg} flex items-center justify-center ${colors.glow}`}>
                        <badge.icon className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      
                      <div>
                        <Typography.Small className={`font-medium ${colors.text}`}>
                          {badge.name}
                        </Typography.Small>
                        <Typography.Caption className="text-muted-foreground block mt-1">
                          {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
                        </Typography.Caption>
                      </div>
                    </div>
                  </Card>
                </Motion.HoverScale>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <Typography.Body className="mb-4 font-medium">In Progress</Typography.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedBadges.map((badge) => {
              const colors = getTierColors(badge.tier);
              const progressPercentage = badge.progress && badge.maxProgress 
                ? (badge.progress / badge.maxProgress) * 100 
                : 0;

              return (
                <Card key={badge.id} className="tech-surface p-4 opacity-60">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${colors.bg} opacity-50 flex items-center justify-center`}>
                      <badge.icon className={`w-6 h-6 ${colors.text} opacity-50`} />
                    </div>
                    
                    <div className="flex-1">
                      <Typography.Small className="text-foreground font-medium">
                        {badge.name}
                      </Typography.Small>
                      <Typography.Caption className="text-muted-foreground block">
                        {badge.description}
                      </Typography.Caption>
                      
                      {badge.progress !== undefined && badge.maxProgress && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {badge.progress}/{badge.maxProgress}
                            </span>
                            <span className={colors.text}>
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted/20 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${colors.bg.replace('/20', '')} transition-all duration-300`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeSystem;