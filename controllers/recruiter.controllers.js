const { PrismaClient } = require("@prisma/client");
const { sendApplicationUpdate } = require("../modules/email_manager");
const prisma = new PrismaClient();

const postJob = async (req, res) => {
  const { title, location, salary, description } = req.body;
  const { id, role } = req.user;

  try {
    if (role === "CANDIDATE")
      return res.status(403).json({ message: "You are not authorized." });

    const recruiter = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    const job = await prisma.job.create({
      data: {
        title,
        location,
        salary,
        description,
        company_name: recruiter.company_name,
        job_created_by: { connect: { id: id } },
      },
    });

    return res.status(200).json({ data: { job } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listJobs = async (req, res) => {
  const { id, role } = req.user;

  try {
    if (role === "CANDIDATE")
      return res.status(403).json({ message: "You are not authorized." });

    const jobs = await prisma.job.findMany({
      where: {
        job_created_by: {
          id: id,
        },
        status: "OPEN",
      },
    });

    return res.status(200).json({ data: { jobs } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listApplications = async (req, res) => {
  const { id, role } = req.user;
  const jobId = parseInt(req.params.jobId);

  try {
    if (role === "CANDIDATE")
      return res.status(403).json({ message: "You are not authorized." });

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        created_by: id,
      },
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or does not belong to you" });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: { application_created_by: true },
    });

    return res.status(200).json({ data: { applications } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const closeJob = async (req, res) => {
  const { id, role } = req.user;
  const jobId = parseInt(req.params.jobId);

  try {
    if (role === "CANDIDATE")
      return res.status(403).json({ message: "You are not authorized." });

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        created_by: id,
      },
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or does not belong to you" });
    }

    const deletedJob = await prisma.job.update({
      where: {
        id: jobId,
        created_by: id,
      },
      data: {
        status: "CLOSE",
      },
    });

    return res.status(200).json({ data: { deletedJob } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getApplication = async (req, res) => {
  const { id, role } = req.user;
  const applicationId = parseInt(req.params.applicationId);

  try {
    if (role === "CANDIDATE")
      return res.status(403).json({ message: "You are not authorized." });

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: { created_by: id },
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found or does not belong to your job",
      });
    }

    return res.status(200).json({ data: { application } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateApplication = async (req, res) => {
  const { id, role } = req.user;
  const { status } = req.body;
  const applicationId = parseInt(req.params.applicationId);

  try {
    if (role === "CANDIDATE")
      return res.status(403).json({ message: "You are not authorized." });

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: { created_by: id },
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found or does not belong to your job",
      });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        application_created_by: true,
        job: true,
      },
    });

    await sendApplicationUpdate(
      updatedApplication.application_created_by.email,
      updatedApplication.job,
      updatedApplication
    );

    return res.status(200).json({ data: { updatedApplication } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  postJob,
  listJobs,
  listApplications,
  closeJob,
  getApplication,
  updateApplication,
};
