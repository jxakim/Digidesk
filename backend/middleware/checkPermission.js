const User = require('../models/User');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        // User is not authenticated
        console.warn('User not authenticated'); // Log as a warning
        return res.status(401).json({ error: 'User not authenticated' }); // Return 401 instead of 403
      }

      const user = await User.findById(req.user.id).populate({
        path: 'group',
      });

      if (!user || !user.group) {
        return res.status(403).json({ error: 'Access denied: No group assigned' });
      }

      if (!Array.isArray(user.group.permissions)) {
        return res.status(500).json({ error: 'Permissions field is not an array or is undefined' });
      }

      if (!user.group.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          error: `Access denied: You do not have the '${requiredPermission}' permission.`,
        });
      }

      next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = checkPermission;