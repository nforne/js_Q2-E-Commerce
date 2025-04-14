import axios from "axios";

// API base URL
const API_URL = "https://api.example.com"; // Update with your actual backend URL

/**
 * Fetch user details by ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} - User details
 */
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

/**
 * Update user details
 * @param {string} userId - The ID of the user
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user details
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - New user data
 * @returns {Promise<Object>} - Created user details
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};
