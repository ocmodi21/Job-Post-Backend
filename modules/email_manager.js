const { application } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendUserVerification = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    secure: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  const url = process.env.URL + token;

  const emailConfig = {
    from: "Job Portal <nirmittestcase@gmail.com>",
    to: email,
    subject: "Email Verification",
    text: `Please click on the below link to verify your email. ${url}`,
  };

  try {
    await transporter.sendMail(emailConfig);
    return {
      status: 200,
      message: "Email sent successfully.",
    };
  } catch (e) {
    return {
      status: 400,
      message: "Email not sent.",
    };
  }
};

const sendAppliedApplication = async(email, job) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    secure: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });



  const emailConfig = {
    from: "Job Portal <nirmittestcase@gmail.com>",
    to: email,
    subject: "Application Submitted",
    text: `Your application for ${job.title} at ${job.company_name} has been submitted. Come back later for the updated application status.`,
  };

  try {
    await transporter.sendMail(emailConfig);
    return {
      status: 200,
      message: "Email sent successfully.",
    };
  } catch (e) {
    return {
      status: 400,
      message: "Email not sent.",
    };
  }
}

const sendApplicationUpdate = async (email, job, application) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    secure: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });



  const emailConfig = {
    from: "Job Portal <nirmittestcase@gmail.com>",
    to: email,
    subject: "Application Status Update",
    text: `Your application status for ${job.title} at ${job.company_name} has been updated to ${application.status}. Please check job portal for more details.`,
  };

  try {
    await transporter.sendMail(emailConfig);
    return {
      status: 200,
      message: "Email sent successfully.",
    };
  } catch (e) {
    return {
      status: 400,
      message: "Email not sent.",
    };
  }
};

module.exports = {
  sendUserVerification,
  sendAppliedApplication,
  sendApplicationUpdate
};
