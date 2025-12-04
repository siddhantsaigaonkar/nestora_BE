


import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  userProfile,
  getCurrentUser,
} from "../controllers/authController.js";

import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.get("/logout", logoutUser);

// Check authentication
router.get("/check-auth", checkAuth);

// Protected route
router.get("/profile", isLoggedIn, userProfile);

// Get logged-in user
router.get("/me", getCurrentUser);

export default router;
