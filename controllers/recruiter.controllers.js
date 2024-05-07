const { PrismaClient } = require("@prisma/client");
const { connect } = require("../app");
const prisma = new PrismaClient();

const postJob = async (req, res) => {
  const { title, location, salary, description } = req.body;
  const { id, role } = req.user;

  try {
    if (role === "CANDIDATE")
      res.status(403).json({ message: "You are not authorized." });

    const job = await prisma.job.create({
      data: {
        title,
        location,
        salary,
        description,
        job_created_by: { connect: { id: id } },
      },
    });

    res.status(200).json({ data: { job } });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const listJobs = async (req, res) => {
  const { id, role } = req.user;

  try {
    if (role === "CANDIDATE")
      res.status(403).json({ message: "You are not authorized." });

    const jobs = await prisma.job.findMany({
      where: {
        job_created_by: {
          id: id,
        },
      },
    });

    res.status(200).json({ data: { jobs } });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  postJob,
  listJobs,
};
