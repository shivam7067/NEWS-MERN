import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { categoryAPI } from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';

const EditCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await categoryAPI.getById(id);
        if (response.data.success && response.data.category) {
          setName(response.data.category.name);
          setDescription(response.data.category.description || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load category.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await categoryAPI.update(id, {
        name: name.trim(),
        description: description.trim(),
      });
      if (response.data.success) {
        navigate('/admin/categories');
      }
    } catch (err) {
      setError(err.message || 'Failed to update category.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading category..." />;

  return (
    <div className="admin-edit-category-page">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Edit Category</h2>
          <p className="text-muted small mb-0">
            Update category taxonomy title and descriptive metadata.
          </p>
        </div>
        <Link to="/admin/categories" className="btn btn-outline-secondary btn-sm px-3">
          <i className="fa fa-arrow-left me-1"></i> Back to Categories
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="admin-form-card">
            {error && (
              <div className="mb-4">
                <ErrorMessage message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3">
                <label className="form-label">
                  Category Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <Link to="/admin/categories" className="btn btn-outline-secondary px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-refresh"></i>
                      <span>Update Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
