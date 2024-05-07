const express = require("express");
const recruiterControllers = require("../controllers/recruiter.controllers");
const { authUser } = require("../middlewares/jwtAuth.middlewares");
const router = express.Router();

router.post("/createJob", authUser, recruiterControllers.postJob);

router.get("/allJobs", authUser, recruiterControllers.listJobs);

module.exports = router;
