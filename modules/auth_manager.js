const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateJWT = async (user) => {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const verifyJWT = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateJWT,
  verifyJWT,
};
