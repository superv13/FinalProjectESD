import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import "../presentation/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const GOOGLE_AUTH_URL =
        "http://localhost:8081/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await UserService.login(email, password);

            const token =
                userData?.token ||
                userData?.accessToken ||
                userData?.data?.token;

            if (token) {
                localStorage.setItem("token", token);
                navigate("/dashboard");
            } else {
                setError(userData?.message || "Login failed");
                setTimeout(() => setError(""), 5000);
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Login error";
            setError(msg);
            setTimeout(() => setError(""), 5000);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
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
                            <span className="label-text">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@school.edu"
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

                        <button type="submit" className="btn-primary">
                            Sign In
                        </button>
                    </form>

                    <div className="separator">
                        <span>OR</span>
                    </div>

                    <button
                        className="google-btn"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            src="https://developers.google.com/identity/images/g-logo.png"
                            alt="Google"
                            className="google-icon"
                        />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
