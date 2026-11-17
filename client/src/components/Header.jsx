import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Header = ({ setting, latestNews = [] }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const trendingHeadline =
    latestNews.length > 0 ? latestNews[0].title : 'Stay informed with live global news updates';

  return (
    <header className="site-header-wrapper">
      {/* 1. Top Utility & Ticker Bar */}
      <div className="top-ticker-bar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            {/* Left: Date & Trending Ticker */}
            <div className="d-flex align-items-center overflow-hidden me-3">
              <span className="d-none d-md-inline-block text-slate-400 me-3 small">
                <i className="fa fa-calendar-o me-1 text-danger"></i> {todayFormatted}
              </span>
              <span className="trending-badge">Breaking</span>
              <span className="text-truncate small text-light" style={{ maxWidth: '420px' }}>
                {latestNews.length > 0 ? (
                  <Link to={`/single/${latestNews[0]._id}`} className="text-light">
                    {trendingHeadline}
                  </Link>
                ) : (
                  trendingHeadline
                )}
              </span>
            </div>

            {/* Right: Auth / Admin Links */}
            <div className="d-flex align-items-center gap-3 flex-shrink-0">
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-2">
                  <Link
                    to="/admin/dashboard"
                    className="auth-link text-warning"
                    title="Go to CMS Dashboard"
                  >
                    <i className="fa fa-cubes"></i>
                    <span className="d-none d-sm-inline">
                      {user?.fullname} ({user?.role})
                    </span>
                  </Link>
                  <span className="text-secondary opacity-50">|</span>
                  <button
                    onClick={logout}
                    className="auth-link btn btn-link p-0 border-0"
                    title="Logout"
                  >
                    <i className="fa fa-sign-out"></i>
                    <span className="d-none d-sm-inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="auth-link">
                  <i className="fa fa-lock"></i>
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header */}
      <div className="main-site-header">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            {/* Logo */}
            <div className="col-8 col-md-5">
              <Logo
                siteTitle={setting?.website_title || 'NEWSHUB'}
                customLogo={setting?.website_logo}
                size="md"
              />
            </div>

            {/* Quick Search on Desktop */}
            <div className="col-md-5 d-none d-md-block">
              <form onSubmit={handleSearchSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search articles, topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderRadius: '50px 0 0 50px',
                      paddingLeft: '18px',
                      fontSize: '0.875rem',
                      borderColor: '#e2e8f0',
                    }}
                  />
                  <button
                    className="btn btn-primary px-3"
                    type="submit"
                    style={{
                      borderRadius: '0 50px 50px 0',
                      backgroundColor: '#0f172a',
                      borderColor: '#0f172a',
                    }}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Admin CTA */}
            <div className="col-4 col-md-2 text-end">
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/login'}
                className="btn btn-sm btn-outline-danger font-weight-bold"
                style={{ borderRadius: '6px', fontSize: '0.8125rem' }}
              >
                <i className="fa fa-pencil me-1"></i>
                <span className="d-none d-sm-inline">
                  {isAuthenticated ? 'CMS' : 'Write'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
