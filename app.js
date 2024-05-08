const express = require("express");
const cors = require("cors");
const { logger } = require("./middlewares/logger");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const recruiterRoutes = require("./routes/recruiter.routes");
const candidateRoutes = require("./routes/candidate.routes");
const app = express();

app.use(cors());
app.use(logger);
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/recruiter", recruiterRoutes);
app.use("/api/v1/candidate", candidateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is up and running on " + PORT);
});

module.exports = app;
