import React, { useEffect, useState } from "react";

export default function MemberOwnEvents() {
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
        fetch(`http://localhost:5050/api/member/members/${memberId}/events`)
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
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // const navigate = useNavigate();


    return (
        <div className="container mt-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>CCA Event List ( Public )</h3>
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
            {filteredEvents.map((event) => (
                    
                    events.map((event) => (
                        <div key={event._id} className="event-card">
                           
                            <div className="event-info">
                                <h3 className="event-title">{event.title}</h3>
                                <img
                                src={event.image || "/assets/NoImage.jpg"}
                                alt={event.title}
                                className="event-image"
                                onError={(e) => (e.target.src = "/assets/NoImage.jpg")}
                            />
                                <p className="event-location">
                                    <b>Location:</b> {event.location || "Not specified"}
                                </p>
                                <p className="event-date">
                                    <b>Date:</b> {event.date || "Not specified"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
            )}
