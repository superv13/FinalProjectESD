import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import '../presentation/Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await UserService.login(email, password);
            const token = userData?.token || userData?.accessToken || userData?.data?.token;

            if (token) {
                localStorage.setItem('token', token);
                // Redirects to dashboard immediately after success
                navigate('/dashboard');
            } else {
                setError(userData?.message || 'Login failed');
                setTimeout(() => setError(''), 5000);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Login error';
            setError(msg);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8081/oauth2/authorize/google";
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="logo">ESD</div>
                    <h1>Faculty Portal</h1>
                    <p className="subtitle">Secure access for faculty members</p>
                </div>

                <div className="auth-form">
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit} className="form-inner">
                        <label className="field">
                            <span className="label-text">Email Address</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@school.edu"
                                required
                            />
                        </label>

                        <label className="field">
                            <span className="label-text">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </label>

                        <button type="submit" className="btn-primary">Sign In</button>
                    </form>

                    <div className="divider">
                        <span>Or continue with</span>
                    </div>

                    <button type="button" className="btn-google" onClick={handleGoogleLogin}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12.24V14.35H18.57C18.3 15.78 17.47 17 16.24 17.82V20.72H20.04C22.26 18.67 23.52 15.68 23.52 12.29Z" fill="#4285F4" />
                            <path d="M12.24 23.75C15.41 23.75 18.07 22.7 20.04 20.88L16.24 17.98C15.19 18.69 13.84 19.1 12.24 19.1C9.18 19.1 6.59 17.04 5.66 14.24H1.73V17.28C3.76 21.31 7.93 23.75 12.24 23.75Z" fill="#34A853" />
                            <path d="M5.66 14.24C5.42 13.39 5.29 12.49 5.29 11.58C5.29 10.66 5.42 9.77 5.66 8.91V5.87H1.73C0.91 7.5 0.45 9.48 0.45 11.58C0.45 13.67 0.91 15.65 1.73 17.28L5.66 14.24Z" fill="#FBBC05" />
                            <path d="M12.24 4.05C13.97 4.05 15.51 4.65 16.73 5.81L20.09 2.45C18.06 0.56 15.41 0 12.24 0C7.93 0 3.76 2.44 1.73 6.47L5.66 9.51C6.59 6.71 9.18 4.05 12.24 4.05Z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;