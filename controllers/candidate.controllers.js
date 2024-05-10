const { PrismaClient } = require("@prisma/client");
const { sendAppliedApplication } = require("../modules/email_manager");
const prisma = new PrismaClient();

const newJobs = async (req, res) => {
  const { id, role } = req.user;

  try {
    if (role === "RECRUITER")
      return res.status(403).json({ message: "You are not authorized." });

    const jobs = await prisma.job.findMany({
      where: {
        NOT: {
          applications: {
            some: { created_by: id },
          },
        },
      },
      include: { job_created_by: true },
    });

    return res.status(200).json({ data: jobs });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const applyJob = async (req, res) => {
  const { id, role } = req.user;
  const jobId = parseInt(req.params.jobId);

  try {
    if (role === "RECRUITER")
      return res.status(403).json({ message: "You are not authorized." });

    const candidate = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    const existingApplication = await prisma.application.findFirst({
      where: {
        created_by: id,
        jobId,
      },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    const application = await prisma.application.create({
      data: {
        application_created_by: { connect: { id: id } },
        job: { connect: { id: jobId } },
      },
      include: {
        job: true,
      },
    });

    await sendAppliedApplication(candidate.email, application.job);

    return res.status(200).json({ data: { application } });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const appliedJobs = async (req, res) => {
  const { id, role } = req.user;

  try {
    if (role === "RECRUITER")
      return res.status(403).json({ message: "You are not authorized." });

    const applications = await prisma.application.findMany({
      where: { created_by: id },
      include: { job: true },
    });
    return res.json(applications);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  newJobs,
  applyJob,
  appliedJobs,
};
