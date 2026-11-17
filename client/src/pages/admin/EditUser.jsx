import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';

const EditUser = () => {
  const { id } = useParams();
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('author');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await userAPI.getById(id);
        if (response.data.success && response.data.user) {
          const u = response.data.user;
          setFullname(u.fullname);
          setUsername(u.username);
          setRole(u.role);
        }
      } catch (err) {
        setError(err.message || 'Failed to load user.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname.trim()) {
      setError('Full name is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    const updateData = {
      fullname: fullname.trim(),
      role,
    };
    if (password && password.trim() !== '') {
      updateData.password = password.trim();
    }

    try {
      const response = await userAPI.update(id, updateData);
      if (response.data.success) {
        navigate('/admin/users');
      }
    } catch (err) {
      setError(err.message || 'Failed to update user.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading user details..." />;

  return (
    <div className="admin-edit-user-page">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Edit User Profile</h2>
          <p className="text-muted small mb-0">
            Update account details, role assignments, or reset password.
          </p>
        </div>
        <Link to="/admin/users" className="btn btn-outline-secondary btn-sm px-3">
          <i className="fa fa-arrow-left me-1"></i> Back to Users
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
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  className="form-control"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username Handle</label>
                <input
                  type="text"
                  name="username"
                  className="form-control bg-light"
                  value={username}
                  disabled
                />
                <div className="form-text small text-muted">
                  Username handles cannot be altered once created.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Reset Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter new password if changing"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Access Role <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="author">Author (Create & edit own articles)</option>
                  <option value="admin">Administrator (Full administrative rights)</option>
                </select>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <Link to="/admin/users" className="btn btn-outline-secondary px-4">
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
                      <span>Update User</span>
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

export default EditUser;
