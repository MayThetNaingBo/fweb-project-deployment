import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for styling
import { Modal, Button } from "react-bootstrap"; // Import Modal from react-bootstrap
import "./Admin.css";

// Record Component (Reusable)
const Record = ({ record, showDeleteModal }) => {
    return (
        <tr>
            <td>{record.name}</td>
            <td>{record.school}</td>
            <td>{record.email}</td>
            <td>
                <button
                    className="btn btn-link text-primary"
                    onClick={() =>
                        (window.location.href = `/admin/edit/${record._id}`)
                    }
                >
                    Edit
                </button>
                |
                <button
                    className="btn btn-link text-danger"
                    onClick={() => showDeleteModal(record._id)}
                >
                    Remove
                </button>
            </td>
        </tr>
    );
};

export default function AdminHome() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    // Fetch Members
    useEffect(() => {
        fetch("http://localhost:5050/api/admin/members") // Fixed endpoint
            .then((res) => res.json())
            .then((data) => setMembers(data))
            .catch((err) => console.error("Error fetching members:", err));
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Show delete confirmation modal
    const showDeleteModal = (id) => {
        setMemberToDelete(id);
        setShowModal(true);
    };

    // Confirm delete function
    const confirmDelete = async () => {
        try {
            const response = await fetch(
                `http://localhost:5050/api/admin/members/${memberToDelete}`, // Fixed endpoint
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            const updatedMembers = members.filter(
                (member) => member._id !== memberToDelete
            );
            setMembers(updatedMembers);
            setShowModal(false);
        } catch (err) {
            console.error("Error deleting member:", err);
            alert("Failed to delete the member. Please try again.");
        }
    };

    // Filtered members for search
    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>CCA Member List ( Admin View )</h3>
                <button
                    className="btn btn-warning"
                    onClick={() => (window.location.href = "/admin/add")}
                >
                    Add New Member
                </button>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search members by name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>TP Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map((member) => (
                        <Record
                            key={member._id}
                            record={member}
                            showDeleteModal={showDeleteModal}
                        />
                    ))}
                </tbody>
            </table>

            {filteredMembers.length === 0 && (
                <div className="text-center mt-3">
                    <p>No members found matching your search criteria.</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this member? This action
                    cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        NO
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        YES
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
