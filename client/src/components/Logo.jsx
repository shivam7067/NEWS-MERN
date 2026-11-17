import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

export const LogoIcon = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0 }}
  >
    {/* Background rounded squircle */}
    <rect width="40" height="40" rx="10" fill="url(#logo_grad)" />
    {/* Newspaper folded sheet */}
    <path
      d="M11 12C11 10.8954 11.8954 10 13 10H27C28.1046 10 29 10.8954 29 12V28C29 29.1046 28.1046 30 27 30H13C11.8954 30 11 29.1046 11 28V12Z"
      fill="white"
      fillOpacity="0.95"
    />
    {/* Newspaper headline block */}
    <rect x="15" y="14" width="10" height="3" rx="1" fill="#dc2626" />
    {/* Editorial article lines */}
    <rect x="15" y="19" width="10" height="2" rx="0.5" fill="#334155" />
    <rect x="15" y="23" width="7" height="2" rx="0.5" fill="#64748b" />
    {/* Broadcast signal dot */}
    <circle cx="27" cy="11" r="2.5" fill="#ef4444" />
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
    </defs>
  </svg>
);

const Logo = ({
  variant = 'full', // 'full' | 'icon-only' | 'light'
  size = 'md',     // 'sm' | 'md' | 'lg'
  to = '/',
  customLogo = null,
  siteTitle = 'NEWSHUB',
  className = '',
}) => {
  const isLight = variant === 'light';
  const isIconOnly = variant === 'icon-only';

  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 44,
  };

  const fontSizes = {
    sm: '1.1rem',
    md: '1.35rem',
    lg: '1.65rem',
  };

  const content = (
    <div
      className={`brand-logo-wrapper d-inline-flex align-items-center gap-2 ${className}`}
      style={{ userSelect: 'none', textDecoration: 'none' }}
    >
      {customLogo ? (
        <img
          src={getImageUrl(customLogo)}
          alt={siteTitle}
          style={{
            maxHeight: iconSizes[size] + 6,
            width: 'auto',
            objectFit: 'contain',
          }}
          onError={(e) => {
            // fallback to SVG icon if custom logo fails
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <LogoIcon size={iconSizes[size]} />
      )}

      {!isIconOnly && (
        <span
          className="brand-text d-inline-flex align-items-center"
          style={{
            fontWeight: 800,
            fontSize: fontSizes[size],
            letterSpacing: '-0.03em',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            lineHeight: 1,
          }}
        >
          <span style={{ color: isLight ? '#ffffff' : '#0f172a' }}>
            {siteTitle ? siteTitle.split(' ')[0] : 'NEWS'}
          </span>
          <span
            className="badge ms-1"
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '0.62em',
              fontWeight: 800,
              padding: '0.3em 0.55em',
              borderRadius: '5px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.25)',
            }}
          >
            {siteTitle && siteTitle.split(' ').length > 1
              ? siteTitle.split(' ').slice(1).join(' ')
              : 'HUB'}
          </span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
