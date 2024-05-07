const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const recruiterRoutes = require("./routes/recruiter.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/recruiter", recruiterRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is up and running on " + PORT);
});

module.exports = app;
