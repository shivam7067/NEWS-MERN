import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      const response = await categoryAPI.delete(id);
      if (response.data.success) {
        setActionMessage('Category deleted successfully.');
        setTimeout(() => setActionMessage(''), 3000);
        fetchCategories();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="admin-categories-page">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Category Taxonomy</h2>
          <p className="text-muted small mb-0">
            Organize stories into thematic sections such as Politics, Technology, Business, and Culture.
          </p>
        </div>
        <div>
          <Link to="/admin/categories/create" className="btn btn-primary px-3 py-2 fw-semibold">
            <i className="fa fa-plus me-1"></i> Add Category
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="fa fa-check-circle text-success"></i>
          <div>{actionMessage}</div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchCategories} />}

      {/* Main Table Card */}
      <div className="admin-table-card">
        {loading ? (
          <div className="p-5 text-center">
            <Loading message="Loading category taxonomy..." />
          </div>
        ) : categories.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Category Name</th>
                  <th>Slug URL Identifier</th>
                  <th>Stories Count</th>
                  <th className="text-end" style={{ width: '110px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td className="text-muted small fw-semibold">{index + 1}</td>
                    <td>
                      <div className="fw-bold text-dark">{cat.name}</div>
                      {cat.description && (
                        <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <code className="text-primary bg-light px-2 py-1 rounded small">
                        /{cat.slug}
                      </code>
                    </td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1 fw-bold">
                        {cat.articleCount ?? 0} stories
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        <Link
                          to={`/admin/categories/edit/${cat._id}`}
                          className="admin-action-btn edit"
                          title="Edit Category"
                          aria-label="Edit Category"
                        >
                          <i className="fa fa-pencil"></i>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="admin-action-btn delete"
                          title="Delete Category"
                          aria-label="Delete Category"
                        >
                          <i className="fa fa-trash-o"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 text-center">
            <div className="text-muted mb-3" style={{ fontSize: '2.5rem' }}>
              <i className="fa fa-folder-open-o"></i>
            </div>
            <h5 className="fw-bold text-dark mb-1">No Categories Yet</h5>
            <p className="text-muted small mb-3">
              Add your first category to start organizing articles.
            </p>
            <Link to="/admin/categories/create" className="btn btn-primary btn-sm px-3">
              <i className="fa fa-plus me-1"></i> Add Category
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
