import CryptoJS from "crypto-js";

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
  await fetch(`https://your-api.com/users/${userId}/migrate-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, orders }),
  });
};
