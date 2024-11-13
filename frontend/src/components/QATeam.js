import React, { useEffect, useState } from "react";

const QATeam = () => {
  const [qaTeam, setQATeam] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    const fetchQATeam = async () => {
      try {
        const response = await fetch("http://localhost:3001/QATeam");
        if (response.ok) {
          const data = await response.json();
          setQATeam(data);
        } else {
          console.error("Failed to fetch QA team members");
        }
      } catch (err) {
        console.error("Error: " + err);
      }
    };

    fetchQATeam();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/QATeam/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setQATeam(qaTeam.filter((member) => member._id !== id));
        alert("Member deleted successfully");
      } else {
        alert("Error deleting member");
      }
    } catch (err) {
      console.error("Error: " + err);
      alert("Error deleting member");
    }
  };

  const handleEdit = (member) => {
    setEditingMember({
      ...member,
      contactInfo: member.contactInfo || { email: "", phone: "" },
      address: member.address || { street: "", city: "" },
      gender: member.gender || "", // Ensure gender is set
    });
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    // Allow only letters and spaces
    const nameRegex = /^[a-zA-Z\s]*$/;

    if (nameRegex.test(name)) {
      setEditingMember({ ...editingMember, name });
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    // Allow only numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(phone)) {
      setEditingMember({
        ...editingMember,
        contactInfo: { ...editingMember.contactInfo, phone },
      });
    }
  };

  const extractBirthInfoFromNIC = (NIC) => {
    let birthYear, birthDate, gender;

    // Handle Old NIC Format (9 digits + 'V' or 'X')
    if (/^\d{9}[vVxX]$/.test(NIC)) {
      const yearDigits = parseInt(NIC.substring(0, 2), 10);
      birthYear = yearDigits > 30 ? 1900 + yearDigits : 2000 + yearDigits;

      // Extract day number (digits 3-5 for day of the year)
      let dayOfYear = parseInt(NIC.substring(2, 5), 10);

      // Adjust dayOfYear for gender (500+ means female)
      if (dayOfYear > 500) {
        gender = "Female";
        dayOfYear -= 500;
      } else {
        gender = "Male";
      }

      // Convert day of the year to a date
      const date = new Date(birthYear, 0); // Start from Jan 1st
      date.setDate(dayOfYear);
      birthDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Handle New NIC Format (12 digits)
    } else if (/^\d{12}$/.test(NIC)) {
      birthYear = parseInt(NIC.substring(0, 4), 10); // First 4 digits for year

      // Extract day number (digits 5-7 for day of the year)
      let dayOfYear = parseInt(NIC.substring(4, 7), 10);

      // Adjust dayOfYear for gender (500+ means female)
      if (dayOfYear > 500) {
        gender = "Female";
        dayOfYear -= 500;
      } else {
        gender = "Male";
      }

      // Convert day of the year to a date
      const date = new Date(birthYear, 0); // Start from Jan 1st
      date.setDate(dayOfYear);
      birthDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    }

    return { birthYear, birthDate, gender };
  };

  const handleNICChange = (e) => {
    const NIC = e.target.value.trim();

    if (NIC.length > 12) return;

    const birthInfo = extractBirthInfoFromNIC(NIC);

    if (birthInfo) {
      const { birthYear, birthDate, gender } = birthInfo;

      // Old NIC validation for matching birth year
      if (NIC.length === 10 && birthYear) {
        const firstTwoDigits = parseInt(NIC.substring(0, 2), 10);
        const birthYearLastTwo = birthYear % 100;

        if (firstTwoDigits !== birthYearLastTwo) {
          alert("NIC does not match the birth year.");
          return;
        }
      }

      setEditingMember({
        ...editingMember,
        NIC,
        birthDay: birthDate || editingMember.birthDay,
        gender: gender || editingMember.gender,
      });
    } else {
      setEditingMember({ ...editingMember, NIC });
    }
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    try {
      const payload = {
        ...editingMember,
        birthDay: new Date(editingMember.birthDay).toISOString(),
        gender: editingMember.gender, // Include gender in payload
      };

      if (editingMember.password) {
        payload.password = editingMember.password;
      }

      const response = await fetch(
        `http://localhost:3001/QATeam/update/${editingMember._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedMember = await response.json();
        setQATeam(
          qaTeam.map((member) =>
            member._id === updatedMember.updatedMember._id
              ? updatedMember.updatedMember
              : member
          )
        );
        setEditingMember(null);
        alert("Member updated successfully");
      } else {
        const errorData = await response.json();
        alert(`Error updating member: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("An error occurred while updating the member. Please try again.");
    }
  };

  const filteredQATeam = qaTeam.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    const genderMatches =
      selectedGender === "" || member.gender === selectedGender;

    return (
      (member.name.toLowerCase().includes(searchLower) ||
        member.NIC.toLowerCase().includes(searchLower)) &&
      genderMatches
    );
  });

  return (
    <div className="qa-records w-4/5 mx-auto p-5">
      <h2 className="text-center mb-5 text-gray-800 text-2xl font-bold">
        QA Team Members
      </h2>

      <input
        type="text"
        placeholder="Search by Name or NIC"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-1/2 p-2 mb-5 border border-gray-300 rounded"
      />

      <select
        value={selectedGender}
        onChange={(e) => setSelectedGender(e.target.value)}
        className="w-1/4 p-2 mb-5 ml-5 border border-gray-300 rounded"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <table className="w-full border-collapse fade-in">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-200">Name</th>
            <th className="border border-gray-300 p-2 bg-gray-200">NIC</th>
            <th className="border border-gray-300 p-2 bg-gray-200">Email</th>
            <th className="border border-gray-300 p-2 bg-gray-200">Phone</th>
            <th className="border border-gray-300 p-2 bg-gray-200">
              Birth Date
            </th>
            <th className="border border-gray-300 p-2 bg-gray-200">Address</th>
            <th className="border border-gray-300 p-2 bg-gray-200">Gender</th>
            <th className="border border-gray-300 p-2 bg-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQATeam.map((member) => (
            <tr
              key={member._id}
              className="hover:bg-green-100 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
            >
              <td className="border border-gray-300 p-2">{member.name}</td>
              <td className="border border-gray-300 p-2">{member.NIC}</td>
              <td className="border border-gray-300 p-2">
                {member.contactInfo.email}
              </td>
              <td className="border border-gray-300 p-2">
                {member.contactInfo.phone}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(member.birthDay).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2">
                {member.address
                  ? `${member.address.street}, ${member.address.city}`
                  : "N/A"}
              </td>
              <td className="border border-gray-300 p-2">{member.gender}</td>
              <td className="border border-gray-300 p-2">
                <button
                  className="w-24 bg-green-500 hover:bg-green-600 text-white py-1 rounded mb-2"
                  onClick={() => handleEdit(member)}
                >
                  Update
                </button>
                <button
                  className="w-24 bg-red-500 hover:bg-red-600 text-white py-1 rounded"
                  onClick={() => handleDelete(member._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingMember && (
        <div className="edit-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg p-4 w-80 z-50">
          <h3 className="text-center mb-2 text-gray-800">Edit QA Member</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <input
              type="text"
              value={editingMember.name}
              onChange={handleNameChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="Name"
              required
            />

            <input
              type="text"
              value={editingMember.NIC}
              onChange={handleNICChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="NIC"
              required
            />

            <input
              type="email"
              value={editingMember.contactInfo.email}
              onChange={(e) =>
                setEditingMember({
                  ...editingMember,
                  contactInfo: {
                    ...editingMember.contactInfo,
                    email: e.target.value,
                  },
                })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="Email"
              required
            />
            <input
              type="tel"
              value={editingMember.contactInfo.phone}
              onChange={handlePhoneChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="Phone"
              required
            />

            <input
              type="date"
              value={
                editingMember.birthDay
                  ? editingMember.birthDay.substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                setEditingMember({ ...editingMember, birthDay: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="Birth Date"
              required
            />
            <input
              type="text"
              value={editingMember.address ? editingMember.address.street : ""}
              onChange={(e) =>
                setEditingMember({
                  ...editingMember,
                  address: { ...editingMember.address, street: e.target.value },
                })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="Street Address"
            />
            <input
              type="text"
              value={editingMember.address ? editingMember.address.city : ""}
              onChange={(e) =>
                setEditingMember({
                  ...editingMember,
                  address: { ...editingMember.address, city: e.target.value },
                })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="City"
            />
            <select
              value={editingMember.gender}
              onChange={(e) =>
                setEditingMember({ ...editingMember, gender: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded mt-2"
            >
              Update Member
            </button>
          </form>
          <button
            onClick={() => setEditingMember(null)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default QATeam;
