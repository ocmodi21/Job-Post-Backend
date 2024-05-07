const { PrismaClient } = require("@prisma/client");
const { verifyPassword, hashPassword } = require("../modules/password_manager");
const { generateJWT } = require("../modules/auth_manager");
const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await generateJWT(user);
    return res.status(200).json({ data: { token } });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  const {
    email,
    phone_number,
    password,
    first_name,
    last_name,
    role,
    company_name,
  } = req.body;

  try {
    if (role === "RECRUITER") {
      if (!company_name) {
        return res
          .status(400)
          .json({ message: "Company name is required for recruiters" });
      }
    }

    const hashedPassword = await hashPassword(password);

    const userData = {
      email,
      phone_number,
      password: hashedPassword,
      first_name,
      last_name,
      role,
    };

    if (role === "RECRUITER") {
      userData.company_name = company_name;
    }

    const user = await prisma.user.create({
      data: userData,
    });

    return res
      .status(200)
      .json({ message: "User created successfully", data: { user, token } });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  register,
};
