import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getImageUrl, getFallbackImageUrl } from '../../utils/imageUrl';

const Articles = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [articles, setArticles] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: pageParam,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchArticles = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (user?.role === 'author') {
        params.mine = 'true';
      }
      const response = await newsAPI.getNews(params);
      if (response.data.success) {
        const { docs, totalPages, hasPrevPage, hasNextPage } = response.data.data;
        setArticles(docs || []);
        setPaginationInfo({
          page,
          totalPages: totalPages || 1,
          hasPrevPage: !!hasPrevPage,
          hasNextPage: !!hasNextPage,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(pageParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageParam, user]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const response = await newsAPI.deleteNews(id);
      if (response.data.success) {
        setActionMessage('Article deleted successfully.');
        setTimeout(() => setActionMessage(''), 3000);
        fetchArticles(pageParam);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete article.');
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div className="admin-articles-page">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Articles Management</h2>
          <p className="text-muted small mb-0">
            {user?.role === 'admin'
              ? 'Manage, publish, edit, and organize all news articles across the network.'
              : 'Manage and update your published articles.'}
          </p>
        </div>
        <div>
          <Link to="/admin/articles/create" className="btn btn-primary px-3 py-2 fw-semibold">
            <i className="fa fa-plus me-1"></i> Add New Article
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="fa fa-check-circle text-success"></i>
          <div>{actionMessage}</div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={() => fetchArticles(pageParam)} />}

      {/* Main Table Card */}
      <div className="admin-table-card">
        {loading ? (
          <div className="p-5 text-center">
            <Loading message="Loading articles..." />
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Title & Preview</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Published Date</th>
                    <th className="text-end" style={{ width: '110px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => {
                    const imageUrl = getImageUrl(article.image);
                    const serialNumber = (paginationInfo.page - 1) * 10 + index + 1;

                    return (
                      <tr key={article._id}>
                        <td className="text-muted small fw-semibold">{serialNumber}</td>
                        <td>
                          <img
                            src={imageUrl}
                            alt=""
                            className="rounded"
                            style={{
                              width: '56px',
                              height: '40px',
                              objectFit: 'cover',
                              backgroundColor: '#f1f5f9',
                              border: '1px solid var(--color-border)',
                            }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getFallbackImageUrl();
                            }}
                          />
                        </td>
                        <td>
                          <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.925rem' }}>
                            {article.title}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              to={`/single/${article._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-decoration-none text-muted small hover-primary d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <i className="fa fa-external-link"></i> View Live Story
                            </Link>
                          </div>
                        </td>
                        <td>
                          <span
                            className="badge bg-light text-dark border px-2 py-1 fw-semibold"
                            style={{ fontSize: '0.75rem' }}
                          >
                            {article.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center fw-bold"
                              style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}
                            >
                              {(article.author?.fullname || 'U').charAt(0).toUpperCase()}
                            </span>
                            <span className="small text-dark fw-medium">
                              {article.author?.fullname || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="small text-muted">
                            {new Date(article.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex align-items-center gap-1">
                            <Link
                              to={`/admin/articles/edit/${article._id}`}
                              className="admin-action-btn edit"
                              title="Edit Article"
                              aria-label="Edit Article"
                            >
                              <i className="fa fa-pencil"></i>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(article._id, article.title)}
                              className="admin-action-btn delete"
                              title="Delete Article"
                              aria-label="Delete Article"
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 border-top d-flex justify-content-center">
              <Pagination
                page={paginationInfo.page}
                totalPages={paginationInfo.totalPages}
                hasPrevPage={paginationInfo.hasPrevPage}
                hasNextPage={paginationInfo.hasNextPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="p-5 text-center">
            <div className="text-muted mb-3" style={{ fontSize: '2.5rem' }}>
              <i className="fa fa-file-text-o"></i>
            </div>
            <h5 className="fw-bold text-dark mb-1">No Articles Published Yet</h5>
            <p className="text-muted small mb-3">
              Start writing your first news article to publish it to the live website.
            </p>
            <Link to="/admin/articles/create" className="btn btn-primary btn-sm px-3">
              <i className="fa fa-plus me-1"></i> Add Article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
