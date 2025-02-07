import React, { useEffect, useState } from "react";

export default function MemberEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const memberId = localStorage.getItem("userId"); // Fetch member ID from local storage

        if (!memberId) {
            setError("You must be logged in to view events.");
            setLoading(false);
            return;
        }

        // Fetch events assigned to this member
        fetch(`http://localhost:5050/api/member/${memberId}/events`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setEvents(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                setError("Failed to load events. Please try again.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading events...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div className="container mt-4">
            <h3>My Events</h3>
            {events.length === 0 ? (
                <p>No events assigned to you.</p>
            ) : (
                <div className="row">
                    {events.map((event) => (
                        <div key={event._id} className="col-md-4 mb-3">
                            <div className="card">
                                <img
                                    src={event.image || "/assets/NoImage.jpg"}
                                    className="card-img-top"
                                    alt={event.title}
                                    onError={(e) => (e.target.src = "/assets/NoImage.jpg")}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{event.title}</h5>
                                    <p className="card-text">{event.description}</p>
                                    <p className="card-text">
                                        <b>Location:</b> {event.location || "Not specified"}
                                    </p>
                                    <p className="card-text">
                                        <b>Date:</b> {event.date || "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
