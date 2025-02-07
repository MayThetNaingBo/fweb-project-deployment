import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"; // Import CSS for custom styles

const Record = ({ record }) => {
    return (
        <tr>
            <td>{record.name}</td>
            <td>{record.school}</td>
            <td>{record.email}</td>
        </tr>
    );
};

export default function Home() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:5050/api/members")
            .then((res) => res.json())
            .then((data) => setMembers(data))
            .catch((err) => console.error("Error fetching members:", err));
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h3>CCA Member List ( Public View ) </h3>
            <div className="search-bar mb-3">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search members by name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>TP Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map((member) => (
                        <Record key={member._id} record={member} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
