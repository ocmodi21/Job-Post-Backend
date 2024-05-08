const express = require("express");
const candidateControllers = require("../controllers/candidate.controllers");
const { authUser } = require("../middlewares/jwtAuth.middlewares");
const { verifiedUser } = require("../middlewares/verifiedUser.middleware")
const router = express.Router();

router.get("/newJobs", authUser, verifiedUser, candidateControllers.newJobs);

router.post("/applyJob/:jobId", authUser, verifiedUser, candidateControllers.applyJob);

router.get("/appliedJobs", authUser, verifiedUser, candidateControllers.appliedJobs);

module.exports = router;
