import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Clock,
  Download,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MyChallenges: React.FC = () => {
  const { user } = useAuth();
  const { challenges, submissions } = useData();

  const myAccepted = user?.acceptedChallenges || [];
  const myChallenges = challenges.filter(c =>
    myAccepted.some(ac => ac.challengeId === c.id)
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-8">
          My Challenges
        </h1>

        {myChallenges.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400">
            No challenges accepted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myChallenges.map(challenge => {
              const acceptedObj = myAccepted.find(
                ac => ac.challengeId === challenge.id
              );

              let remaining: string | null = null;
              if (acceptedObj) {
                const now = new Date();
                const deadline = new Date(challenge.deadline);
                const diff = deadline.getTime() - now.getTime();
                if (diff > 0) {
                  remaining = `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ${Math.floor(
                    (diff / (1000 * 60 * 60)) % 24
                  )}h ${Math.floor((diff / (1000 * 60)) % 60)}m`;
                } else {
                  remaining = 'Expired';
                }
              }

              const acceptedCompleted = acceptedObj?.completed;
              const completed =
                acceptedCompleted ||
                submissions.some(
                  s =>
                    s.userId === user?.id &&
                    s.challengeId === challenge.id &&
                    s.status === 'evaluated'
                );

              return (
                <div
                  key={challenge.id}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  {/* Challenge image */}
                  {challenge.imageUrl && (
                    <img src={challenge.imageUrl} alt={challenge.title} className="w-full h-40 object-cover rounded mb-3" />
                  )}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex-1 line-clamp-2">
                        {challenge.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
                          challenge.difficulty
                        )}`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                          challenge.status
                        )}`}
                      >
                        {challenge.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                      {challenge.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {challenge.points} points
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.submissionCount} submissions
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due {formatDistanceToNow(challenge.deadline, { addSuffix: true })}
                      </div>
                      {remaining && (
                        <div className="text-xs text-green-700 dark:text-green-400">
                          {remaining !== 'Expired' ? `⏳ ${remaining}` : '⚠️ Expired'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                    <a
                      href={challenge.datasetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      <Download className="w-4 h-4" />
                      Dataset
                    </a>

                    <Link
                      to={`/challenge/${challenge.id}`}
                      className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                    >
                      View Challenge
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    {completed && (
                      <span className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-700 rounded-lg text-center">
                        ✅ Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChallenges;
