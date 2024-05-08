const { verifyJWT } = require("../modules/auth_manager");

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader === undefined || !authHeader.startsWith("Bearer "))
    return res.status(401).json("You are not authenticated");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyJWT(token);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  authUser,
};
