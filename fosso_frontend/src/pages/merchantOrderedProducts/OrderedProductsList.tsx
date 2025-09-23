import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useToast } from "../../hooks/useToast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { useIsMobile } from "../../hooks/useMobile";
import type { OrderMerchantDTO } from "../../types/order";
import type { PaginatedResponse } from "../../types/paginatedResponse";
import { Spin } from "antd";
import { getOrdersByMerchant } from "../../api/merchant/MerchantOrder";
import type { ErrorResponse } from "../../types/error";
import MobileOrderCard from "./MobileOrderCard";
import DesktopOrderTable from "./DesktopOrderTable";

const OrderedProductsList: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);
  const [paginatedOrders, setPaginatedOrders] = useState<
    PaginatedResponse<OrderMerchantDTO>
  >({
    products: [],
    totalPages: 0,
    totalItems: 0,
    currentPage: 1,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getOrdersByMerchant(page, 5);
        setPaginatedOrders(response);
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        console.error("Error fetching merchant orders:", errorResponse);
        if (errorResponse.status === 404) {
          toast({
            title: t("merchant.noOrders"),
            description: t("merchant.noOrdersDesc"),
          });
        } else {
          toast({
            title: t("merchant.errorFetchingOrders"),
            description: t("merchant.errorFetchingOrdersDesc"),
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const totalPages = paginatedOrders?.totalPages || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          size="large"
          tip={t("profile.loading", { defaultValue: "Loading..." })}
        />
      </div>
    );
  }
  return (
    <div>
      {isMobile ? (
        // Mobile view - cards
        <MobileOrderCard
          orders={paginatedOrders?.products}
          setPaginatedOrders={setPaginatedOrders}
        />
      ) : (
        // Desktop/table view
        <DesktopOrderTable
          orders={paginatedOrders?.products}
          setPaginatedOrders={setPaginatedOrders}
        />
      )}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default OrderedProductsList;
