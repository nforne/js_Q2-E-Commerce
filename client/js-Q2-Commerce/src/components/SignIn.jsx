import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css"; // Importing the CSS file for styling

const SignIn = () => {
  const { authenticateUser } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authenticateUser(credentials);
      navigate("/profile");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="block w-full p-2 border rounded mb-2"/>
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="block w-full p-2 border rounded mb-2"/>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">Sign In</button>
    </form>
  );
};

export default SignIn;
