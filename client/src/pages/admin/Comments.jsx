import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { commentAPI } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await commentAPI.getAll(params);
      if (response.data.success) {
        setComments(response.data.comments || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await commentAPI.updateStatus(id, newStatus);
      if (response.data.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
        setActionMessage('Comment status updated successfully.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update comment status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this comment?')) {
      return;
    }

    try {
      const response = await commentAPI.delete(id);
      if (response.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== id));
        setActionMessage('Comment deleted successfully.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete comment.');
    }
  };

  return (
    <div className="admin-comments-page">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Reader Discussion Moderation</h2>
          <p className="text-muted small mb-0">
            Review and moderate community feedback across all published stories.
          </p>
        </div>

        {/* Status Filters */}
        <div className="btn-group shadow-sm" role="group" aria-label="Status filter">
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter('')}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'approved' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'rejected' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="fa fa-check-circle text-success"></i>
          <div>{actionMessage}</div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchComments} />}

      {/* Main Table Card */}
      <div className="admin-table-card">
        {loading ? (
          <div className="p-5 text-center">
            <Loading message="Loading discussion comments..." />
          </div>
        ) : comments.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Article Context</th>
                  <th style={{ width: '16%' }}>Reader</th>
                  <th style={{ width: '32%' }}>Comment Body</th>
                  <th style={{ width: '14%' }}>Moderation Status</th>
                  <th style={{ width: '10%' }}>Date</th>
                  <th className="text-end" style={{ width: '60px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => {
                  const statusColors = {
                    approved: 'text-success border-success bg-success bg-opacity-10',
                    rejected: 'text-danger border-danger bg-danger bg-opacity-10',
                    pending: 'text-warning border-warning bg-warning bg-opacity-10',
                  };

                  return (
                    <tr key={comment._id}>
                      <td>
                        <div className="fw-semibold text-dark mb-1" style={{ fontSize: '0.875rem' }}>
                          {comment.article?.title || 'Unknown Article'}
                        </div>
                        {comment.article?._id && (
                          <Link
                            to={`/single/${comment.article._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-decoration-none text-muted small hover-primary d-inline-flex align-items-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <i className="fa fa-external-link"></i> Story link
                          </Link>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle bg-light border text-muted d-inline-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
                          >
                            {(comment.name || 'R').charAt(0).toUpperCase()}
                          </span>
                          <span className="fw-semibold text-dark small">{comment.name}</span>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 text-muted small" style={{ lineHeight: 1.5 }}>
                          &ldquo;{comment.content}&rdquo;
                        </p>
                      </td>
                      <td>
                        <select
                          name="status"
                          className={`form-select form-select-sm fw-semibold rounded-pill ${
                            statusColors[comment.status] || ''
                          }`}
                          value={comment.status}
                          onChange={(e) =>
                            handleStatusChange(comment._id, e.target.value)
                          }
                          style={{ fontSize: '0.8rem', paddingLeft: '10px' }}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="approved">✓ Approved</option>
                          <option value="rejected">✕ Rejected</option>
                        </select>
                      </td>
                      <td>
                        <span className="small text-muted">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          onClick={() => handleDelete(comment._id)}
                          className="admin-action-btn delete"
                          title="Delete Comment"
                          aria-label="Delete Comment"
                        >
                          <i className="fa fa-trash-o"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 text-center">
            <div className="text-muted mb-3" style={{ fontSize: '2.5rem' }}>
              <i className="fa fa-comments-o"></i>
            </div>
            <h5 className="fw-bold text-dark mb-1">No Comments Found</h5>
            <p className="text-muted small mb-0">
              {statusFilter
                ? `There are no ${statusFilter} comments at the moment.`
                : 'No reader discussions submitted yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
