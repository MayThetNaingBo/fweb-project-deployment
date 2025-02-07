import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MemberEventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [memberId, setMemberId] = useState(""); // Updated to memberId
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedMemberId = localStorage.getItem("userId"); // Get userId from localStorage
        console.log("Retrieved Member ID:", storedMemberId); // Debug log
        if (storedMemberId) {
            setMemberId(storedMemberId);
        } else {
            console.error("Member ID not found in localStorage.");
        }

        fetch(`http://localhost:5050/api/member/events/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setEvent(data);

                // Check if already registered
                if (
                    data.members?.includes(storedMemberId) ||
                    data.registrationRequests?.includes(storedMemberId)
                ) {
                    setIsRegistered(true);
                } else {
                    setIsRegistered(false);
                }
            })
            .catch((err) => {
                console.error("Error fetching event:", err);
                setError(
                    "Failed to load event details. Please try again later."
                );
            });
    }, [id]);

    const registerForEvent = async () => {
        if (!memberId) {
            setError("Member ID is missing. Please log in again.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5050/api/member/events/${id}/register-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ memberId }), // Changed from userId to memberId
                }
            );

            const data = await response.json();
            console.log("Response:", data); // Debug response

            if (response.ok) {
                setError(null);
                alert("Registration request sent successfully!");
                setIsRegistered(true);
            } else {
                setError(data.error || "Failed to send registration request.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    };

    if (!event) {
        return <p>Loading event details...</p>;
    }

    return (
        <div className="container mt-4">
            {error && <p className="text-danger">{error}</p>}
            <div className="event-details">
                <div className="event-left">
                    <h3 className="event-title">
                        {event.title || "No Title Available"}
                    </h3>
                    <img
                        src={event.image || "/assets/NoImage.jpg"}
                        alt={event.title || "Event Image"}
                        className="event-image"
                    />
                    <button
                        className="btn btn-warning view-members-btn"
                        onClick={registerForEvent}
                        disabled={loading || isRegistered}
                    >
                        {isRegistered
                            ? "Already Registered"
                            : loading
                            ? "Registering..."
                            : "Register"}
                    </button>
                </div>
                <div className="event-right">
                    <p className="event-location">
                        <b>Location:</b>{" "}
                        {event.location || "Location not specified"}
                    </p>
                    <p className="event-date">
                        <b>Date:</b> {event.date || "Date not specified"}
                    </p>
                    <p className="event-description">
                        <b>Description:</b>{" "}
                        {event.description || "No description available"}
                    </p>
                </div>
            </div>
        </div>
    );
}
