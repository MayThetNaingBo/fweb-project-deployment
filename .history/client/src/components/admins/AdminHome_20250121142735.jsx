import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "./Admin.css";

const Record = ({ record, showDeleteModal }) => {
    return (
        <tr>
            <td>{record.name}</td>
            <td>{record.school}</td>
            <td>{record.email}</td>
            <td>{record.hobby}</td>
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
    const [selectedSchool, setSelectedSchool] = useState("None");
    const [schools, setSchools] = useState([]); // Unique school categories
    const [showModal, setShowModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5050/api/admin/members")
            .then((res) => res.json())
            .then((data) => {
                setMembers(data);

                // Extract unique school categories
                const uniqueSchools = [
                    "None",
                    ...new Set(data.map((member) => member.school)),
                ];
                setSchools(uniqueSchools);
            })
            .catch((err) => console.error("Error fetching members:", err));
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSchoolChange = (e) => {
        setSelectedSchool(e.target.value);
    };

    const showDeleteModal = (id) => {
        setMemberToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(
                `http://localhost:5050/api/admin/delete/members/${memberToDelete}`,
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

    const filteredMembers = members.filter(
        (member) =>
            (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) &&
            (selectedSchool === "None" || member.school === selectedSchool)
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
            <div className="search-bar mb-3 d-flex align-items-center">
                {" "}
                {/* Flex container */}
                <input
                    type="text"
                    className="search-input me-3"
                    placeholder="Search Members by Name or Email"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select
                    id="school-filter"
                    className="form-select filter-dropdown"
                    value={selectedSchool}
                    onChange={handleSchoolChange}
                >
                    {schools.map((school, index) => (
                        <option key={index} value={school}>
                            {school}
                        </option>
                    ))}
                </select>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>TP Email</th>
                        <th>Actions</th>
                        <th>Hobby</th>
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
                    <p>No members found matching your criteria.</p>
                </div>
            )}

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                className="custom-modal"
            >
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="custom-modal-title">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                </Modal.Body>
                <Modal.Footer className="custom-modal-footer">
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                        className="custom-cancel-button"
                    >
                        No
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                        className="custom-delete-button"
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
