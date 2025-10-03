import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password,
      });

      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message || "User not found",
          timer: 3000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/register");
        }, 3000);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        Swal.fire({
          icon: "warning",
          title: "Account Not Found",
          text: "You need to register before logging in.",
          timer: 3000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/register");
        }, 3000);
      } else {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Your Password"
          required
        />

        <button type="submit">LOGIN</button>

        <button
          type="button"
          onClick={() => navigate("/forgotpassword")}
          style={{
            marginTop: "10px",
            backgroundColor: "#f44336",
            color: "#fff",
          }}
        >
          Forgot Password
        </button>
      </form>
    </div>
  );
};

export default Login;
