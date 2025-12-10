import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                {/* Animated Side Panel */}
                <div className="auth-side-panel">
                    <div className="side-panel-content">
                        <div className="floating-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                        </div>
                        <h1 className="side-panel-title">Hostel Management System</h1>
                        <p className="side-panel-subtitle">Streamline your hostel operations with our comprehensive management solution</p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="feature-icon">🏠</span>
                                <span>Room Management</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">👥</span>
                                <span>Student Tracking</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📊</span>
                                <span>Analytics Dashboard</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Form */}
                <div className="auth-form-panel">
                    <div className="auth-form-content">
                        <div className="auth-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue to your dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="auth-form">
                            {error && <div className="error-message">{error}</div>}

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"></span>
                                    <input
                                        type="email"
                                        placeholder="admin@hostelpro.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"></span>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Don't have an account? <Link to="/register">Create one</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
