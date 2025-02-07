import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RegistrationRequests() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5050/api/admin/event/${id}/requests`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch requests.");
                return res.json();
            })
            .then((data) => {
                console.log("Fetched Requests:", data);
                setRequests(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Error fetching requests:", err);
                setError("Failed to fetch registration requests. Please try again.");
            });
    }, [id]);

    const handleApprove = async (memberId) => {
        try {
            const response = await fetch(
                `http://localhost:5050/api/admin/event/${id}/approve-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: memberId }),
                }
            );

            const result = await response.json();
            console.log("Approval Response:", result);

            if (!response.ok) {
                throw new Error(result.error || "Failed to approve request.");
            }

            setRequests(requests.filter((req) => req._id !== memberId));
            alert("Member approved and added to the event!");
        } catch (err) {
            console.error("Error approving request:", err);
            alert("Failed to approve member. Please try again.");
        }
    };

    const handleReject = async (memberId) => {
        try {
            const response = await fetch(
                `http://localhost:5050/api/admin/event/${id}/reject-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: memberId }),
                }
            );

            const result = await response.json();
            console.log("Rejection Response:", result);

            if (!response.ok) {
                throw new Error(result.error || "Failed to reject request.");
            }

            setRequests(requests.filter((req) => req._id !== memberId));
            alert("Member request rejected successfully!");
        } catch (err) {
            console.error("Error rejecting request:", err);
            alert("Failed to reject member. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Registration Requests</h3>
            {error && <p className="text-danger">{error}</p>}
            <br />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>School</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((req) => (
                            <tr key={req._id}>
                                <td>{req.name || "N/A"}</td>
                                <td>{req.email || "N/A"}</td>
                                <td>{req.school || "N/A"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning mx-2"
                                        onClick={() => handleApprove(req._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleReject(req._id)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No registration requests.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
