import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { convertImageToBase64 } from "../utils/imageUtils";
import "../styles/SignUp.css"; // Importing the CSS file for styling

const SignUp = () => {
  const { authenticateUser } = useAuth();
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", password: "", picture: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const base64Image = await convertImageToBase64(e.target.files[0]);
    setNewUser({ ...newUser, picture: base64Image });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authenticateUser(newUser);
      navigate("/profile");
    } catch (err) {
      setError("Error creating account.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required className="block w-full p-2 border rounded mb-2"/>
      <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required className="block w-full p-2 border rounded mb-2"/>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="block w-full p-2 border rounded mb-2"/>
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="block w-full p-2 border rounded mb-2"/>
      <input type="file" accept="image/*" onChange={handleFileChange} required className="block w-full p-2 border rounded mb-2"/>
      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full">Sign Up</button>
    </form>
  );
};

export default SignUp;
