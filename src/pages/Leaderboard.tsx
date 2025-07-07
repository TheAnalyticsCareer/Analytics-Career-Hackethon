import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Crown,
  Star,
  Users,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Leaderboard: React.FC = () => {
  let { leaderboard } = useData();
  leaderboard = leaderboard.filter((entry) => entry.email !== 'admin@datasprint.com');
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>('all');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-slate-600 dark:text-slate-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gradient-to-r from-slate-400 to-slate-600';
    }
  };

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Compete with data scientists from around the world</p>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <div className="flex flex-wrap items-end justify-center gap-8 mb-8">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <Medal className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-w-[200px]">
                  <h3 className="font-bold text-slate-900 dark:text-white">{topThree[1].name}</h3>
                  <div className="text-2xl font-bold text-gray-500">{topThree[1].totalPoints.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">points</div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="text-center transform scale-110">
                <div className="relative mb-4">
                  <div className="w-28 h-28 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Users className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border-2 border-yellow-400 min-w-[220px]">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{topThree[0].name}</h3>
                  <div className="text-3xl font-bold text-yellow-600">{topThree[0].totalPoints.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">points</div>
                  <div className="flex justify-center mt-3">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-w-[200px]">
                  <h3 className="font-bold text-slate-900 dark:text-white">{topThree[2].name}</h3>
                  <div className="text-2xl font-bold text-amber-500">{topThree[2].totalPoints.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">points</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Full Rankings</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>

          {/* 👇 Table scroll wrapper for mobile */}
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-left">
                {/* Optional: Add sticky header on scroll */}
                {/* className="sticky top-0 z-10" */}
                <tr>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400">Rank</th>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400">User</th>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400">Total Points</th>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400">Challenges</th>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400">Badges</th>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = user && user.email === entry.email;
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${
                        isCurrentUser ? 'bg-blue-100 dark:bg-blue-900/40 font-semibold border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <td className="px-6 py-4">{getRankIcon(entry.rank)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${getRankBg(entry.rank)} flex items-center justify-center`}>
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{entry.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-white">{entry.totalPoints.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{entry.challengesCompleted}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {entry.badges.map((badge, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {formatDistanceToNow(entry.lastActive, { addSuffix: true })}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
