import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, getFallbackImageUrl } from '../utils/imageUrl';

const ArticleCard = ({ article }) => {
  // Strip HTML for the short snippet
  const cleanSnippet = (html, length = 180) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // Estimate reading time
  const getReadTime = (html) => {
    if (!html) return '1 min read';
    const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const imageSrc = getImageUrl(article.image);

  const formattedDate = article.createdAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(article.createdAt))
    : '';

  const authorInitial = article.author?.fullname
    ? article.author.fullname.charAt(0).toUpperCase()
    : 'N';

  return (
    <article className="modern-news-card">
      <div className="row g-0 align-items-center">
        {/* Left: Thumbnail Image */}
        <div className="col-md-5">
          <Link className="card-thumb-wrapper d-block" to={`/single/${article._id}`}>
            <img
              src={imageSrc}
              alt={article.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackImageUrl();
              }}
            />
          </Link>
        </div>

        {/* Right: Content details */}
        <div className="col-md-7">
          <div className="card-content">
            {/* Category badge */}
            {article.category && (
              <Link to={`/category/${article.category.slug}`} className="category-badge">
                {article.category.name}
              </Link>
            )}

            {/* Title */}
            <h3 className="card-title">
              <Link to={`/single/${article._id}`}>{article.title}</Link>
            </h3>

            {/* Metadata (Author, Date, Reading time) */}
            <div className="card-meta">
              {article.author && (
                <Link
                  to={`/author/${article.author._id}`}
                  className="d-inline-flex align-items-center gap-2 text-muted"
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {authorInitial}
                  </span>
                  <span>{article.author.fullname}</span>
                </Link>
              )}
              {formattedDate && (
                <span>
                  <i className="fa fa-circle" style={{ fontSize: '4px' }}></i> {formattedDate}
                </span>
              )}
              <span>
                <i className="fa fa-clock-o"></i> {getReadTime(article.content)}
              </span>
            </div>

            {/* Snippet */}
            <p className="card-snippet">{cleanSnippet(article.content, 160)}</p>

            {/* Read more CTA */}
            <Link className="read-more-link" to={`/single/${article._id}`}>
              <span>Read Full Story</span>
              <i className="fa fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
