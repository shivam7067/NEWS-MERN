import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger my-3 d-flex align-items-center justify-content-between" role="alert">
      <div>
        <i className="fa fa-exclamation-triangle me-2"></i>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
