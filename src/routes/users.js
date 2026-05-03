"use strict";

const express = require("express");
const {
  createUser,
  getDemoUser,
  getUser,
  getUsers,
  loginUser,
} = require("../controllers/userController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getUsers));
router.post("/", asyncHandler(createUser));
router.post("/login", asyncHandler(loginUser));
router.post("/register", asyncHandler(createUser));
router.get("/demo", asyncHandler(getDemoUser));
router.get("/:userId", asyncHandler(getUser));

module.exports = router;
