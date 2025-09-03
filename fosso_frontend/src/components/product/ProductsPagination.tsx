import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import ProductCard from "./ProductCard";

import type { PaginatedResponse } from "../../types/paginatedResponse";
import type { ProductBriefDTO } from "../../types/product";

interface ProductPaginationProps {
  paginatedProduct: PaginatedResponse<ProductBriefDTO>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
const ProductPagination: React.FC<ProductPaginationProps> = ({
  paginatedProduct,
  page,
  setPage,
}) => {
  const pageNumbers = Array.from(
    { length: paginatedProduct.totalPages },
    (_, i) => i + 1
  );
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {paginatedProduct.products.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>

      {paginatedProduct.totalPages > 1 && (
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
                  setPage((prev) =>
                    Math.min(prev + 1, paginatedProduct.totalPages)
                  )
                }
                className={
                  page === paginatedProduct.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default ProductPagination;
