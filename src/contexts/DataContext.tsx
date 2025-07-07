
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';


export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  deadline: Date;
  datasetUrl: string;
  submissionCount: number;
  maxScore: number;
  tags: string[];
  status: 'active' | 'completed' | 'upcoming';
  imageUrl?: string; // URL of the challenge image
}

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  score: number;
  feedback: string;
  submittedAt: Date;
  status: 'pending' | 'evaluated' | 'failed';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  challengesCompleted: number;
  averageScore: number;
  badges: string[];
  lastActive: Date;
  rank: number;
}

interface DataContextType {
  challenges: Challenge[];
  submissions: Submission[];
  leaderboard: LeaderboardEntry[];
  addChallenge: (challenge: Omit<Challenge, 'id'>) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  submitSolution: (challengeId: string, file: File) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Fetch challenges from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'challenges'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Challenge[] = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title,
          description: d.description,
          difficulty: d.difficulty,
          points: d.points,
          deadline: d.deadline instanceof Timestamp ? d.deadline.toDate() : new Date(d.deadline),
          datasetUrl: d.datasetUrl,
          submissionCount: d.submissionCount || 0,
          maxScore: d.maxScore || 100,
          tags: d.tags || [],
          status: d.status,
          imageUrl: d.imageUrl || '',
        };
      });
      setChallenges(data);
    });
    return () => unsubscribe();
  }, []);

  // Save challenges to localStorage for AuthContext expiry logic
  useEffect(() => {
    if (challenges.length > 0) {
      localStorage.setItem('datasprint_challenges', JSON.stringify(challenges));
    }
  }, [challenges]);

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Fetch submissions from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'submissions'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Submission[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          challengeId: d.challengeId,
          userId: d.userId,
          fileName: d.fileName,
          fileUrl: d.fileUrl,
          score: d.score ?? 0,
          feedback: d.feedback ?? '',
          submittedAt: d.submittedAt?.toDate ? d.submittedAt.toDate() : new Date(),
          status: d.status ?? 'pending',
          userName: d.userName,
          userEmail: d.userEmail,
        };
      });
      setSubmissions(data.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()));
    });
    return () => unsubscribe();
  }, []);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Fetch leaderboard from Firestore users collection, sorted by points descending
  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: LeaderboardEntry[] = snapshot.docs
        .map((doc: any, idx: number) => {
          const d = doc.data();
          // Calculate badges
          let badges = Array.isArray(d.badges) ? [...d.badges] : [];
          // Welcome badge for new users
          if ((d.points || 0) === 0 && !badges.includes('Welcome')) {
            badges.push('Welcome');
          }
          // Bronze badge for 450+ points
          if ((d.points || 0) >= 450 && !badges.includes('Bronze')) {
            badges.push('Bronze');
          }
          // Silver badge for 1000+ points
          if ((d.points || 0) >= 1000 && !badges.includes('Silver')) {
            badges.push('Silver');
          }
          // Gold badge for 2000+ points
          if ((d.points || 0) >= 2000 && !badges.includes('Gold')) {
            badges.push('Gold');
          }
          // Marathoner badge for 10+ challenges completed
          if (Array.isArray(d.acceptedChallenges) && d.acceptedChallenges.filter((ac: any) => ac.completed).length >= 10 && !badges.includes('Marathoner')) {
            badges.push('Marathoner');
          }
          // Consistent badge for 3+ consecutive weeks active (dummy logic: lastActive within 21 days)
          if (d.lastActive) {
            const lastActiveDate = d.lastActive.toDate ? d.lastActive.toDate() : new Date(d.lastActive);
            const diffMs = Date.now() - lastActiveDate.getTime();
            if (diffMs < 21 * 24 * 60 * 60 * 1000 && !badges.includes('Consistent')) {
              badges.push('Consistent');
            }
          }
          return {
            id: d.id || doc.id,
            name: d.name || d.email?.split('@')[0] || 'User',
            email: d.email,
            totalPoints: d.points || 0,
            challengesCompleted: d.acceptedChallenges ? d.acceptedChallenges.length : 0,
            averageScore: d.averageScore || 0,
            badges,
            lastActive: d.lastActive ? (d.lastActive.toDate ? d.lastActive.toDate() : new Date(d.lastActive)) : new Date(),
            rank: idx + 1,
          };
        })
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.totalPoints - a.totalPoints)
        .map((entry: LeaderboardEntry, idx: number) => ({ ...entry, rank: idx + 1 }));
      setLeaderboard(data);
    });
    return () => unsubscribe();
  }, []);

  const addChallenge = async (challenge: Omit<Challenge, 'id'>) => {
    // Save challenge to Firestore
    await addDoc(collection(db, 'challenges'), {
      ...challenge,
      deadline: challenge.deadline instanceof Date ? challenge.deadline : new Date(challenge.deadline),
      createdAt: serverTimestamp(),
      imageUrl: challenge.imageUrl || '',
    });
  };

  const updateChallenge = async (id: string, updates: Partial<Challenge>) => {
    // Update challenge in Firestore
    const challengeRef = doc(db, 'challenges', id);
    await updateDoc(challengeRef, {
      ...updates,
      ...(updates.deadline ? { deadline: updates.deadline instanceof Date ? updates.deadline : new Date(updates.deadline) } : {}),
      ...(updates.imageUrl !== undefined ? { imageUrl: updates.imageUrl } : {}),
    });
  };

  const deleteChallenge = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'challenges', id));
      // Optionally show toast here, but best to do in UI
    } catch (err) {
      throw err;
    }
  };

  const submitSolution = async (challengeId: string, file: File) => {
    // Upload file to backend which uploads to Google Drive
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Upload failed');

      // Get user info from localStorage (as DataContext does not have direct access to AuthContext)
      const userRaw = localStorage.getItem('datasprint_user');
      let userId = '', userName = '', userEmail = '';
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          userId = user.id || '';
          userName = user.name || '';
          userEmail = user.email || '';
        } catch {}
      }

      // Save submission to Firestore
      await addDoc(collection(db, 'submissions'), {
        challengeId,
        userId,
        userName,
        userEmail,
        fileName: file.name,
        fileUrl: data.fileUrl || '',
        score: 0, // Default, to be updated after evaluation
        feedback: '', // Default, to be updated after evaluation
        submittedAt: serverTimestamp(),
        status: 'pending',
      });

      // Increment submissionCount for the challenge
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        submissionCount: increment(1)
      });
      // No need to update local state, real-time listener will update
    } catch (err) {
      throw err;
    }
  };

  const value = {
    challenges,
    submissions,
    leaderboard,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    submitSolution,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;