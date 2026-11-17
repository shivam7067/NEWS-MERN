import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { newsAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [inputVal, setInputVal] = useState(searchTerm);
  const [articles, setArticles] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: pageParam,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setInputVal(searchTerm);
  }, [searchTerm]);

  const fetchSearchResults = async (query, page) => {
    if (!query || !query.trim()) {
      setArticles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await newsAPI.getNews({ search: query.trim(), page, limit: 6 });
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
      setError(err.message || 'Failed to search news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(searchTerm, pageParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, pageParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ search: inputVal.trim(), page: 1 });
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ search: searchTerm, page: newPage });
  };

  return (
    <div className="search-page-container">
      {/* Search Header Banner */}
      <div className="search-banner py-4 px-4 mb-4 rounded-3" style={{ background: '#f8fafc', border: '1px solid var(--border-color)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <span className="badge bg-primary px-3 py-2 text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              Search Archive
            </span>
            <h1 className="h3 fw-bold mt-2 mb-1" style={{ color: 'var(--text-dark)' }}>
              {searchTerm ? (
                <>Results for &ldquo;<span className="text-primary">{searchTerm}</span>&rdquo;</>
              ) : (
                'Search News, Reports & Stories'
              )}
            </h1>
            {searchTerm && !loading && (
              <p className="text-muted small mb-0">
                Found {articles.length > 0 ? `articles matching your query` : 'no matching records'}
              </p>
            )}
          </div>
        </div>

        {/* Live Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="search-inline-form mt-2">
          <div className="input-group input-group-lg shadow-sm" style={{ maxWidth: '650px' }}>
            <span className="input-group-text bg-white border-end-0 text-muted">
              <i className="fa fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Type keywords, author names, or topics..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              aria-label="Search"
              style={{ fontSize: '0.95rem' }}
            />
            <button className="btn btn-primary px-4 fw-semibold" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Loading message={`Searching news for "${searchTerm}"...`} />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => fetchSearchResults(searchTerm, pageParam)}
        />
      ) : articles.length > 0 ? (
        <>
          <div className="search-results-list">
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
        <div className="empty-search-state text-center py-5 px-3 rounded-3" style={{ background: '#fff', border: '1px dashed var(--border-color)' }}>
          <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>
            <i className="fa fa-search-minus"></i>
          </div>
          <h3 className="h5 fw-bold text-dark mb-2">No Matching Stories Found</h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '440px' }}>
            We couldn't find any articles matching &ldquo;{searchTerm}&rdquo;. Try checking for typos or searching with broader keywords.
          </p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setInputVal('');
                navigate('/');
              }}
              className="btn btn-outline-secondary btn-sm px-3"
            >
              <i className="fa fa-home me-1"></i> Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
