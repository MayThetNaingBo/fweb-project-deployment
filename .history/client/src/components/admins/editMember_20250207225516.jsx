import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMember() {
    const { id } = useParams(); // Get member ID from URL
    const navigate = useNavigate(); // For redirecting

    const [member, setMember] = useState({
        name: "",
        school: "",
        email: "",
    });

    // Fetch member details by ID
    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await fetch(
                    `https://fweb-project-deployment.onrender.com/api/admin/members/${id}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch member data.");
                }
                const data = await response.json();
                setMember(data);
            } catch (err) {
                console.error("Error fetching member:", err);
                alert("Failed to load member data."); // Alert for errors
            }
        };

        fetchMember(); // Fetch member data
    }, [id]);

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
            // Fetch original member data for comparison
            const originalMember = await fetch(
                `http://192.168.18.18:5050/api/admin/members/${id}`
            )
                .then((res) => res.json())
                .catch((err) => {
                    console.error("Error fetching member:", err);
                    alert("Failed to load original member data."); // Alert for errors
                    return null;
                });

            // Check if any changes were made
            const hasChanges = Object.keys(member).some(
                (key) => member[key] !== originalMember[key]
            );

            if (!hasChanges) {
                alert("No changes made."); // Show alert if no changes
                return; // Exit without submitting
            }

            // Send the update request
            const response = await fetch(
                `http://192.168.18.18:5050/api/admin/update/members/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: member.name,
                        email: member.email,
                        school: member.school,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update member");
            }

            // Show success alert and wait for 3 seconds before redirecting
            alert("Member updated successfully!");
            setTimeout(() => navigate("/admin/home"), 3000);
        } catch (error) {
            console.error("Error updating member:", error);
            alert("Failed to update member. Please try again."); // Alert for update errors
        }
    };

    return (
        <div className="container mt-4">
            <h3>Update Member Details</h3>
            <br></br>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={member.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="school" className="form-label">
                        School
                    </label>
                    <select
                        id="school"
                        name="school"
                        className="form-control"
                        value={member.school}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Member's School</option>
                        <option value="Applied Science">Applied Science</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Humanities and Social Sciences">
                            Humanities and Social Sciences
                        </option>
                        <option value="Informatics and IT">
                            Informatics and IT
                        </option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        TP Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={member.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-warning mt-3">
                    Update
                </button>

                {/* Cancel button prevents form submission */}
                <button
                    type="button"
                    className="btn btn-danger mt-3 ms-3"
                    onClick={() => navigate("/admin/home")} // Navigate immediately
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
