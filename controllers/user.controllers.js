const { PrismaClient } = require("@prisma/client");
const { verifyPassword, hashPassword } = require("../modules/password_manager");
const { generateJWT, verifyJWT } = require("../modules/auth_manager");
const { sendUserVerification } = require("../modules/email_manager");
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
    return res.status(200).json({ data: { user, token } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
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

    const token = await generateJWT(user);

    await sendUserVerification(email, token);

    return res
      .status(200)
      .json({ message: "User created successfully", data: { user, token } });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyUser = async (req, res) => {
  const token = req.params.token;

  try {
    const decoded = await verifyJWT(token);

    await prisma.user.update({
      data: {
        verified: true,
      },
      where: {
        id: decoded.id,
      },
    });

    return res.status(200).json({ message: "User Verified!" });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  register,
  verifyUser,
};
