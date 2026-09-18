import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        // =========================
        // DEMO ACCOUNT
        // =========================
        if (
            email.trim().toLowerCase() === "demo@careercompass.com" &&
            password === "Demo@123"
        ) {
            const demoUser = {
                id: "demo-user",
                fullname: "Demo User",
                email: "demo@careercompass.com",
                isDemo: true
            };

            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(demoUser)
            );

            navigate("/quiz");
            return;
        }

        // =========================
        // NORMAL LOGIN
        // =========================
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    data.message ||
                    "Invalid email or password."
                );
                return;
            }

            if (data.user) {
                sessionStorage.setItem(
                    "currentUser",
                    JSON.stringify(data.user)
                );
            }

            navigate("/quiz");

        } catch (err) {
            console.error("Login error:", err);

            setError(
                "Cannot connect to server. Make sure your backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* LOGO */}
                <div className="auth-logo">
                    <span className="compass-icon">🧭</span>
                    <span>Career Compass</span>
                </div>

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to continue your career journey.
                </p>

                {/* ERROR */}
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                {/* LOGIN FORM */}
                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* DEMO ACCOUNT */}
                <div className="demo-account">

                    <div className="demo-title">
                        🧪 Demo Account
                    </div>

                    <p>
                        <strong>Email:</strong>
                        <br />
                        demo@careercompass.com
                    </p>

                    <p>
                        <strong>Password:</strong>
                        <br />
                        Demo@123
                    </p>

                    <button
                        type="button"
                        className="demo-button"
                        onClick={() => {
                            setEmail("demo@careercompass.com");
                            setPassword("Demo@123");
                            setError("");
                        }}
                    >
                        Use Demo Account
                    </button>

                </div>

                <p className="login-link">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create Account
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;