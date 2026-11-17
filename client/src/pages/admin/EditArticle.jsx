import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { newsAPI, categoryAPI } from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import { getImageUrl, getFallbackImageUrl } from '../../utils/imageUrl';

const EditArticle = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [catRes, articleRes] = await Promise.all([
          categoryAPI.getAll(),
          newsAPI.getNewsById(id),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.categories || []);
        }

        if (articleRes.data.success && articleRes.data.article) {
          const art = articleRes.data.article;
          setTitle(art.title);
          setContent(art.content);
          setCategory(art.category?._id || art.category);
          setCurrentImage(art.image);
        }
      } catch (err) {
        setError(err.message || 'Failed to load article data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('category', category);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const response = await newsAPI.updateNews(id, formData);
      if (response.data.success) {
        navigate('/admin/articles');
      }
    } catch (err) {
      setError(err.message || 'Failed to update article.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading article for editing..." />;

  return (
    <div className="admin-edit-article-page">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Update Article</h2>
          <p className="text-muted small mb-0">
            Modify the headline, copy, taxonomy, or featured image for this story.
          </p>
        </div>
        <Link to="/admin/articles" className="btn btn-outline-secondary btn-sm px-3">
          <i className="fa fa-arrow-left me-1"></i> Back to Articles
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="admin-form-card">
            {error && (
              <div className="mb-4">
                <ErrorMessage message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row g-4">
                {/* Left Column: Headline and Content */}
                <div className="col-12 col-lg-8">
                  {/* Title */}
                  <div className="mb-3">
                    <label htmlFor="article_title" className="form-label">
                      Headline Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="article_title"
                      className="form-control form-control-lg"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      style={{ fontSize: '1.05rem', fontWeight: 600 }}
                    />
                  </div>

                  {/* Content */}
                  <div className="mb-3">
                    <label htmlFor="article_content" className="form-label">
                      Article Content <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="content"
                      id="article_content"
                      className="form-control"
                      rows="12"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      style={{ lineHeight: 1.6 }}
                    ></textarea>
                  </div>
                </div>

                {/* Right Column: Taxonomy and Featured Image */}
                <div className="col-12 col-lg-4">
                  {/* Category */}
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <label htmlFor="article_category" className="form-label">
                      Category Taxonomy <span className="text-danger">*</span>
                    </label>
                    <select
                      name="category"
                      id="article_category"
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Photography */}
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <label className="form-label mb-2">Current Photo</label>
                    <div className="mb-3">
                      {currentImage ? (
                        <div className="rounded overflow-hidden border shadow-sm bg-white">
                          <img
                            src={getImageUrl(currentImage)}
                            alt="Current"
                            className="img-fluid w-100"
                            style={{ maxHeight: '160px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getFallbackImageUrl();
                            }}
                          />
                        </div>
                      ) : (
                        <p className="text-muted small mb-0">No image currently attached.</p>
                      )}
                    </div>

                    <label htmlFor="article_image" className="form-label">
                      Replace Image (Optional)
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="article_image"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    {imagePreview && (
                      <div className="mt-3">
                        <p className="text-muted small fw-semibold mb-1">New Image Preview:</p>
                        <div className="rounded overflow-hidden border shadow-sm bg-white">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid w-100"
                            style={{ maxHeight: '160px', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="d-flex align-items-center justify-content-between pt-4 mt-3 border-top">
                <Link to="/admin/articles" className="btn btn-outline-secondary px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-refresh"></i>
                      <span>Update Story</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
