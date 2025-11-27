import jwt from 'jsonwebtoken';

export const generateToken = (userId, collegeId, role = 'user') => {
  return jwt.sign(
    { 
      userId, 
      collegeId, 
      role 
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
    { expiresIn: '30d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this');
  } catch (error) {
    return null;
  }
};
