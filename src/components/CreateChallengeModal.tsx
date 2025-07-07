import React, { useState } from 'react';
import { X, Calendar, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

import { Challenge } from '../contexts/DataContext';
interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge?: Challenge | null;
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ isOpen, onClose, challenge }) => {
  const { addChallenge, updateChallenge } = useData();
  const getDefaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };
  const isEdit = !!challenge;
  const [formData, setFormData] = useState({
    title: challenge?.title || '',
    description: challenge?.description || '',
    difficulty: (challenge?.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    points: challenge?.points || 800,
    datasetUrl: challenge?.datasetUrl || '',
    tags: challenge?.tags ? challenge.tags.join(', ') : '',
    deadline: challenge?.deadline ? new Date(challenge.deadline).toISOString().slice(0, 10) : getDefaultDeadline(),
    imageUrl: challenge?.imageUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const challengeData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : new Date(),
        submissionCount: challenge?.submissionCount ?? 0,
        maxScore: challenge?.maxScore ?? 100,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'active' as const,
      };
      if (isEdit && challenge?.id) {
        await updateChallenge(challenge.id, challengeData);
        toast.success('Challenge updated successfully!');
      } else {
        await addChallenge(challengeData);
        toast.success('Challenge created successfully!');
      }
      onClose();
    } catch (error) {
      console.error(isEdit ? 'Edit challenge error:' : 'Create challenge error:', error);
      toast.error((isEdit ? 'Failed to update challenge: ' : 'Failed to create challenge: ') + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'difficulty') {
      let points = 800;
      if (value === 'easy') points = 450;
      else if (value === 'medium') points = 800;
      else if (value === 'hard') points = 1200;
      setFormData(prev => ({
        ...prev,
        difficulty: value as 'easy' | 'medium' | 'hard',
        points,
      }));
    } else if (name === 'deadline') {
      setFormData(prev => ({
        ...prev,
        deadline: value // YYYY-MM-DD
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'points' ? parseInt(value) || 0 : value
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  {isEdit ? 'Edit Challenge' : 'Create New Challenge'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Challenge Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter challenge title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the challenge and requirements"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    readOnly
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Dataset URL (Google Drive)
                </label>
                <input
                  type="url"
                  name="datasetUrl"
                  value={formData.datasetUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Python, Machine Learning, Data Analysis"
                />
              </div>

              {/* Challenge Image Link */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Challenge Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="https://example.com/image.png"
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Challenge Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  {isEdit ? 'Update Challenge' : 'Create Challenge'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateChallengeModal;