import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { newsAPI, userAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const AuthorPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: pageParam,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthorData = async (page) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const userRes = await userAPI.getById(id);
        if (userRes.data.success && userRes.data.user) {
          setAuthor(userRes.data.user);
        }
      } catch (e) {
        // Fallback
      }

      const response = await newsAPI.getNews({ author: id, page, limit: 5 });
      if (response.data.success) {
        const { docs, totalPages, hasPrevPage, hasNextPage } = response.data.data;
        setArticles(docs || []);
        if (docs.length > 0 && docs[0].author) {
          setAuthor((prev) => ({ ...prev, fullname: docs[0].author.fullname }));
        }
        setPaginationInfo({
          page,
          totalPages: totalPages || 1,
          hasPrevPage: !!hasPrevPage,
          hasNextPage: !!hasNextPage,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load author articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorData(pageParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, pageParam]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const authorName = author?.fullname || 'Author';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="author-page-container">
      {/* Author Profile Header Banner */}
      <div
        className="card border-0 mb-4 p-4 text-white"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #334155)',
          borderRadius: '12px',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '1.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)',
            }}
          >
            {authorInitial}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h1 className="h3 font-weight-bold text-white mb-0">{authorName}</h1>
              <span className="badge bg-danger small text-uppercase">
                {author?.role || 'Contributor'}
              </span>
            </div>
            <p className="text-slate-300 small mb-0 mt-1" style={{ color: '#cbd5e1' }}>
              Staff Correspondent &amp; Journalist
            </p>
          </div>
        </div>
      </div>

      <div className="page-heading">
        <span>Published Stories by {authorName}</span>
      </div>

      {loading ? (
        <Loading message={`Loading articles by ${authorName}...`} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchAuthorData(pageParam)} />
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
          <i className="fa fa-user-circle-o text-muted mb-3" style={{ fontSize: '3rem' }}></i>
          <h4>No articles published yet by {authorName}</h4>
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
