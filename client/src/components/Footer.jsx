import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = ({ setting, categories = [] }) => {
  const footerText =
    setting?.footer_description ||
    '© Copyright 2026 NEWSHUB | Powered by SHIVAM';

  return (
    <footer id="footer">
      <div className="container">
        <div className="row g-4">
          {/* Column 1: Brand & About */}
          <div className="col-lg-5 col-md-6">
            <div className="mb-3">
              <Logo
                siteTitle={setting?.website_title || 'NEWSHUB'}
                customLogo={setting?.website_logo}
                variant="light"
                size="md"
              />
            </div>
            <p className="text-secondary small pe-lg-4" style={{ color: '#94a3b8' }}>
              A modern digital newsroom delivering unbiased reporting, investigative journalism,
              and live updates across politics, world affairs, sports, culture, and technology.
            </p>
            {/* Social Links */}
            <div className="d-flex align-items-center gap-2 mt-3">
              <a
                href="https://github.com/shivam7067"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary text-white rounded-circle"
                style={{ width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                title="GitHub"
              >
                <i className="fa fa-github"></i>
              </a>
              <a
                href="#"
                className="btn btn-sm btn-outline-secondary text-white rounded-circle"
                style={{ width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                title="Twitter / X"
              >
                <i className="fa fa-twitter"></i>
              </a>
              <a
                href="#"
                className="btn btn-sm btn-outline-secondary text-white rounded-circle"
                style={{ width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                title="LinkedIn"
              >
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">News Categories</h5>
            <ul className="footer-links row g-2">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id || cat.slug} className="col-6">
                    <Link to={`/category/${cat.slug}`}>
                      <i className="fa fa-angle-right me-1 text-danger"></i>
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-muted small">No categories available.</li>
              )}
            </ul>
          </div>

          {/* Column 3: CMS Portal & Quick Links */}
          <div className="col-lg-3 col-md-12">
            <h5 className="footer-title">Editorial Portal</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <i className="fa fa-home me-1 text-danger"></i> Home Edition
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <i className="fa fa-lock me-1 text-danger"></i> Author & Staff Login
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard">
                  <i className="fa fa-cubes me-1 text-danger"></i> CMS Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="row align-items-center justify-content-between">
            <div
              className="col-md-7 text-center text-md-start mb-2 mb-md-0"
              dangerouslySetInnerHTML={{ __html: footerText }}
            />
            <div className="col-md-5 text-center text-md-end text-muted small">
              Built on React 18 & Express REST APIs
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
