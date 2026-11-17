import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newsAPI, categoryAPI } from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';

const AddArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        if (response.data.success) {
          setCategories(response.data.categories || []);
        }
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!image) {
      setError('Please choose a featured image for the article.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('category', category);
    formData.append('image', image);

    try {
      const response = await newsAPI.createNews(formData);
      if (response.data.success) {
        navigate('/admin/articles');
      }
    } catch (err) {
      setError(err.message || 'Failed to create article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-add-article-page">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Compose New Story</h2>
          <p className="text-muted small mb-0">
            Publish a fresh editorial story with headline, body copy, and photography.
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

            {loadingCats ? (
              <div className="p-5 text-center">
                <Loading message="Loading editorial taxonomy..." />
              </div>
            ) : (
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
                        placeholder="e.g. Global Tech Summit Unveils Next-Gen AI Standards"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ fontSize: '1.05rem', fontWeight: 600 }}
                      />
                      <div className="form-text small text-muted">
                        A compelling, concise headline helps readers discover your story.
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                      <label htmlFor="article_content" className="form-label">
                        Article Body Copy <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="content"
                        id="article_content"
                        className="form-control"
                        rows="12"
                        placeholder="Write your story here in full detail..."
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
                          -- Choose Category --
                        </option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="form-text small text-muted">
                        Assigning the right category places your story on relevant pages.
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-4 p-3 bg-light rounded-3 border">
                      <label htmlFor="article_image" className="form-label">
                        Featured Photography <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        name="image"
                        id="article_image"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                      <div className="form-text small text-muted mb-2">
                        Supported: JPG, PNG, WEBP. Recommended ratio 16:9.
                      </div>

                      {imagePreview && (
                        <div className="mt-3">
                          <p className="text-muted small fw-semibold mb-1">Image Preview:</p>
                          <div className="rounded overflow-hidden border shadow-sm bg-white">
                            <img
                              src={imagePreview}
                              alt="Upload Preview"
                              className="img-fluid w-100"
                              style={{ maxHeight: '180px', objectFit: 'cover' }}
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
                        <span>Publishing Article...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-paper-plane"></i>
                        <span>Publish Story</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArticle;
