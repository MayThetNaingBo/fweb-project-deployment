import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditEvent() {
    const { id } = useParams(); // Get the event ID from the URL
    const navigate = useNavigate(); // To redirect after update
    const [event, setEvent] = useState({
        title: "",
        location: "",
        date: "",
        description: "",
        image: "",
    });

    const [originalEvent, setOriginalEvent] = useState({}); // Store original data for comparison
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch event details by ID
        fetch(`http://192.168.18.18:5050/api/admin/events/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setEvent(data);
                setOriginalEvent(data); // Save original data for comparison
            })
            .catch((err) => console.error("Error fetching event:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set default image URL if the field is empty
        const updatedEvent = { ...event };
        if (!updatedEvent.image) {
            updatedEvent.image = image =
                "http://localhost:5173/assets/NoImage.jpg"; // Default image URL
        }

        // Check if any changes were made
        const hasChanges = Object.keys(updatedEvent).some(
            (key) => updatedEvent[key] !== originalEvent[key]
        );

        if (!hasChanges) {
            alert("No changes made."); // Show message and exit if no changes
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5050/api/admin/update/events/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedEvent), // Send the updated event
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Show success or "No changes made" message
                navigate("/admin/events"); // Redirect to events list page
            } else {
                alert(result.message || "Failed to update event."); // Show error from server
            }
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to update event. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Update Event Details</h3>
            <br></br>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={event.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="form-control"
                        value={event.location}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="form-control"
                        value={event.date} // Ensure the value is in YYYY-MM-DD format
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        rows="4"
                        value={event.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                        Image URL
                    </label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        className="form-control"
                        value={event.image}
                        onChange={handleChange}
                    />
                </div>
                <br></br>
                <button type="submit" className="btn btn-warning mb-3">
                    Update
                </button>
                <button
                    type="button" // Changed type to button to prevent accidental submission
                    className="btn btn-danger mb-3 ms-3"
                    onClick={() => navigate("/admin/events")}
                >
                    Cancel
                </button>
                {message && <p className="mt-3">{message}</p>}
            </form>
        </div>
    );
}
