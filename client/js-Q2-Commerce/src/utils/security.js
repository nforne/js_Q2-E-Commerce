import CryptoJS from "crypto-js";

const SECRET_KEY = "js-q2-ec-secure-key"; // 🔐 Keep this secure!

/**
 * Encrypts data before storing it locally.
 */
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

/**
 * Decrypts data when retrieving from local storage.
 */
export const decryptData = (cipherText) => {
  if (!cipherText) return null; // ✅ Prevent decryption errors if data doesn't exist
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
