import { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import "../styles/AuthPage.module.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      {/* Tab Navigation */}
      <div className="flex justify-around border-b pb-2">
        <button
          onClick={() => setActiveTab("signin")}
          className={`px-4 py-2 ${activeTab === "signin" ? "border-b-2 border-blue-500 font-bold" : ""}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`px-4 py-2 ${activeTab === "signup" ? "border-b-2 border-green-500 font-bold" : ""}`}
        >
          Sign Up
        </button>
      </div>

      {/* Display Appropriate Form */}
      <div className="mt-4">
        {activeTab === "signin" ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
};

export default AuthPage;
