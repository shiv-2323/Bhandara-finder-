import React, { useState } from 'react';
import { BhandaraEvent, Review, Language } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bhandara: BhandaraEvent | null;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  lang: Language;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  bhandara,
  reviews,
  onAddReview,
  lang,
}) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [crowdLevel, setCrowdLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [foodQuality, setFoodQuality] = useState<'Excellent' | 'Good' | 'Average'>('Excellent');

  if (!isOpen || !bhandara) return null;

  const eventReviews = reviews.filter((r) => r.bhandaraId === bhandara.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;

    onAddReview({
      bhandaraId: bhandara.id,
      userName,
      rating,
      comment,
      crowdLevel,
      foodQuality,
    });

    setUserName('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[700] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-lg my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-[#F4811F] to-[#C96000] text-white p-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold font-['Baloo_2']">
            ⭐ {bhandara.name} — {lang === 'hi' ? 'समीक्षा एवं अनुभव' : 'Reviews & Feedback'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Form to submit review */}
          <form onSubmit={handleSubmit} className="bg-[var(--bg-input)] border border-[var(--border)] p-4 rounded-2xl space-y-3">
            <h4 className="text-sm font-extrabold text-[var(--text-head)]">
              ✍️ {lang === 'hi' ? 'अपना अनुभव साझा करें' : 'Share Your Experience'}
            </h4>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'आपका नाम' : 'Your Name'}
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: राहुल शर्मा' : 'e.g. Rahul Sharma'}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-muted)]">
                {lang === 'hi' ? 'स्टार रेटिंग:' : 'Rating:'}
              </span>
              <div className="flex gap-1 text-amber-500 cursor-pointer text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? 'opacity-100' : 'opacity-30'}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  {lang === 'hi' ? 'भीड़ का स्तर' : 'Crowd Level'}
                </label>
                <select
                  value={crowdLevel}
                  onChange={(e) => setCrowdLevel(e.target.value as any)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-2 py-1 text-xs focus:outline-none focus:border-[#F4811F]"
                >
                  <option value="Low">Low (कम भीड़)</option>
                  <option value="Medium">Medium (मध्यम)</option>
                  <option value="High">High (ज्यादा भीड़)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  {lang === 'hi' ? 'भोजन गुणवत्ता' : 'Food Quality'}
                </label>
                <select
                  value={foodQuality}
                  onChange={(e) => setFoodQuality(e.target.value as any)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-2 py-1 text-xs focus:outline-none focus:border-[#F4811F]"
                >
                  <option value="Excellent">Excellent (उत्कृष्ट)</option>
                  <option value="Good">Good (अच्छा)</option>
                  <option value="Average">Average (सामान्य)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                {lang === 'hi' ? 'आपकी टिप्पणी' : 'Comment / Review'}
              </label>
              <textarea
                rows={2}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={lang === 'hi' ? 'भोजन, व्यवस्था और सफाई के बारे में बताएं...' : 'Food taste, cleanliness, service...'}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#F4811F]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F4811F] hover:bg-[#C96000] text-white py-2 rounded-xl font-bold text-xs shadow transition-all"
            >
              {lang === 'hi' ? 'समीक्षा जमा करें' : 'Post Review'}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-[var(--text-head)]">
              💬 {lang === 'hi' ? 'श्रद्धालुओं की राय' : 'Devotee Reviews'} ({eventReviews.length})
            </h4>

            {eventReviews.length === 0 ? (
              <p className="text-xs text-[var(--text-faint)] italic text-center py-4">
                {lang === 'hi' ? 'अभी कोई समीक्षा नहीं है — पहली समीक्षा आप दें!' : 'No reviews yet — be the first to review!'}
              </p>
            ) : (
              eventReviews.map((rev) => (
                <div key={rev.id} className="bg-[var(--bg-input)] border border-[var(--border)] p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[var(--text-head)]">{rev.userName}</span>
                    <span className="text-amber-500 font-bold">
                      {'★'.repeat(rev.rating)}
                    </span>
                  </div>
                  <p className="text-[var(--text-body)]">{rev.comment}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-faint)] pt-1 border-t border-[var(--divider)]">
                    <span>👥 Crowd: {rev.crowdLevel}</span>
                    <span>•</span>
                    <span>🍲 Food: {rev.foodQuality}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
