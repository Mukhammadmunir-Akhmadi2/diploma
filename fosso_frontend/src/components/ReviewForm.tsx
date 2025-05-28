
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { useLanguage } from "../contexts/LanguageContext";

interface ReviewFormProps {
  productId: string;
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast({
        title: t('reviews.ratingRequired'),
        description: t('reviews.pleaseSelectRating'),
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: t('reviews.commentRequired'),
        description: t('reviews.pleaseAddComment'),
        variant: "destructive",
      });
      return;
    }

    onSubmit(rating, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('reviews.rating')}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((starRating) => (
            <button
              key={starRating}
              type="button"
              onClick={() => setRating(starRating)}
              onMouseEnter={() => setHoveredRating(starRating)}
              onMouseLeave={() => setHoveredRating(null)}
              className="focus:outline-none"
            >
              <Star
                className={`${
                  (hoveredRating !== null && starRating <= hoveredRating) || 
                  (hoveredRating === null && rating && starRating <= rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                } cursor-pointer hover:text-yellow-400 transition-colors`}
                size={24}
              />
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {rating === 1 && t('reviews.rating1')}
          {rating === 2 && t('reviews.rating2')}
          {rating === 3 && t('reviews.rating3')}
          {rating === 4 && t('reviews.rating4')}
          {rating === 5 && t('reviews.rating5')}
        </div>
      </div>

      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium mb-1">
          {t('reviews.comment')}
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('reviews.commentPlaceholder')}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit">
          {t('reviews.submitReview')}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
