import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export function authenticateAndAuthorize(requiredPrivileges = [], requiredRole = null, allowSelf = false) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).send({ message: 'Access Denied: No Token Provided' });
    }

    try {
      const user = jwt.verify(token, JWT_SECRET);
      req.user = user;

      // Role check
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).send({ message: 'Forbidden: Insufficient Role' });
      }

      // Privilege check
      const userPrivileges = Object.keys(user.privileges || {}).filter(
        privilege => user.privileges[privilege]?.isGranted
      );

      const hasRequiredPrivileges = requiredPrivileges.every(privilege =>
        userPrivileges.includes(privilege)
      );

      if (requiredPrivileges.length > 0 && !hasRequiredPrivileges) {
        return res.status(403).send({ message: 'Forbidden: Insufficient Privileges' });
      }

      // Self-management check
      if (allowSelf && req.params.id && req.params.id !== user.user_id) {
        return res.status(403).send({ message: 'Forbidden: You can only manage your own account' });
      }

      next();
    } catch (error) {
      return res.status(403).send({ message: 'Invalid or Expired Token' });
    }
  };
}
