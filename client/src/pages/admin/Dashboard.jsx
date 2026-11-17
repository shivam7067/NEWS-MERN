import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardAPI.getStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading message="Loading dashboard statistics..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div
        className="welcome-card p-4 rounded-3 mb-4 text-white d-flex align-items-center justify-content-between flex-wrap gap-3"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div>
          <span
            className="badge bg-danger text-uppercase px-2 py-1 mb-2"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
          >
            Editorial Newsroom
          </span>
          <h2 className="h4 fw-bold text-white mb-1">
            Welcome back, {stats?.fullname || user?.fullname}!
          </h2>
          <p className="text-white-50 small mb-0">
            {isAdmin
              ? 'Here is an overview of your publication activity, content taxonomy, and editorial staff.'
              : 'Here is an overview of your published stories and discussions.'}
          </p>
        </div>
        <div>
          <Link to="/admin/articles/create" className="btn btn-primary px-3 py-2 fw-semibold">
            <i className="fa fa-plus me-1"></i> New Article
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Articles Stat Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/admin/articles" className="text-decoration-none">
            <div className="metric-stat-card">
              <div
                className="metric-icon-box"
                style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
              >
                <i className="fa fa-newspaper-o"></i>
              </div>
              <div className="metric-info">
                <h6>{isAdmin ? 'Total Articles' : 'My Articles'}</h6>
                <h2>{stats?.articles ?? 0}</h2>
              </div>
            </div>
          </Link>
        </div>

        {/* Categories Stat Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link
            to={isAdmin ? '/admin/categories' : '#'}
            className="text-decoration-none"
            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
          >
            <div className="metric-stat-card">
              <div
                className="metric-icon-box"
                style={{ backgroundColor: '#fffbeb', color: '#d97706' }}
              >
                <i className="fa fa-folder-open-o"></i>
              </div>
              <div className="metric-info">
                <h6>Categories</h6>
                <h2>{stats?.categories ?? 0}</h2>
              </div>
            </div>
          </Link>
        </div>

        {/* Staff/Users Stat Card (Admin Only) */}
        {isAdmin && (
          <div className="col-12 col-sm-6 col-xl-3">
            <Link to="/admin/users" className="text-decoration-none">
              <div className="metric-stat-card">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
                >
                  <i className="fa fa-users"></i>
                </div>
                <div className="metric-info">
                  <h6>Staff & Authors</h6>
                  <h2>{stats?.users ?? 0}</h2>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Comments Stat Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/admin/comments" className="text-decoration-none">
            <div className="metric-stat-card">
              <div
                className="metric-icon-box"
                style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}
              >
                <i className="fa fa-comments-o"></i>
              </div>
              <div className="metric-info">
                <h6>Comments</h6>
                <h2>{stats?.comments ?? 0}</h2>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3" style={{ border: '1px solid var(--color-border)' }}>
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="fa fa-bolt text-warning"></i>
              <span>Quick Publishing Actions</span>
            </h6>
            <div className="d-flex flex-column gap-2">
              <Link
                to="/admin/articles/create"
                className="btn btn-light text-start p-2 px-3 border rounded-2 d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-pencil-square-o text-primary"></i>
                  <span className="small fw-semibold">Write & Publish New Story</span>
                </div>
                <i className="fa fa-chevron-right text-muted small"></i>
              </Link>
              <Link
                to="/admin/articles"
                className="btn btn-light text-start p-2 px-3 border rounded-2 d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-list text-info"></i>
                  <span className="small fw-semibold">Review All Published Stories</span>
                </div>
                <i className="fa fa-chevron-right text-muted small"></i>
              </Link>
              <Link
                to="/admin/comments"
                className="btn btn-light text-start p-2 px-3 border rounded-2 d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-comment-o text-danger"></i>
                  <span className="small fw-semibold">Moderate Reader Discussions</span>
                </div>
                <i className="fa fa-chevron-right text-muted small"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3" style={{ border: '1px solid var(--color-border)' }}>
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="fa fa-info-circle text-primary"></i>
              <span>Platform Info & Guidelines</span>
            </h6>
            <div className="small text-muted">
              <p className="mb-2">
                <strong>Editorial Standard:</strong> Ensure each story includes a high-resolution featured image and is assigned to the appropriate taxonomy category.
              </p>
              <p className="mb-2">
                <strong>Image Guidelines:</strong> Supported formats are JPEG, PNG, WEBP, and GIF up to 5MB. Aspect ratio 16:9 or 16:10 is recommended for hero placement.
              </p>
              <p className="mb-0">
                <strong>Comments Moderation:</strong> Readers can participate in article comments. Admins and authors can approve or reject comments to maintain high quality discussions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
