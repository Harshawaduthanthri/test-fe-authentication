import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import "../../styles/AuthStyles.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Update form state and clear individual errors
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password)
    )
      newErrors.password =
        "Password must contain both uppercase and lowercase letters";

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Phone must be 10-15 digits";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        formData
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Redirecting to login...",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        toast.success(res.data.message || "Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Already Registered",
          text: "Please login to continue",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        toast.error(res.data.message || "Email is already registered");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.log(error.response?.data);
      if (error.response?.status === 409) {
        Swal.fire({
          icon: "info",
          title: "User Already Exists",
          text: "Redirecting to login...",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        toast.error("User already exists. Please login!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Something went wrong",
        });
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Your Name"
            autoFocus
          />
        </label>
        {errors.name && <span className="error">{errors.name}</span>}

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your Email"
          />
        </label>
        {errors.email && <span className="error">{errors.email}</span>}

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Your Password"
          />
        </label>
        {errors.password && <span className="error">{errors.password}</span>}

        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Your Phone"
          />
        </label>
        {errors.phone && <span className="error">{errors.phone}</span>}

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter Your Address"
          />
        </label>
        {errors.address && <span className="error">{errors.address}</span>}

        <button type="submit">REGISTER</button>
      </form>
    </div>
  );
};

export default Register;
