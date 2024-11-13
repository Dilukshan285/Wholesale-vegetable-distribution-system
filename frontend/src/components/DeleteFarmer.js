import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function DeleteFarmer() {
  const { id } = useParams(); // Get the farmer ID from the URL
  const navigate = useNavigate(); // For navigation after deletion
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = () => {
    setIsDeleting(true);
    axios
      .delete(`http://localhost:3001/farmer/delete/${id}`)
      .then(() => {
        alert("Farmer deleted successfully");
        navigate("/"); // Redirect to the list of all farmers
      })
      .catch((err) => {
        setError(err.message);
        alert("Error deleting farmer: " + err.message);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div className="container">
      <h2>Delete Farmer</h2>
      <p>Are you sure you want to delete this farmer?</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <button 
        className="btn btn-danger" 
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Farmer"}
      </button>
    </div>
  );
}

export default DeleteFarmer;
