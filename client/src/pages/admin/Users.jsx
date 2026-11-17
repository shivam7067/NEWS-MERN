import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, fullname) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${fullname}"?`)) {
      return;
    }

    try {
      const response = await userAPI.delete(id);
      if (response.data.success) {
        setActionMessage('User deleted successfully.');
        setTimeout(() => setActionMessage(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="admin-users-page">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Staff & Authors</h2>
          <p className="text-muted small mb-0">
            Manage editorial permissions, author accounts, and administrative roles.
          </p>
        </div>
        <div>
          <Link to="/admin/users/create" className="btn btn-primary px-3 py-2 fw-semibold">
            <i className="fa fa-user-plus me-1"></i> Add New User
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="fa fa-check-circle text-success"></i>
          <div>{actionMessage}</div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchUsers} />}

      {/* Main Table Card */}
      <div className="admin-table-card">
        {loading ? (
          <div className="p-5 text-center">
            <Loading message="Loading staff accounts..." />
          </div>
        ) : users.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Full Name</th>
                  <th>Username Handle</th>
                  <th>Access Role</th>
                  <th className="text-end" style={{ width: '110px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => {
                  const isCurrent = u._id === currentUser?.id;
                  const isAdminRole = u.role === 'admin';

                  return (
                    <tr key={u._id}>
                      <td className="text-muted small fw-semibold">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: '32px',
                              height: '32px',
                              fontSize: '0.8rem',
                              backgroundColor: isAdminRole ? '#e11d48' : '#2563eb',
                            }}
                          >
                            {u.fullname ? u.fullname.charAt(0).toUpperCase() : 'U'}
                          </span>
                          <div>
                            <span className="fw-bold text-dark">{u.fullname}</span>
                            {isCurrent && (
                              <span className="badge bg-success bg-opacity-10 text-success ms-2 small">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="text-muted small">@{u.username}</code>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isAdminRole
                              ? 'bg-danger text-white'
                              : 'bg-primary text-white'
                          } text-uppercase px-2 py-1`}
                          style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-1">
                          <Link
                            to={`/admin/users/edit/${u._id}`}
                            className="admin-action-btn edit"
                            title="Edit User"
                            aria-label="Edit User"
                          >
                            <i className="fa fa-pencil"></i>
                          </Link>
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleDelete(u._id, u.fullname)}
                              className="admin-action-btn delete"
                              title="Delete User"
                              aria-label="Delete User"
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          )}
                        </div>
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
              <i className="fa fa-users"></i>
            </div>
            <h5 className="fw-bold text-dark mb-1">No Staff Users Found</h5>
            <Link to="/admin/users/create" className="btn btn-primary btn-sm px-3 mt-2">
              <i className="fa fa-user-plus me-1"></i> Add First User
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
