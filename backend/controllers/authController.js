import User from "../models/user.js";
import passport from "passport";

// ==========================================
// REGISTER USER
// ==========================================
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Login user after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        message: `${username} registered successfully`,
        user: {
          username: registeredUser.username,
          email: registeredUser.email,
          _id: registeredUser._id.toString(),
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ==========================================
// LOGIN USER
// ==========================================
export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.json({
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          _id: user._id.toString(),
        },
      });
    });
  })(req, res, next);
};

// ==========================================
// LOGOUT USER
// ==========================================
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.json({ message: "Logged out successfully" });
  });
};

// ==========================================
// CHECK AUTH STATUS
// ==========================================
export const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
};

// ==========================================
// PROFILE (PROTECTED)
// ==========================================
export const userProfile = (req, res) => {
  res.json({
    message: "Welcome to your profile",
    user: req.user,
  });
};

// ==========================================
// CURRENT USER INFO
// ==========================================
export const getCurrentUser = (req, res) => {
  if (!req.user) return res.json(null);
  res.json(req.user);
};
