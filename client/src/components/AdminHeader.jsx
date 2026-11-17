import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminHeader = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div id="header-admin">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-3">
            <Link to="/" className="admin-logout">
              <i className="fa fa-home"></i> View Website
            </Link>
          </div>
          <div className="col-md-6 text-center">
            <Link to="/admin/dashboard" style={{ display: 'inline-block' }}>
              <img
                className="logo"
                src="/images/news.png"
                alt="Logo"
                style={{ maxHeight: '60px', width: 'auto', margin: '0 auto' }}
              />
            </Link>
          </div>
          <div className="col-md-3 text-end">
            <span className="text-white me-3 d-none d-md-inline">
              <i className="fa fa-user"></i> {user?.fullname} (<strong>{user?.role}</strong>)
            </span>
            <button
              onClick={handleLogout}
              className="admin-logout border-0 bg-transparent"
              style={{ cursor: 'pointer' }}
            >
              <i className="fa fa-sign-out"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
