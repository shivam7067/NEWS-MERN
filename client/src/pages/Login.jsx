import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-viewport d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(225, 29, 72, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.12) 0px, transparent 50%)',
        position: 'relative',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            
            {/* Top Brand Logo */}
            <div className="text-center mb-4">
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <Logo light={true} size="lg" />
              </Link>
              <p className="text-light text-opacity-75 small mt-2 mb-0">
                Editorial & Content Management System
              </p>
            </div>

            {/* Login Card */}
            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden"
              style={{
                background: '#ffffff',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              }}
            >
              <div className="card-body p-4 p-sm-5">
                <div className="mb-4">
                  <h2 className="h4 fw-bold text-dark mb-1">Staff Sign In</h2>
                  <p className="text-muted small mb-0">
                    Enter your staff credentials to access the newsroom portal.
                  </p>
                </div>

                {error && (
                  <div
                    className="alert alert-danger d-flex align-items-center py-2 px-3 rounded-3 mb-4"
                    role="alert"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <i className="fa fa-exclamation-circle me-2 flex-shrink-0 text-danger"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="on">
                  {/* Username Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="login-username"
                      className="form-label text-dark fw-semibold small mb-1"
                    >
                      Username
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="fa fa-user-o"></i>
                      </span>
                      <input
                        id="login-username"
                        type="text"
                        className="form-control border-start-0 ps-0 bg-light"
                        name="username"
                        placeholder="e.g. editor_shivam"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                        style={{ fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label
                        htmlFor="login-password"
                        className="form-label text-dark fw-semibold small mb-0"
                      >
                        Password
                      </label>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="fa fa-lock"></i>
                      </span>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-start-0 border-end-0 ps-0 bg-light"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ fontSize: '0.9rem' }}
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                    style={{ fontSize: '0.95rem' }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span>Verifying Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <i className="fa fa-arrow-right small"></i>
                      </>
                    )}
                  </button>
                </form>

                <div className="border-top pt-3 mt-4 text-center">
                  <Link
                    to="/"
                    className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 hover-dark"
                  >
                    <i className="fa fa-long-arrow-left"></i>
                    <span>Return to Live Publication</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer copyright */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0" style={{ opacity: 0.7 }}>
                &copy; {new Date().getFullYear()} NEWSHUB Editorial Platform. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
