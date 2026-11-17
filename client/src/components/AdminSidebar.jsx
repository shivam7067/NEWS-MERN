import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: 'fa-tachometer', label: 'Dashboard' },
    { to: '/admin/articles', icon: 'fa-file-text-o', label: 'Articles' },
    ...(isAdmin
      ? [
          { to: '/admin/categories', icon: 'fa-folder-o', label: 'Categories' },
          { to: '/admin/users', icon: 'fa-users', label: 'Users' },
        ]
      : []),
    { to: '/admin/comments', icon: 'fa-comments-o', label: 'Comments' },
    ...(isAdmin
      ? [{ to: '/admin/settings', icon: 'fa-sliders', label: 'Settings' }]
      : []),
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'show-drawer' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand d-flex align-items-center justify-content-between">
        <Link to="/admin/dashboard" className="text-decoration-none">
          <Logo light={true} size="md" />
        </Link>
        <button
          type="button"
          className="btn btn-sm btn-link text-white-50 d-lg-none p-0"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <i className="fa fa-times fa-lg"></i>
        </button>
      </div>

      {/* Navigation List */}
      <ul className="sidebar-nav">
        <li className="nav-section-title">Navigation</li>
        {navItems.map((item) => (
          <li className="nav-item" key={item.to}>
            <NavLink
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`fa ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}

        <li className="nav-section-title mt-3">Live Portal</li>
        <li className="nav-item">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="nav-link text-white-50"
          >
            <i className="fa fa-external-link"></i>
            <span>View Website</span>
          </Link>
        </li>
      </ul>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-top border-secondary border-opacity-25" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div
              className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
              style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
            >
              {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-truncate">
              <div className="text-white small fw-bold text-truncate" style={{ lineHeight: '1.2' }}>
                {user?.fullname || 'Staff Member'}
              </div>
              <span className="badge bg-secondary bg-opacity-75 text-uppercase" style={{ fontSize: '0.65rem' }}>
                {user?.role || 'Author'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <i className="fa fa-sign-out"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
