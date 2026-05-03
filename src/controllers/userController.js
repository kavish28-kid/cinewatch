"use strict";

const crypto = require("node:crypto");
const User = require("../models/User");
const createHttpError = require("../utils/httpError");

const demoUser = {
  email: "demo@cinewatch.local",
  name: "Demo User",
  passwordHash: "demo-user-password",
};

function hashPassword(password = "") {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function publicUser(user) {
  return {
    id: user.id,
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function getUsers(req, res) {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json({ users });
}

async function createUser(req, res) {
  const password = req.body.password || req.body.passwordHash;

  if (!req.body.name || !req.body.email || !password) {
    throw createHttpError(400, "name, email, and password are required");
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    passwordHash: hashPassword(password),
  });

  res.status(201).json({
    user: publicUser(user),
  });
}

async function loginUser(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    throw createHttpError(400, "email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, "invalid email or password");
  }

  const hashedPassword = hashPassword(password);
  const isValidPassword = user.passwordHash === hashedPassword || user.passwordHash === password;

  if (!isValidPassword) {
    throw createHttpError(401, "invalid email or password");
  }

  res.json({ user: publicUser(user) });
}

async function getUser(req, res) {
  const user = await User.findById(req.params.userId).select("-passwordHash");

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  res.json({ user });
}

async function getDemoUser(req, res) {
  const user = await User.findOneAndUpdate(
    { email: demoUser.email },
    { $setOnInsert: demoUser },
    {
      returnDocument: "after",
      setDefaultsOnInsert: true,
      upsert: true,
    },
  ).select("-passwordHash");

  res.json({ user });
}

module.exports = {
  createUser,
  getDemoUser,
  getUser,
  getUsers,
  loginUser,
};
