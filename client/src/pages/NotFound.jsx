import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      className="not-found-card text-center py-5 px-4 my-4 rounded-3"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-3">
        <span
          className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-2 text-uppercase"
          style={{ letterSpacing: '0.08em', fontSize: '0.8rem' }}
        >
          Error 404
        </span>
      </div>
      <h1
        className="display-2 fw-extrabold text-dark mb-2"
        style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
      >
        Story Not Found
      </h1>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '480px', fontSize: '1.05rem', lineHeight: '1.6' }}>
        The dispatch, article, or resource you are seeking may have been archived, renamed, or is currently unavailable.
      </p>

      <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
        <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold">
          <i className="fa fa-newspaper-o me-2"></i> Return to Front Page
        </Link>
        <Link to="/search" className="btn btn-outline-secondary px-4 py-2 fw-semibold">
          <i className="fa fa-search me-2"></i> Search Archive
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
