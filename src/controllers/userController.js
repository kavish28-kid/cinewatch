"use strict";

const User = require("../models/User");
const createHttpError = require("../utils/httpError");

const demoUser = {
  email: "demo@cinewatch.local",
  name: "Demo User",
  passwordHash: "demo-user-password",
};

async function getUsers(req, res) {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json({ users });
}

async function createUser(req, res) {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
  });

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
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
};
