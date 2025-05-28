
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Star, StarHalf, UserRound } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import ReviewForm from "../components/ReviewForm";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userAvatar?: string;
}

interface ReviewCarouselProps {
  productId: string;
  reviews: Review[];
  isLoggedIn?: boolean;
}

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" size={16} />);
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={16} />);
  }

  return stars;
};

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ productId, reviews, isLoggedIn = false }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitReview = (rating: number, comment: string) => {
    // In a real app, would submit this to an API
    toast({
      title: t('reviews.thankYou'),
      description: t('reviews.reviewSubmitted'),
    });
    
    setIsDialogOpen(false);
  };

  // Group reviews in sets of 5 for carousel
  const reviewsGroups = [];
  for (let i = 0; i < reviews.length; i += 5) {
    reviewsGroups.push(reviews.slice(i, i + 5));
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{t('reviews.customerReviews')}</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              disabled={!isLoggedIn}
              onClick={() => isLoggedIn ? setIsDialogOpen(true) : null}
              aria-label={isLoggedIn ? t('reviews.writeReview') : t('reviews.loginToReview')}
            >
              {t('reviews.writeReview')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('reviews.writeReview')}</DialogTitle>
            </DialogHeader>
            <ReviewForm 
              productId={productId} 
              onSubmit={handleSubmitReview} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {reviewsGroups.map((group, groupIndex) => (
              <CarouselItem key={`group-${groupIndex}`}>
                <div className="grid grid-cols-1 gap-4">
                  {group.map((review) => (
                    <div 
                      key={review.id} 
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {review.userAvatar ? (
                            <img 
                              src={review.userAvatar} 
                              alt={review.userName} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <UserRound size={16} />
                            </div>
                          )}
                          <span className="font-medium">{review.userName}</span>
                        </div>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{review.date}</div>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-2">
            <CarouselPrevious className="relative inset-auto translate-y-0" />
            <CarouselNext className="relative inset-auto translate-y-0" />
          </div>
        </Carousel>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">{t('reviews.noReviews')}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCarousel;
