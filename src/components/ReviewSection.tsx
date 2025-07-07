import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Léa Dubois',
    country: 'France',
    review:
      'Participating in this hackathon was a transformative experience. The challenges were thoughtfully designed, pushing me to apply advanced analytics and creative problem-solving. The platform’s instant feedback and global leaderboard kept me motivated throughout. I highly recommend this event to anyone serious about data science!',
    stars: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Mateo Rossi',
    country: 'Italy',
    review:
      'I loved the diversity of datasets and the real-world focus of the problems. Competing with talented participants from around the world was inspiring. The UI is smooth and the certificate system is a great touch. Looking forward to the next edition!',
    stars: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Sofia Müller',
    country: 'Germany',
    review:
      'This hackathon helped me grow my data skills and confidence. The review system and leaderboard are motivating, and the support team was always responsive. I made new friends and learned a lot. Danke schön!',
    stars: 4,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Akira Sato',
    country: 'Japan',
    review:
      'A fantastic event for data enthusiasts! The platform is intuitive, and the challenges are both fun and educational. Competing internationally was a unique experience. Highly recommended for anyone wanting to test their skills.',
    stars: 5,
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
];

const ReviewSection: React.FC = () => {
  return (
    <section className="py-10 px-4 bg-gradient-to-br from-purple-50/60 to-blue-50/60 dark:from-slate-900/60 dark:to-slate-800/60">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-6">
          What Participants Say
        </h2>
        <p className="text-center text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          Join a global community of data scientists and analysts. Here’s what our top participants from around the world have to say about this hackathon:
        </p>

        <div className="overflow-x-auto scrollbar-hide">
          <motion.div
            className="flex gap-4 md:gap-6 w-max px-1 md:px-0"
            style={{ touchAction: 'pan-x' }}
            initial={{ x: 0 }}
            animate={{ x: [0, -360, 0] }}
            transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
          >
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 px-5 py-6 w-[260px] md:w-[300px] flex-shrink-0 flex flex-col items-center h-[280px] md:h-[240px] hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.05 }}
              >
                <img src={r.avatar} alt={r.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full mb-2 border-2 border-blue-200 dark:border-blue-700 shadow" />
                <div className="flex items-center gap-2 mb-1 text-center">
                  <span className="font-semibold text-slate-900 dark:text-white text-base md:text-lg">{r.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">({r.country})</span>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className={`w-4 h-4 md:w-5 md:h-5 ${idx < r.stars ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm text-center line-clamp-5 md:line-clamp-4">
                  {r.review}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hide scrollbar for all browsers */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </section>
  );
};

export default ReviewSection;
