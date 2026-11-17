import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { newsAPI, categoryAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: pageParam,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async (page) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const catRes = await categoryAPI.getById(slug);
        if (catRes.data.success && catRes.data.category) {
          setCategory(catRes.data.category);
        }
      } catch (e) {
        setCategory({ name: slug.charAt(0).toUpperCase() + slug.slice(1) });
      }

      const response = await newsAPI.getNews({ category: slug, page, limit: 5 });
      if (response.data.success) {
        const { docs, totalPages, hasPrevPage, hasNextPage } = response.data.data;
        setArticles(docs || []);
        if (docs.length > 0 && docs[0].category) {
          setCategory((prev) => ({ ...prev, name: docs[0].category.name }));
        }
        setPaginationInfo({
          page,
          totalPages: totalPages || 1,
          hasPrevPage: !!hasPrevPage,
          hasNextPage: !!hasNextPage,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load category articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData(pageParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, pageParam]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const displayName = category?.name || slug;

  return (
    <div className="category-page-container">
      {/* Category Hero Banner */}
      <div
        className="card border-0 mb-4 p-4 text-white"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          borderRadius: '12px',
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <Link to="/" className="text-slate-300 small text-decoration-none">
            Home
          </Link>
          <span className="text-slate-400 small">/</span>
          <span className="text-danger small font-weight-bold text-uppercase">Category</span>
        </div>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h1 className="h2 font-weight-bold text-white mb-0">
            {displayName} News
          </h1>
          <span className="badge bg-danger px-3 py-2 font-weight-bold" style={{ fontSize: '0.8125rem' }}>
            {articles.length} Stories Loaded
          </span>
        </div>
        {category?.description && (
          <p className="text-slate-300 small mb-0 mt-2" style={{ color: '#cbd5e1' }}>
            {category.description}
          </p>
        )}
      </div>

      {loading ? (
        <Loading message={`Loading ${displayName} stories...`} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchCategoryData(pageParam)} />
      ) : articles.length > 0 ? (
        <>
          <div className="articles-feed">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

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
          <i className="fa fa-folder-open-o text-muted mb-3" style={{ fontSize: '3rem' }}></i>
          <h4>No articles found under {displayName}</h4>
          <p className="text-muted small">
            Check back later as reporters publish coverage to this section.
          </p>
          <Link to="/" className="btn btn-outline-primary btn-sm align-self-center mt-2">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
