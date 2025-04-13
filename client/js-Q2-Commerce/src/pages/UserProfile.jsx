import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider"; 
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { convertImageToBase64 } from "../utils/imageUtils";
import "../styles/UserProfile.module.css"

const UserProfile = () => {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showAddressToast, setShowAddressToast] = useState(false);
  const [showPaymentToast, setShowPaymentToast] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [vendorZipFile, setVendorZipFile] = useState(null);
  const [updateData, setUpdateData] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    phone: user?.phone || "",
    password: "",
    picture: user?.picture,
  });

  const fullName = `${user?.first_name} ${user?.last_name}`;

  const handleVendorRequest = () => {
    setShowVendorForm(!showVendorForm);
  };

  const handleFileUpload = (event) => {
    setVendorZipFile(event.target.files[0]);
  };

  const handleSubmitVendorRequest = () => {
    if (vendorZipFile) {
      toast.success("Vendor request submitted successfully!", { position: "top-right" });
      setShowVendorForm(false);
    } else {
      toast.error("Please upload a valid zip file!", { position: "top-right" });
    }
  };

  const handleUpdateProfile = () => {
    setShowUpdateProfile(!showUpdateProfile);
  };

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const base64Image = await convertImageToBase64(e.target.files[0]);
    setUpdateData({ ...updateData, picture: base64Image });
  };

  const handleSubmitUpdate = () => {
    if (!updateData.email) {
      toast.error("Email is required!", { position: "top-center" });
      return;
    }
    if (!updateData.phone) {
      toast.error("Phone number is required!", { position: "top-center" });
      return;
    }
    user.updateUserDetails(updateData);
    toast.success("Profile updated successfully!", { position: "top-center" });
    setShowUpdateProfile(false);
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto transition duration-300 ${
      theme === "dark" ? "bg-gray-900 text-white" : theme === "grey" ? "bg-gray-300 text-gray-700" : "bg-white text-black"
    }`}>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="shadow-md rounded-lg p-4">
        <p><strong>Full Name:</strong> {fullName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Created At:</strong> {user?.created_at}</p>
        <p><strong>Role:</strong> {user?.role}</p>

        <button onClick={toggleTheme} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
          Switch Theme ({theme})
        </button>

        <button onClick={() => navigate("/cart")} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Shopping Cart
        </button>

        <button onClick={() => navigate("/transactions")} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Transactions
        </button>

        <div className="mt-6">
          <p><strong>Address:</strong> {user?.addresses?.default || "No default address set"}</p>
          <button onClick={() => setShowAddressToast(!showAddressToast)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
            Manage Addresses
          </button>
        </div>

        <div className="mt-6">
          <p><strong>Payment Method:</strong> {user?.payment_methods?.default || "No default payment method set"}</p>
          <button onClick={() => setShowPaymentToast(!showPaymentToast)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded">
            Manage Payment Methods
          </button>
        </div>

        <div className="mt-6">
          <button onClick={logoutUser} className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>

        <div className="mt-6">
          <button onClick={handleUpdateProfile} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Update Profile
          </button>

          {showUpdateProfile && (
            toast(
              <div className="p-4 bg-gray-100 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-2">Update Profile</h2>
                <input type="text" name="first_name" placeholder="First Name" value={updateData.first_name} onChange={handleUpdateChange} className="block w-full p-2 border rounded mb-2"/>
                <input type="text" name="last_name" placeholder="Last Name" value={updateData.last_name} onChange={handleUpdateChange} className="block w-full p-2 border rounded mb-2"/>
                <input type="email" name="email" placeholder="Email" value={updateData.email} onChange={handleUpdateChange} required className="block w-full p-2 border rounded mb-2"/>
                <input type="tel" name="phone" placeholder="Phone Number" value={updateData.phone} onChange={handleUpdateChange} required className="block w-full p-2 border rounded mb-2"/>
                <input type="password" name="password" placeholder="New Password" value={updateData.password} onChange={handleUpdateChange} className="block w-full p-2 border rounded mb-2"/>
                <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full p-2 border rounded mb-2"/>
                <button onClick={handleSubmitUpdate} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4">
                  Save Changes
                </button>
              </div>,
              { position: "top-center", autoClose: false }
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;



/*
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [showAddressToast, setShowAddressToast] = useState(false);
  const [showPaymentToast, setShowPaymentToast] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);

  const fullName = `${user?.first_name} ${user?.last_name}`;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleAddressToast = () => setShowAddressToast(!showAddressToast);
  const handlePaymentToast = () => setShowPaymentToast(!showPaymentToast);
  const handleExpandMessages = () => setShowMessages(!showMessages);

  const handleSelectMessage = (message) => {
    toast(`📩 ${message.title}: ${message.body}`, { position: "top-right" });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <p><strong>Full Name:</strong> {fullName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Created At:</strong> {user?.created_at}</p>
        <p><strong>Role:</strong> {user?.role}</p>

        <div className="flex gap-4 mt-4">
          <button onClick={() => navigate("/cart")} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Shopping Cart</button>
          <button onClick={() => navigate("/transactions")} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">Transactions</button>
        </div>

        <div className="mt-6">
          <p><strong>Address:</strong> {user?.addresses.default || "No default address set"}</p>
          <button onClick={handleAddressToast} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded mt-2">Manage Addresses</button>
        </div>

        <div className="mt-6">
          <p><strong>Payment Method:</strong> {user?.payment_methods.default || "No default payment method set"}</p>
          <button onClick={handlePaymentToast} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded mt-2">Manage Payment Methods</button>
        </div>

        <div className="mt-6">
          <p><strong>Privileges:</strong></p>
          <table className="table-auto w-full text-left text-gray-700 dark:text-gray-300">
            <thead>
              <tr>
                <th className="border-b dark:border-gray-700">Privilege</th>
                <th className="border-b dark:border-gray-700">Granted</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(user?.privileges || {}).map(([privilege, isGranted]) => (
                <tr key={privilege}>
                  <td className="border-b dark:border-gray-700">{privilege}</td>
                  <td className="border-b dark:border-gray-700">{isGranted ? "✅ Yes" : "❌ No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            onClick={handleExpandMessages}
            className={`${
              user?.messages.some((msg) => msg.unread) ? "bg-red-500" : "bg-gray-500"
            } text-white font-semibold px-4 py-2 rounded`}
          >
            Messages ({user?.messages.filter((msg) => msg.unread).length || user?.messages.length})
          </button>

          {showMessages && (
            <div className="bg-gray-100 dark:bg-gray-700 p-4 mt-2 rounded">
              {user?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-2 mb-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSelectMessage(msg)}
                >
                  <strong>{msg.title}</strong> - {msg.unread ? "Unread" : "Read"}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
*/