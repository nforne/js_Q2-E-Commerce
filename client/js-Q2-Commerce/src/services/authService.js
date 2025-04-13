import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_SECRET_KEY || "default-secure-key"; // 🔐 Secure via environment variable

// Encrypt data before storing it locally
export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

// Decrypt local storage data when retrieving it
export const decryptData = (cipherText) => {
  if (!cipherText) return null; // ✅ Prevent decryption errors if data doesn't exist
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// Fetch user data from backend securely
export const fetchUserData = async (credentials) => {
  try {
    const response = await fetch("https://your-api.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Authentication failed");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Migrate local data to backend securely
export const migrateLocalDataToBackend = async (cart, orders, userId) => {
  try {
    const response = await fetch(`https://your-api.com/users/${userId}/migrate-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, orders }),
    });

    if (!response.ok) throw new Error("Migration failed");
    return await response.json();
  } catch (error) {
    console.error("Error migrating local data:", error);
    throw error;
  }
};


`import CryptoJS from "crypto-js";

const secretKey = "js-q2-ec-secure-key"; // 🔐 Keep this secure!

// Encrypt data before storing it locally
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Decrypt local storage data when retrieving it
export const decryptData = (cipherText) => {
  if (!cipherText) return null; // ✅ Prevent decryption errors if data doesn't exist
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Fetch user data from backend
export const fetchUserData = async (credentials) => {
  const response = await fetch("https://your-api.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error("Authentication failed");
  return await response.json();
};

// Migrate local data to backend
export const migrateLocalDataToBackend = async (cart, orders, userId) => {
  await fetch(\`https://your-api.com/users/\${userId}/migrate-data\`, {   //
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, orders }),
  });
};
`


`import { encryptData, decryptData } from "../utils/security";
import { migrateLocalDataToBackend } from "../utils/storage";
import axios from "axios";

const API_URL = "https://your-api.com";

/**
 * Fetch user data from backend.
 */
export const fetchUserData = async (credentials) => {
  const response = await axios.post(\`\${API_URL}/auth/login\`, credentials); //

  if (!response.data) throw new Error("Authentication failed");
  return response.data;
};

/**
 * Signs in the user and stores encrypted session data.
 */
export const signIn = async (credentials) => {
  const userData = await fetchUserData(credentials);

  if (userData?.token) {
    localStorage.setItem("jwtToken", userData.token);

    // Encrypt and store user data locally (casual users)
    localStorage.setItem("js-q2-ec-user", encryptData(userData));

    return userData;
  }

  return null;
};

/**
 * Signs out the user by clearing session and local data.
 */
export const signOut = async () => {
  await axios.post(\`\${API_URL}/auth/logout\`);  //
  localStorage.removeItem("jwtToken");
  localStorage.setItem("js-q2-ec-user", encryptData({ user_id: null, isAnonymous: true }));
};

/**
 * Migrate local shopping data to backend upon registration.
 */
export const migrateUserData = async (userId) => {
  await migrateLocalDataToBackend(userId);
};
`







