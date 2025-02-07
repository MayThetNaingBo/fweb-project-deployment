import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

export default function AdminNavBar() {
    const navigate = useNavigate();

    // Logout function
    function handleLogout() {
        localStorage.clear(); // Remove all local storage data
        window.location.href = "/authentication"; // Redirect to login page
    }

    return (
        <nav className="admin-navbar navbar-fixed">
            {/* Centered menu items */}
            <ul className="nav-menu">
                <li className="nav-item">
                    <Link to="/admin/home" className="nav-link">
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/about" className="nav-link">
                        <i className="fas fa-info-circle"></i>
                        <span>About</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/contactus" className="nav-link">
                        <i className="fas fa-envelope"></i>
                        <span>Feedback</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/events" className="nav-link">
                        <i className="fas fa-calendar-alt"></i>
                        <span>Events</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/profile" className="nav-link">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <button
                        onClick={handleLogout}
                        className="nav-link btn-logout"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </li>
            </ul>

            {/* Notifications icon */}
            <div className="notifications-item">
                <Link to="#" className="nav-link">
                    <i className="fas fa-bell"></i>
                </Link>
            </div>
        </nav>
    );
}
