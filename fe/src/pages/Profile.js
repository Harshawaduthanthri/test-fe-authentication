import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/ProfileStyles.css";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  if (!auth?.user) {
    return <p>Please login to see your profile.</p>;
  }

  const { name, email, phone, address, role, _id } = auth.user;

  // Open edit form
  const handleEdit = () => {
    setFormData({ name, phone, address });
    setIsEditing(true);
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/auth/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (res.data.success) {
        setAuth({ ...auth, user: res.data.updatedUser });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Delete profile
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        const res = await axios.delete(
          `http://localhost:5000/api/v1/auth/delete-profile/${_id}`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        if (res.data.success) {
          setAuth({});
          toast.success("Profile deleted successfully!");
          navigate("/login");
        } else {
          toast.error(res.data.message || "Failed to delete profile");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {!isEditing ? (
        <>
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Phone:</strong> {phone}
            </p>
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Role:</strong> {role === 1 ? "Admin" : "User"}
            </p>
          </div>

          <div className="profile-buttons">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete} className="delete-btn">
              Delete
            </button>
          </div>
        </>
      ) : (
        <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={email} readOnly />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="edit-buttons">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
