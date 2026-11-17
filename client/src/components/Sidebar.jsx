import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl, getFallbackImageUrl } from '../utils/imageUrl';

const Sidebar = ({ latestNews = [], categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <aside id="sidebar" className="col-md-4">
      {/* 1. Search Box Widget */}
      <div className="sidebar-widget">
        <h4 className="widget-title">
          <span>Search Stories</span>
          <i className="fa fa-search text-danger small"></i>
        </h4>
        <form className="sidebar-search-form" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search news, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-search">
              <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Trending / Most Read Widget */}
      <div className="sidebar-widget">
        <h4 className="widget-title">
          <span>Top Stories</span>
          <span className="badge bg-danger small" style={{ fontSize: '0.65rem' }}>
            HOT
          </span>
        </h4>

        {latestNews && latestNews.length > 0 ? (
          latestNews.map((news, index) => (
            <div className="trending-post-item" key={news._id}>
              {/* Numbered Rank Badge */}
              <div className="trending-rank">{String(index + 1).padStart(2, '0')}</div>

              {/* Info */}
              <div className="trending-info flex-grow-1">
                {news.category && (
                  <Link
                    to={`/category/${news.category.slug}`}
                    className="text-danger small font-weight-bold d-block mb-1"
                    style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}
                  >
                    {news.category.name}
                  </Link>
                )}
                <h5 className="trending-title">
                  <Link to={`/single/${news._id}`}>{news.title}</Link>
                </h5>
                <div className="trending-meta">
                  <span>
                    <i className="fa fa-calendar-o me-1"></i>
                    {new Date(news.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Tiny Thumbnail */}
              <Link className="trending-thumb" to={`/single/${news._id}`}>
                <img
                  src={getImageUrl(news.image)}
                  alt={news.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackImageUrl();
                  }}
                />
              </Link>
            </div>
          ))
        ) : (
          <p className="text-muted small">No recent posts available.</p>
        )}
      </div>

      {/* 3. Topics / Categories Cloud Widget */}
      {categories && categories.length > 0 && (
        <div className="sidebar-widget">
          <h4 className="widget-title">
            <span>Explore Topics</span>
            <i className="fa fa-th-large text-muted small"></i>
          </h4>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                to={`/category/${cat.slug}`}
                className="btn btn-sm btn-light border text-secondary"
                style={{
                  borderRadius: '50px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  padding: '5px 14px',
                  backgroundColor: '#f8fafc',
                }}
              >
                #{cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 4. Editorial Digest Box */}
      <div
        className="sidebar-widget text-white"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          border: 'none',
        }}
      >
        <span className="badge bg-danger mb-2">Editorial</span>
        <h5 className="text-white font-weight-bold mb-2">Independent Journalism</h5>
        <p className="text-slate-300 small mb-0" style={{ color: '#cbd5e1' }}>
          Delivering timely reporting, analysis, and breaking stories 24/7 across politics,
          sports, technology, and culture.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
