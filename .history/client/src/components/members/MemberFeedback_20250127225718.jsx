import React, { useState } from "react";
import axios from "axios";
import "../../App.css";

export default function ContactUs() {
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5050/api/public/feedback",
                { email, message: feedback }
            );

            setMessage("Thank You for the Feedback !");
            alert("Your feedback is submitted successfully to our admins");
            setEmail("");
            setFeedback("");
        } catch (error) {
            alert("Error Occured. Please try again later");
        }
    };

    return (
        <div className="contact-us-page">
            <div className="contact-details">
                <h2>Official CCA Email</h2>
                <div className="contact-item">
                    <input
                        type="text"
                        value="theatreclub@temasekpoly.sg"
                        readOnly
                    />
                    <button
                        className="copy-btn"
                        onClick={() =>
                            navigator.clipboard.writeText(
                                "theatreclub@temasekpoly.sg"
                            )
                        }
                    >
                        <i className="fas fa-copy"></i>
                    </button>
                </div>

                <h2>Official Phone Number</h2>
                <div className="contact-item">
                    <input type="text" value="89104950" readOnly />
                    <button
                        className="copy-btn"
                        onClick={() =>
                            navigator.clipboard.writeText("89104950")
                        }
                    >
                        <i className="fas fa-copy"></i>
                    </button>
                </div>

                <h2>Offline Location</h2>
                <div className="contact-item">
                    <input
                        type="text"
                        value="21 Tampines Avenue 1, Singapore 529757"
                        readOnly
                    />
                    <button
                        className="copy-btn"
                        onClick={() =>
                            navigator.clipboard.writeText(
                                "21 Tampines Avenue 1, Singapore 529757"
                            )
                        }
                    >
                        <i className="fas fa-copy"></i>
                    </button>
                </div>
            </div>

            <div className="feedback-form">
                <h2>We'd Like To Hear Your Feedback!</h2>
                {message && <p style={{ color: "orange" }}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">
                            Email                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="feedback">
                            Feedback                       </label>
                        <textarea
                            id="feedback"
                            placeholder="Enter your feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="send-btn">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
