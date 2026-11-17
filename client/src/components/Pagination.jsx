import React from 'react';

const Pagination = ({
  page = 1,
  totalPages = 1,
  hasPrevPage = false,
  hasNextPage = false,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="pagination justify-content-center">
        {/* Previous Button */}
        <li className={`page-item ${!hasPrevPage ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => hasPrevPage && onPageChange(page - 1)}
            aria-label="Previous"
            disabled={!hasPrevPage}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((p) => (
          <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => hasNextPage && onPageChange(page + 1)}
            aria-label="Next"
            disabled={!hasNextPage}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
