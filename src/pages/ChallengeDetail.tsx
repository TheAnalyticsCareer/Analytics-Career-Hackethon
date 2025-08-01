import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download, Upload, Clock, Trophy, Users, Target,
  FileText, CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import Certificate from '../components/Certificate';
import CertificateDownloadButton from '../components/CertificateDownloadButton';
import GoogleFormModal from '../components/GoogleFormModal';

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { challenges, submissions, submitSolution } = useData();
  const { user, completeChallenge } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const challenge = challenges.find(c => c.id === id);
  const userSubmissions = submissions.filter(s => s.challengeId === id && s.userId === user?.id);

  useEffect(() => {
    if (!user || !challenge) return;
    const accepted = user.acceptedChallenges?.find(ac => ac.challengeId === challenge.id);
    if (accepted?.completed) setCompleted(true);
  }, [user, challenge]);

  // Show completed status when checkbox is checked
  useEffect(() => {
    if (checkboxChecked) {
      setCompleted(true);
    }
  }, [checkboxChecked]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!challenge || !user || !selectedFile) return;
    setUploading(true);
    try {
      await submitSolution(challenge.id, selectedFile);
      await completeChallenge(challenge.id);
      setCompleted(true);
      toast.success('Solution uploaded successfully!');
      setShowFormModal(true); // Show Google Form modal
    } catch (error) {
      toast.error('Failed to upload solution');
    } finally {
      setUploading(false);
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Challenge not found</h2>
          <Link to="/dashboard" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'upcoming': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/my-challenges" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Challenges
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{challenge.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>{challenge.difficulty}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${completed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : getStatusColor(challenge.status)}`}>{completed ? 'Completed' : challenge.status}</span>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{challenge.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[{
                  icon: Trophy, label: 'Points', value: challenge.points, color: 'from-yellow-500 to-orange-500'
                }, {
                  icon: Users, label: 'Submissions', value: challenge.submissionCount, color: 'from-blue-500 to-cyan-500'
                }, {
                  icon: Target, label: 'Max Score', value: challenge.maxScore, color: 'from-green-500 to-emerald-500'
                }, {
                  icon: Clock, label: 'Remaining', value: formatDistanceToNow(challenge.deadline), color: 'from-red-500 to-pink-500'
                }].map(({ icon: Icon, label, value, color }, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
            {challenge.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm">{tag}</span>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Instructions & Dataset */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Instructions</h2>
              <ol className="text-slate-600 dark:text-slate-400 list-decimal list-inside space-y-2">
                <li>Load and explore the provided dataset</li>
                <li>Perform data cleaning and preprocessing</li>
                <li>Conduct exploratory data analysis (EDA)</li>
                <li>Build predictive models or generate insights</li>
                <li>Create visualizations to support your findings</li>
                <li>Submit your analysis in CSV, JSON, or Notebook format</li>
              </ol>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Download className="w-5 h-5" /> Dataset</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Download the dataset from Google Drive and start your analysis.</p>
              <a href={challenge.datasetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                <Download className="w-4 h-4" /> Download Dataset
              </a>
            </div>
          </motion.div>

          {/* Right - Submission */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce" /> Submit Solution
              </h2>
              {user ? (
                <div className="flex flex-col items-center gap-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-700 w-full max-w-lg mx-auto">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">Submission Instructions</h3>
                    <ul className="text-sm text-slate-700 dark:text-slate-300 mb-4 list-disc list-inside">
                      <li>Click <span className="font-semibold text-blue-600">Submit Solution</span> to open the Google Form.</li>
                      <li>Upload your solution file in the form (.csv, .json, .ipynb, .py, .xlsx).</li>
                      <li>After submitting, return here and confirm by ticking the checkbox below.</li>
                      <li>Once confirmed, you can download your certificate.</li>
                    </ul>
                  </div>
                  {!completed && (
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdMEGOhXuSUmlYIEPNGwxHoQcplDGNwfbBObayuN1lYsWju2g/viewform?usp=header"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:from-blue-700 hover:to-purple-700${checkboxChecked ? ' opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                      onClick={() => {
                        if (!checkboxChecked) setShowCheckbox(true);
                      }}
                      // 'disabled' prop removed, not valid for <a> tag
                    >
                      <Upload className="inline-block w-5 h-5 mr-2 align-middle" />Submit Solution
                    </a>
                  )}
                  {showCheckbox && (
                    <div className="mt-4 flex flex-col items-center">
                      <label className="flex items-center gap-3 text-base font-medium text-slate-900 dark:text-white">
                        <input
                          type="checkbox"
                          checked={checkboxChecked}
                          disabled={checkboxChecked}
                          onChange={async () => {
                            if (!checkboxChecked && user && challenge) {
                              setCheckboxChecked(true);
                              await completeChallenge(challenge.id);
                            }
                          }}
                          className="accent-blue-600 w-5 h-5 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Submitted the solution</span>
                      </label>
                    </div>
                  )}
                  {completed && user && challenge && (
                    <div className="w-full flex justify-center my-6">
                      <CertificateDownloadButton 
                        elementId="certificate"
                        filename={`Certificate-${user.name}-${challenge.title}.pdf`} 
                        studentName={user.name}
                        challengeName={challenge.title}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Please sign in to submit your solution</p>
                  <Link to="/" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">Sign In</Link>
                </div>
              )}
            </div>

            {user && userSubmissions.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Your Submissions</h2>
                <div className="space-y-4">
                  {userSubmissions.map((submission) => (
                    <div key={submission.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-white">{submission.fileName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.status === 'evaluated' ? <CheckCircle className="w-4 h-4 text-green-500" /> : submission.status === 'pending' ? <Clock className="w-4 h-4 text-yellow-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{submission.score}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{submission.feedback}</p>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Submitted {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CertificateDownloadButton now shown only when checkbox is checked after submit */}
          </motion.div>
        </div>
      </div>
    {/* Google Form Modal removed, as Google Forms cannot be embedded in iframe */}
  </div>
  );
};

export default ChallengeDetail;