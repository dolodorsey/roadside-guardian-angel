import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  Star,
  Clock,
  Trophy,
  Target
} from 'lucide-react';

const EarningsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const earningsData = {
    today: { amount: 247.50, jobs: 5, hours: 6.5 },
    week: { amount: 1235.75, jobs: 23, hours: 31.5 },
    month: { amount: 4892.25, jobs: 89, hours: 142 }
  };

  const recentJobs = [
    { id: 1, type: 'Jump Start', customer: 'Sarah J.', amount: 45.00, time: '2:30 PM', rating: 5 },
    { id: 2, type: 'Fuel Delivery', customer: 'Mike R.', amount: 35.00, time: '1:15 PM', rating: 5 },
    { id: 3, type: 'Flat Tire', customer: 'Emma K.', amount: 65.00, time: '11:45 AM', rating: 4 },
    { id: 4, type: 'Lockout', customer: 'David L.', amount: 75.00, time: '10:20 AM', rating: 5 },
    { id: 5, type: 'Towing', customer: 'Lisa M.', amount: 120.00, time: '9:00 AM', rating: 5 }
  ];

  const achievements = [
    { id: 1, title: 'Speed Demon', description: '100 jobs under 10 min response', icon: '⚡', earned: true },
    { id: 2, title: 'Customer Favorite', description: '50 five-star ratings', icon: '⭐', earned: true },
    { id: 3, title: 'Weekend Warrior', description: 'Complete 20 weekend jobs', icon: '🛡️', earned: false },
    { id: 4, title: 'Night Owl', description: '25 jobs after 10 PM', icon: '🌙', earned: true }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-guardian text-2xl text-foreground mb-2">Earnings Dashboard</h1>
            <p className="text-muted-foreground">Track your performance and maximize your income</p>
          </div>
          <Link 
            to="/provider/dashboard"
            className="text-electric-blue hover:text-electric-blue/80 font-tech"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex gap-2 p-1 rounded-xl tech-surface border border-border/50 w-fit">
            {['today', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-lg font-tech transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Earnings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-neon-green/10 to-electric-blue/10 border border-neon-green/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-neon-green" />
              </div>
              <div>
                <div className="text-4xl font-guardian text-foreground">
                  ${earningsData[selectedPeriod as keyof typeof earningsData].amount.toFixed(2)}
                </div>
                <div className="text-neon-green font-tech">
                  {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Earnings
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-green" />
              <span className="text-neon-green text-sm">+12% from last {selectedPeriod}</span>
            </div>
          </div>

          <div className="p-6 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-electric-blue/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <div className="text-2xl font-guardian text-foreground">
                  {earningsData[selectedPeriod as keyof typeof earningsData].jobs}
                </div>
                <div className="text-electric-blue text-sm font-tech">Jobs Completed</div>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              Avg: ${(earningsData[selectedPeriod as keyof typeof earningsData].amount / earningsData[selectedPeriod as keyof typeof earningsData].jobs).toFixed(2)} per job
            </div>
          </div>

          <div className="p-6 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-emergency-red" />
              </div>
              <div>
                <div className="text-2xl font-guardian text-foreground">
                  {earningsData[selectedPeriod as keyof typeof earningsData].hours}h
                </div>
                <div className="text-emergency-red text-sm font-tech">Hours Online</div>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              ${(earningsData[selectedPeriod as keyof typeof earningsData].amount / earningsData[selectedPeriod as keyof typeof earningsData].hours).toFixed(2)} per hour
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-guardian text-xl text-foreground">Recent Jobs</h3>
              <button className="text-electric-blue hover:text-electric-blue/80 text-sm font-tech">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="p-4 rounded-xl tech-surface border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-tech text-foreground">{job.type}</div>
                      <div className="text-muted-foreground text-sm">{job.customer} • {job.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-guardian text-lg text-neon-green">
                        ${job.amount.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < job.rating ? 'text-neon-green fill-current' : 'text-metallic-silver/30'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Bonuses */}
          <div>
            <h3 className="font-guardian text-xl text-foreground mb-4">Achievements</h3>
            
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    achievement.earned
                      ? 'border-neon-green bg-neon-green/5 shadow-guardian'
                      : 'border-border/50 tech-surface'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      achievement.earned ? 'bg-neon-green/20' : 'bg-metallic-silver/20'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-tech ${
                        achievement.earned ? 'text-neon-green' : 'text-foreground'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Trophy className="w-5 h-5 text-neon-green" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Instant Payout */}
            <div className="mt-6 p-6 rounded-xl bg-electric-blue/10 border border-electric-blue/30">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-electric-blue" />
                <div>
                  <h4 className="font-guardian text-lg text-foreground">Instant Payout</h4>
                  <p className="text-muted-foreground text-sm">Cash out your earnings anytime</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-guardian text-electric-blue mb-1">
                  $247.50
                </div>
                <div className="text-muted-foreground text-sm">Available Balance</div>
              </div>

              <button className="w-full p-3 rounded-lg bg-electric-blue/20 border border-electric-blue/30 hover:bg-electric-blue/30 transition-colors">
                <span className="text-electric-blue font-tech">Cash Out Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;