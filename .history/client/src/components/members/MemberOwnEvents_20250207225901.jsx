import React, { useEffect, useState } from "react";

export default function MemberOwnEvents() {
    const [events, setEvents] = useState([]); // Default as an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    useEffect(() => {
        const memberId = localStorage.getItem("userId"); // Fetch member ID from local storage

        if (!memberId) {
            setError("You must be logged in to view events.");
            setLoading(false);
            return;
        }

        // Fetch events assigned to this member
        fetch(`https://fweb-project-deployment.onrender.com/api/member/members/${memberId}/events`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else if (Array.isArray(data)) {
                    setEvents(data); // Set events only if it's an array
                } else {
                    setEvents([]); // Fallback to empty array
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter events
    const filteredEvents = events.filter((event) =>
        (event.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>CCA Event List (Public)</h3>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search events by title"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="event-list">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <div key={event._id} className="event-card">
                            <div className="event-info">
                                <h3 className="event-title">{event.title}</h3>
                                <img
                                    src={event.image || "/assets/NoImage.jpg"}
                                    alt={event.title}
                                    className="event-image"
                                    onError={(e) =>
                                        (e.target.src = "/assets/NoImage.jpg")
                                    }
                                />
                                <p className="event-location">
                                    <b>Location:</b>{" "}
                                    {event.location || "Not specified"}
                                </p>
                                <p className="event-date">
                                    <b>Date:</b> {event.date || "Not specified"}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
}
