import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiURL = "http://localhost:3001";

const DriverLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Validation
    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    try {
      const res = await fetch(`${apiURL}/driver/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token and driver's name in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("driverName", data.driver.name); // Store the driver's name
        localStorage.setItem("driverNic", data.driver.nic);
        console.log(data.driver.nic);
        toast.success("Login successful");
        navigate("/driver"); // Redirect to driver page on success
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg w-full max-w-sm shadow-lg border border-green-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Driver Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="flex items-center border py-2 px-3 rounded-lg">
              <FaEnvelope className="mr-3 text-green-500" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center border py-2 px-3 rounded-lg">
              <FaLock className="mr-3 text-green-500" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
              />
              <div onClick={togglePasswordVisibility} className="cursor-pointer text-gray-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;
