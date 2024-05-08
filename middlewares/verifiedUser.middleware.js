const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const verifiedUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (user.verified === false)
      return res.status(403).json({ message: "You are not verified." });
    next();
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  verifiedUser,
};
