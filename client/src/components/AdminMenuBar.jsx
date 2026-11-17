import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminMenuBar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div id="admin-menubar">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <ul className="admin-menu">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <i className="fa fa-dashboard"></i> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/articles"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <i className="fa fa-file-text"></i> Articles
                </NavLink>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <NavLink
                      to="/admin/categories"
                      className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      <i className="fa fa-gears"></i> Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      <i className="fa fa-users"></i> Users
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink
                  to="/admin/comments"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <i className="fa fa-comments"></i> Comments
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink
                    to="/admin/settings"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <i className="fa fa-cog"></i> Settings
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenuBar;
