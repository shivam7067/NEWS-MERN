import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';

const AddUser = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('author');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await userAPI.create({
        fullname: fullname.trim(),
        username: username.trim(),
        password: password.trim(),
        role,
      });

      if (response.data.success) {
        navigate('/admin/users');
      }
    } catch (err) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-add-user-page">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Create Staff User</h2>
          <p className="text-muted small mb-0">
            Grant new editorial or administrative access to the platform.
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
                  placeholder="e.g. Eleanor Vance"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Username Handle <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="e.g. evance"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="form-text small text-muted">
                  Used for sign in. Should be lowercase without spaces.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Account Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  <option value="admin">Administrator (Full access to all settings, users & taxonomy)</option>
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-user-plus"></i>
                      <span>Create User</span>
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

export default AddUser;
