import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminTopbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.includes('/admin/dashboard')) return 'Dashboard';
    if (pathname.includes('/admin/articles/create')) return 'Add New Article';
    if (pathname.includes('/admin/articles/edit')) return 'Edit Article';
    if (pathname.includes('/admin/articles')) return 'Articles';
    if (pathname.includes('/admin/categories/create')) return 'Add Category';
    if (pathname.includes('/admin/categories/edit')) return 'Edit Category';
    if (pathname.includes('/admin/categories')) return 'Categories';
    if (pathname.includes('/admin/users/create')) return 'Add User';
    if (pathname.includes('/admin/users/edit')) return 'Edit User';
    if (pathname.includes('/admin/users')) return 'Users';
    if (pathname.includes('/admin/comments')) return 'Comments Moderation';
    if (pathname.includes('/admin/settings')) return 'Settings';
    return 'Administration';
  };

  return (
    <header className="admin-topbar">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm d-lg-none p-1 px-2"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <i className="fa fa-bars fa-lg"></i>
        </button>

        <h1 className="page-title">{getPageTitle(location.pathname)}</h1>
      </div>

      {/* Right: Quick actions & User badge */}
      <div className="d-flex align-items-center gap-3">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-secondary btn-sm d-none d-sm-inline-flex align-items-center gap-1 rounded-pill px-3"
        >
          <i className="fa fa-globe"></i>
          <span>View Site</span>
        </Link>

        {/* User Pill */}
        <div className="user-pill">
          <span
            className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}
          >
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
          </span>
          <span className="d-none d-md-inline text-dark">{user?.fullname}</span>
          <span
            className={`user-role-badge ${
              user?.role === 'admin' ? 'bg-danger text-white' : 'bg-primary text-white'
            }`}
          >
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
