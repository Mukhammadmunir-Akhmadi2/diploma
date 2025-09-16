import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAppSelector } from "../store/hooks";
import { Button } from "./ui/button";
import { useLanguage } from "../hooks/useLanguage";
import { Star } from "lucide-react";
import { useToast } from "../hooks/useToast";
import type { ReviewDTO } from "../types/review";
import { createReview } from "../api/Review";
import type { ErrorResponse } from "../types/error";
import type { UserDTO } from "../types/user";
import type { ProductDetailedDTO } from "../types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";

interface ReviewDialogProps {
  user: UserDTO | null;
  product: ProductDetailedDTO;
  userRating: number | null;
  setUserRating: React.Dispatch<React.SetStateAction<number | null>>;
  reviewText: string;
  setReviewText: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleStarClick: (star: number) => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  user,
  product,
  userRating,
  setUserRating,
  reviewText,
  setReviewText,
  isOpen,
  setIsOpen,
  handleStarClick,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const avatar = useAppSelector((state) => state.auth.avatar);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userRating) return;

    const review: ReviewDTO = {
      productId: product?.productId || "",
      productName: product?.productName,
      rating: userRating,
      comment: reviewText,
      customerId: user.userId,
    };

    try {
      await createReview(review);
      toast({
        title: t("product.reviewSubmitted"),
        description: t("product.reviewSubmittedDesc"),
      });
      setIsOpen(false);
      setUserRating(null);
      setReviewText("");
    } catch (error: any) {
      const errorResponse = error as ErrorResponse;
      console.error("Error submitting review:", errorResponse);
      toast({
        title: t("product.reviewError"),
        description: t("product.reviewErrorDesc"),
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUserRating(null);
    setReviewText("");
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("product.leaveReview")}</DialogTitle>
          <DialogDescription>
            {t("product.reviewPlaceholder")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage
              src={`data:${avatar?.contentType};base64,${avatar?.base64Data}`}
            />
            <AvatarFallback>
              {`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(
                0
              )}`.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{`${user?.firstName} ${user?.lastName}`}</h4>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              onClick={() => handleStarClick(star)}
              className={`w-6 h-6 cursor-pointer ${
                star <= (userRating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmitReview}>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-3 bg-white dark:bg-gray-900"
            placeholder={t("product.reviewPlaceholder")}
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button type="submit" className="w-full">
            {t("product.submitReview")}
          </Button>
        </form>
        <DialogClose
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
