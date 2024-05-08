const express = require("express");
const recruiterControllers = require("../controllers/recruiter.controllers");
const { authUser } = require("../middlewares/jwtAuth.middlewares");
const { verifiedUser } = require("../middlewares/verifiedUser.middleware")
const router = express.Router();

router.post("/job", authUser, verifiedUser, recruiterControllers.postJob);

router.get("/jobs", authUser, verifiedUser, recruiterControllers.listJobs);

router.get("/job/:jobId/applications", authUser, verifiedUser, recruiterControllers.listApplications);

router.patch("/job/:jobId/closeJob", authUser, verifiedUser, recruiterControllers.closeJob);

router.get("/job/:jobId/applications/:applicationId", authUser, verifiedUser, recruiterControllers.getApplication)

router.patch("/job/:jobId/applications/:applicationId", authUser, verifiedUser, recruiterControllers.updateApplication)

module.exports = router;
