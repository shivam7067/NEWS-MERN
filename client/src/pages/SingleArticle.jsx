import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getImageUrl, getFallbackImageUrl } from '../utils/imageUrl';

const SingleArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment Form state
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState('');
  const [commentError, setCommentError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsAPI.getNewsById(id);
      if (response.data.success) {
        setArticle(response.data.article);
        setComments(response.data.comments || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load article.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleCommentChange = (e) => {
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmittingComment(true);
    setCommentSuccess('');
    setCommentError('');

    try {
      const response = await newsAPI.addComment(id, commentForm);
      if (response.data.success) {
        setCommentSuccess('Your comment has been posted successfully!');
        if (response.data.comment) {
          setComments([response.data.comment, ...comments]);
        }
        setCommentForm({ name: '', email: '', content: '' });
      }
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) return <Loading message="Loading article..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchArticle} />;
  if (!article) return <div className="alert alert-warning">Article not found</div>;

  const imageSrc = getImageUrl(article.image);

  const dateStr = article.createdAt
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(article.createdAt))
    : '';

  const authorInitial = article.author?.fullname
    ? article.author.fullname.charAt(0).toUpperCase()
    : 'A';

  // Estimate reading time
  const words = article.content
    ? article.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
    : 0;
  const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article.title);

  return (
    <article className="single-article-wrapper">
      <div className="single-article-container">
        {/* Breadcrumb Navigation */}
        <nav className="article-breadcrumbs" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          {article.category && (
            <>
              <Link to={`/category/${article.category.slug}`}>
                {article.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-truncate" style={{ maxWidth: '280px' }}>
            {article.title}
          </span>
        </nav>

        {/* Category Pill */}
        {article.category && (
          <Link to={`/category/${article.category.slug}`} className="category-badge mb-2">
            {article.category.name}
          </Link>
        )}

        {/* Main Headline */}
        <h1 className="article-headline">{article.title}</h1>

        {/* Byline & Sharing Actions Bar */}
        <div className="article-byline-bar">
          <div className="author-meta-group">
            <div className="author-avatar-circle">{authorInitial}</div>
            <div className="author-details-text">
              {article.author ? (
                <Link to={`/author/${article.author._id}`} className="author-name">
                  {article.author.fullname}
                </Link>
              ) : (
                <span className="author-name">Staff Writer</span>
              )}
              <span className="publish-date">
                {dateStr} • {readTime}
              </span>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="share-action-group">
            <span className="text-muted small me-1 d-none d-sm-inline">Share:</span>
            <button
              onClick={handleCopyLink}
              className="share-action-btn"
              title={copiedLink ? 'Copied!' : 'Copy Link'}
            >
              <i className={`fa ${copiedLink ? 'fa-check text-success' : 'fa-link'}`}></i>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="share-action-btn"
              title="Share on Twitter / X"
            >
              <i className="fa fa-twitter"></i>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="share-action-btn"
              title="Share on WhatsApp"
            >
              <i className="fa fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Featured Hero Image */}
        <div className="single-feature-image-wrapper">
          <img
            src={imageSrc}
            alt={article.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getFallbackImageUrl();
            }}
          />
        </div>

        {/* Article Body Content */}
        <div
          className="article-body-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Discussion & Comments Card */}
      <section className="article-comments-card mt-4">
        <h3 className="h4 font-weight-bold mb-4 d-flex align-items-center justify-content-between">
          <span>
            <i className="fa fa-comments-o text-danger me-2"></i> Discussion
          </span>
          <span className="badge bg-secondary font-weight-normal">{comments.length}</span>
        </h3>

        {/* Comment Submission Form */}
        <div className="card border mb-4 bg-light">
          <div className="card-body p-4">
            <h5 className="card-title font-weight-bold mb-3">Join the Conversation</h5>

            {commentSuccess && (
              <div className="alert alert-success d-flex align-items-center gap-2">
                <i className="fa fa-check-circle"></i> {commentSuccess}
              </div>
            )}
            {commentError && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="fa fa-exclamation-circle"></i> {commentError}
              </div>
            )}

            <form onSubmit={handleCommentSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small font-weight-bold">Your Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={commentForm.name}
                    onChange={handleCommentChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small font-weight-bold">Your Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="e.g. john@example.com"
                    value={commentForm.email}
                    onChange={handleCommentChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small font-weight-bold">Your Comment *</label>
                <textarea
                  className="form-control"
                  name="content"
                  rows="3"
                  placeholder="Share your thoughts on this story..."
                  value={commentForm.content}
                  onChange={handleCommentChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary px-4 font-weight-bold"
                style={{ backgroundColor: '#0f172a', borderColor: '#0f172a' }}
                disabled={submittingComment}
              >
                {submittingComment ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fa fa-paper-plane me-1"></i> Post Comment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Comments Feed */}
        <div className="comments-feed">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div className="comment-item" key={comment._id}>
                <div className="comment-header">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        color: '#0f172a',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      {comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="commenter-name">{comment.name}</span>
                  </div>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-muted text-center py-4 mb-0">
              No comments yet. Be the first to share your opinion!
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

export default SingleArticle;
