import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CreatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const token = searchParams.get("token");

        try {
            const response = await axios.post(
                "http://localhost:5050/api/member/create-password",
                {
                    token,
                    password,
                }
            );

            alert(response.data.message);
            navigate("/signin"); // Redirect to sign-in page
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to set password."
            );
        }
    };

    return (
        <div className="container mt-4">
            <h3>Create Password</h3>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Set Password
                </button>
            </form>
        </div>
    );
}
