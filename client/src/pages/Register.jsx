import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.fullname.trim().length < 3) {
            setError("Full name must contain at least 3 characters.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname: formData.fullname.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || data.message || "Registration failed.");
                return;
            }

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {
            console.error("Registration error:", err);

            setError(
                "Cannot connect to server. Make sure your backend is running on port 5000."
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

                {/* TITLE */}
                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Create your account to start the assessment.
                </p>

                {/* ERROR */}
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                {/* SUCCESS */}
                {success && (
                    <div className="success-message">
                        ✅ {success}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="fullname"
                            placeholder="Enter your full name"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Minimum 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="login-link">
                    Already registered?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;