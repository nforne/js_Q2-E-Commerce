import { randomBytes, pbkdf2Sync } from 'crypto';
import JWT from 'jsonwebtoken';

// Secret key for signing JWT tokens (store securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const SALT_LENGTH = 16; // Salt length
const HASH_ITERATIONS = 10000; // Number of iterations
const HASH_LENGTH = 64; // Key length
const HASH_ALGORITHM = 'sha512'; // Hashing algorithm

// Middleware to verify JWT token
export function verifyJwtToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the JWT token
    const decodedToken = JWT.verify(token, JWT_SECRET); // Verify the token

    req.user = decodedToken; // Attach decoded payload to the request object
    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized. Invalid or expired token.', error: error.message });
  }
}

// Generate JWT token
export function generateJwtToken(user) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    role: user.role,
  };

  return JWT.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Hash a password using crypto
export function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH).toString('hex'); // Generate a random salt
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('hex'); // Hash the password
  return `${salt}:${hash}`; // Return the combined salt and hash
}

// Verify a password
export function verifyPassword(password, storedPassword) {
  const [salt, originalHash] = storedPassword.split(':'); // Split the stored password into salt and hash
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('hex'); // Hash the provided password with the original salt
  return hash === originalHash; // Check if the hashes match
}

// Middleware to handle user sign-out (optional for stateless JWT systems)
export function signOut(req, res) {
  try {
    // Invalidate token (this is handled client-side by simply removing the token)
    res.status(200).send({ message: 'Sign-out successful. Please delete the token on the client side.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}


//----------------------------------------------------------------------------------------------------


/*

import { randomBytes, pbkdf2Sync } from 'crypto';
import JWT from 'jsonwebtoken';

// Ensure JWT secret is securely stored in environment variables
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}
const JWT_SECRET = process.env.JWT_SECRET;

const SALT_LENGTH = process.env.SALT_LENGTH || 16; // Default salt length
const HASH_ITERATIONS = process.env.HASH_ITERATIONS || 10000; // Default iterations
const HASH_LENGTH = 64; // Key length
const HASH_ALGORITHM = 'sha512'; // Hashing algorithm

// Generate JWT token
export function generateJwtToken(user) {
  const expiresIn = user.role === 'administrator' ? '6h' : user.role === 'vendor' ? '2h' : '1h';
  return JWT.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      privileges: user.privileges,
    },
    JWT_SECRET,
    { expiresIn }
  );
}

// Verify JWT token middleware
export function verifyJwtToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = JWT.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'Unauthorized. Token has expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'Unauthorized. Invalid token signature.' });
    }
    return res.status(401).send({ message: 'Unauthorized. Invalid token.' });
  }
}

// Hash a password using crypto
export function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('hex');
  return `${salt}:${hash}`;
}

// Verify a password
export function verifyPassword(password, storedPassword) {
  const [salt, originalHash] = storedPassword.split(':');
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('hex');
  return hash === originalHash;
}

// Handle user sign-out
export function signOut(req, res) {
  res.status(200).send({ message: 'Sign-out successful. Please delete the token on the client side.' });
}


*/
