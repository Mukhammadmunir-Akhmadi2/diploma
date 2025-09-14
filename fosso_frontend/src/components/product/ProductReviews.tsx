import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { Star } from "lucide-react";
import type { ReviewDTO } from "../../types/review";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import type { UserBriefDTO } from "../../types/user";
import { getReviewsByProductId } from "../../api/Review";
import { getUserById } from "../../api/User";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import type { ErrorResponse } from "../../types/error";
import { useToast } from "../../hooks/useToast";
import EntityAvatar from "../EntityAvatar";
interface ProductReviewsProps {
  productId: string;
  averageRating?: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  averageRating = 0,
}) => {
  const { t } = useLanguage();
  const [pageReviews, setPageReviews] =
    useState<PaginatedResponse<ReviewDTO>>();
  const [page, setPage] = useState<number>(1);
  const { toast } = useToast();

  const itemsPerPage = 5;
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const pageReviews: PaginatedResponse<ReviewDTO> =
          await getReviewsByProductId(productId, page, itemsPerPage);

        pageReviews.products = await Promise.all(
          pageReviews.products.map(async (review) => {
            const user: UserBriefDTO = await getUserById(review.customerId);
            return {
              ...review,
              user: user,
            };
          })
        );
        setPageReviews(pageReviews);
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        if (errorResponse.status === 404) {
          toast({
            title: t("review.noReviewTitle"),
            description: t("review.noReviewMessage"),
          });
        } else {
          console.error("Error fetching reviews:", errorResponse);
          toast({
            title: t("error.fetchReviews"),
            description: errorResponse.message,
            variant: "destructive",
          });
        }
      }
    };

    fetchReviews();
  }, [page]);

  // Function to render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const totalPages = pageReviews?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium mb-2">
            {t("product.customerReviews")}
          </h3>
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {averageRating.toFixed(1)} {t("product.outOf")} 5
              {pageReviews &&
                pageReviews.totalItems > 0 &&
                ` (${pageReviews.totalItems} ${t("product.reviews")})`}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {pageReviews && pageReviews?.products.length > 0 ? (
        <div className="space-y-6">
          {pageReviews?.products.map((review) => (
            <div
              key={review.reviewId}
              className="border-b dark:border-gray-800 pb-6 last:border-0"
            >
              <div className="flex items-start">
                <EntityAvatar
                  ownerId={review.user?.userId}
                  imageType="USER_AVATAR"
                  name={`${review.user?.firstName} ${
                    review.user?.lastName ?? ""
                  }`}
                  className="h-10 w-10 mr-4"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{`${review.user?.firstName} ${review.user?.lastName}`}</h4>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                      {review.reviewDateTime
                        ? new Date(review.reviewDateTime).toLocaleDateString()
                        : t("product.unknownDate")}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((number) => (
                  <PaginationItem key={number}>
                    <PaginationLink
                      onClick={() => setPage(number)}
                      isActive={page === number}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 italic">
            {t("product.noReviews")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
