import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secure_secret_key'; // Replace with a secure secret key

export function generateJwtToken(user) {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      role: user.role, // Include user role
      privileges: user.privileges, // Include user privileges
    },
    SECRET_KEY,
    { expiresIn: '1h' } // Token expiration time
  );
}
