import React, { useEffect, useState } from "react";

export default function FeedbackAdmin() {
    const [feedbacks, setFeedbacks] = useState([]); // Store feedback data

    // Fetch feedbacks on component load
    useEffect(() => {
        fetch("http://localhost:5050/api/feedback") // Backend endpoint
            .then((res) => res.json())
            .then((data) => {
                console.log("Feedback Data:", data); // Debugging
                setFeedbacks(data); // Store feedback
            })
            .catch((err) =>
                console.error("Error fetching feedback data:", err)
            );
    }, []); // Empty dependency means this runs once when component loads

    return (
        <div className="container mt-4">
            <h3>Feedback & Enquiry Collection</h3>
            <br></br>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Feedback & Enquiry</th>
                        <th>Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback) => (
                            <tr key={feedback._id}>
                                <td>{feedback.email}</td>
                                <td>{feedback.message}</td>
                                <td>
                                    {new Date(
                                        feedback.submittedAt
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No feedback available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
