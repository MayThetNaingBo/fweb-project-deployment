import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

// Record Component
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
    const [selectedSchool, setSelectedSchool] = useState("None"); // State for school filtering
    const [schools, setSchools] = useState([]); // Unique school categories

    useEffect(() => {
        // Fetch members from API
        fetch("http://localhost:5050/api/public/members")
            .then((res) => res.json())
            .then((data) => {
                setMembers(data);

                const uniqueSchools = [
                    "None",
                    ...new Set(data.map((member) => member.school)),
                ];
                setSchools(uniqueSchools);
            })
            .catch((err) => console.error("Error fetching members:", err));
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSchoolChange = (e) => {
        setSelectedSchool(e.target.value);
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
            <h3>CCA Member List ( Public View ) </h3>
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
