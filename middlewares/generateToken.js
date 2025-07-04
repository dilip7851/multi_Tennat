import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '365d',
  });
  
  return token;
};

export default generateToken;
