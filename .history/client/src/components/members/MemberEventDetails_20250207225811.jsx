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
        const storedMemberId = localStorage.getItem("userId");
        if (storedMemberId) {
            setMemberId(storedMemberId);
        } else {
            setError("Member ID not found. Please log in again.");
        }

        fetch(`https://fweb-project-deployment.onrender.com/api/member/events/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.message);
                    return;
                }
                setEvent(data);
                const alreadyRegistered =
                    data.members?.includes(storedMemberId) ||
                    data.registrationRequests?.includes(storedMemberId);
                setIsRegistered(alreadyRegistered);
            })
            .catch((err) => {
                setError("Failed to load event details. Please try again.");
                console.error(err);
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
                `http://192.168.18.18:5050/api/member/events/${id}/register-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ memberId }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setIsRegistered(true);
                alert("Registration request sent successfully!");
            } else {
                setError(data.error || "Failed to send registration request.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
        setLoading(false);
    };

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!event) {
        return <p>Loading event details...</p>;
    }
    

    return (
        <div className="container mt-4">
            <div className="event-details">
                <div className="event-left">
                    <h3 className="event-title">{event.title || "No Title"}</h3>
                    <img
                        src={event.image || "/assets/NoImage.jpg"}
                        alt={event.title || "Event"}
                        className="event-image"
                    />
                    <button
                        className="btn btn-warning"
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
                    <p>
                        <b>Location:</b> {event.location || "Not Specified"}
                    </p>
                    <p>
                        <b>Date:</b> {event.date || "Not Specified"}
                    </p>
                    <p>
                        <b>Description:</b> {event.description || "No details"}
                    </p>
                </div>
            </div>
        </div>
    );
}
