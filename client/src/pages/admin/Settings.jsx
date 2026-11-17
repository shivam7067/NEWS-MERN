import React, { useState, useEffect } from 'react';
import { settingAPI } from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import { getImageUrl, getFallbackImageUrl } from '../../utils/imageUrl';

const Settings = () => {
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [footerDescription, setFooterDescription] = useState('');
  const [currentLogo, setCurrentLogo] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await settingAPI.getSettings();
      if (response.data.success && response.data.setting) {
        const s = response.data.setting;
        setWebsiteTitle(s.website_title || '');
        setFooterDescription(s.footer_description || '');
        setCurrentLogo(s.website_logo || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!websiteTitle.trim() || !footerDescription.trim()) {
      setError('Website title and footer description are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('website_title', websiteTitle.trim());
    formData.append('footer_description', footerDescription.trim());
    if (logoFile) {
      formData.append('website_logo', logoFile);
    }

    try {
      const response = await settingAPI.saveSettings(formData);
      if (response.data.success) {
        setSuccess('Settings saved successfully!');
        if (response.data.setting) {
          setCurrentLogo(response.data.setting.website_logo || '');
          setLogoFile(null);
          setLogoPreview(null);
        }
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading site configuration..." />;

  return (
    <div className="admin-settings-page">
      {/* Header */}
      <div className="mb-4">
        <h2 className="h4 fw-bold text-dark mb-1">Platform Settings</h2>
        <p className="text-muted small mb-0">
          Configure site identity, brand logo mark, and footer copyright information.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="admin-form-card">
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                <i className="fa fa-check-circle text-success"></i>
                <div>{success}</div>
              </div>
            )}
            {error && (
              <div className="mb-4">
                <ErrorMessage message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Publication Identity */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fa fa-globe text-primary"></i>
                  <span>Publication Identity</span>
                </h6>
                <div className="mb-3">
                  <label htmlFor="website_title" className="form-label">
                    Website Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="website_title"
                    id="website_title"
                    className="form-control"
                    placeholder="e.g. NewsHub Digital"
                    value={websiteTitle}
                    onChange={(e) => setWebsiteTitle(e.target.value)}
                    required
                  />
                  <div className="form-text small text-muted">
                    Displayed in the browser title bar, meta tags, and header navigation.
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fa fa-picture-o text-warning"></i>
                  <span>Brand Logo</span>
                </h6>

                <div className="mb-3">
                  <label className="form-label">Current Header Logo</label>
                  <div className="p-3 bg-light rounded-3 border d-inline-block">
                    {currentLogo ? (
                      <img
                        src={getImageUrl(currentLogo)}
                        alt="Current Logo"
                        className="img-fluid"
                        style={{ maxHeight: '60px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackImageUrl();
                        }}
                      />
                    ) : (
                      <div className="text-muted small">
                        Using default SVG brand logo mark.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="website_logo" className="form-label">
                    Upload Custom Logo Image (Optional)
                  </label>
                  <input
                    type="file"
                    name="website_logo"
                    id="website_logo"
                    className="form-control"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <div className="form-text small text-muted">
                    Recommended: PNG or SVG with transparent background (Max height 80px).
                  </div>

                  {logoPreview && (
                    <div className="mt-3 p-3 bg-light rounded-3 border">
                      <p className="text-muted small fw-semibold mb-2">New Logo Preview:</p>
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="img-fluid"
                        style={{ maxHeight: '60px', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Information */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fa fa-info-circle text-info"></i>
                  <span>Footer Copyright & Legal</span>
                </h6>
                <div className="mb-3">
                  <label htmlFor="footer_description" className="form-label">
                    Footer Description (HTML supported) <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="footer_description"
                    id="footer_description"
                    className="form-control"
                    rows="3"
                    placeholder="e.g. &copy; 2026 NewsHub. Powered by Editorial Engine."
                    value={footerDescription}
                    onChange={(e) => setFooterDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Save Action */}
              <div className="pt-3 border-top d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Saving Settings...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-save"></i>
                      <span>Save Settings</span>
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

export default Settings;
