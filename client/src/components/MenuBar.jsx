import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuBar = ({ categories = [] }) => {
  return (
    <nav className="category-menubar" aria-label="Category Navigation">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <ul className="menu-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
                end
              >
                <i className="fa fa-newspaper-o me-1"></i> All Stories
              </NavLink>
            </li>
            {categories &&
              categories.map((cat) => (
                <li key={cat._id || cat.slug}>
                  <NavLink
                    to={`/category/${cat.slug}`}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
