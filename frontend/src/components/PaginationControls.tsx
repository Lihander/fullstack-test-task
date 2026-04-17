import Pagination from "react-bootstrap/Pagination";

import type { PaginationControlsProps } from "@/components/PaginationControls.types";
import { getVisiblePages } from "@/shared/pagination";

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationControlsProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
      <span className="small text-secondary">Всего записей: {totalItems}</span>
      <Pagination className="mb-0">
        <Pagination.Prev
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </Pagination>
    </div>
  );
}
