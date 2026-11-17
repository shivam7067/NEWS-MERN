import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { newsAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getImageUrl, getFallbackImageUrl } from '../utils/imageUrl';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [articles, setArticles] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: pageParam,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsAPI.getNews({ page, limit: 5 });
      if (response.data.success) {
        const { docs, totalPages, hasPrevPage, hasNextPage } = response.data.data;
        setArticles(docs || []);
        setPaginationInfo({
          page,
          totalPages: totalPages || 1,
          hasPrevPage: !!hasPrevPage,
          hasNextPage: !!hasNextPage,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch news articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(pageParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageParam]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const isFirstPage = pageParam === 1;
  const featuredArticle = isFirstPage && articles.length > 0 ? articles[0] : null;
  const regularArticles = isFirstPage ? articles.slice(1) : articles;

  const cleanSnippet = (html, length = 240) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="home-feed-container">
      {loading ? (
        <Loading message="Fetching top news stories..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchArticles(pageParam)} />
      ) : articles.length > 0 ? (
        <>
          {/* Featured Hero Story (Page 1 only) */}
          {featuredArticle && (
            <section className="featured-hero-card">
              <div className="hero-image-container">
                <Link to={`/single/${featuredArticle._id}`}>
                  <img
                    src={getImageUrl(featuredArticle.image)}
                    alt={featuredArticle.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackImageUrl();
                    }}
                  />
                </Link>
              </div>
              <div className="hero-content">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-danger" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    FEATURED
                  </span>
                  {featuredArticle.category && (
                    <Link
                      to={`/category/${featuredArticle.category.slug}`}
                      className="category-badge mb-0"
                    >
                      {featuredArticle.category.name}
                    </Link>
                  )}
                </div>

                <h2 className="hero-title">
                  <Link to={`/single/${featuredArticle._id}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <div className="card-meta text-muted mb-3 d-flex align-items-center gap-3 small">
                  {featuredArticle.author && (
                    <span>
                      <i className="fa fa-user me-1 text-danger"></i>
                      <Link to={`/author/${featuredArticle.author._id}`}>
                        {featuredArticle.author.fullname}
                      </Link>
                    </span>
                  )}
                  {featuredArticle.createdAt && (
                    <span>
                      <i className="fa fa-calendar me-1"></i>
                      {new Date(featuredArticle.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                <p className="hero-excerpt">{cleanSnippet(featuredArticle.content, 220)}</p>

                <Link
                  to={`/single/${featuredArticle._id}`}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#0f172a',
                    borderColor: '#0f172a',
                    borderRadius: '6px',
                    fontWeight: 600,
                    padding: '8px 20px',
                  }}
                >
                  Read Full Coverage <i className="fa fa-arrow-right ms-1"></i>
                </Link>
              </div>
            </section>
          )}

          {/* Section Heading */}
          <div className="page-heading">
            <span>{isFirstPage ? 'Latest Stories' : `Page ${pageParam} Stories`}</span>
            <span className="badge bg-light text-secondary border small font-weight-normal">
              {paginationInfo.totalPages > 1 && `Page ${pageParam} of ${paginationInfo.totalPages}`}
            </span>
          </div>

          {/* Article Cards Grid */}
          <div className="articles-feed">
            {regularArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={paginationInfo.page}
            totalPages={paginationInfo.totalPages}
            hasPrevPage={paginationInfo.hasPrevPage}
            hasNextPage={paginationInfo.hasNextPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="card p-5 text-center bg-white border">
          <i className="fa fa-newspaper-o text-muted mb-3" style={{ fontSize: '3rem' }}></i>
          <h4>No news articles published yet</h4>
          <p className="text-muted small">
            Check back soon for latest breaking news and editorial stories.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
