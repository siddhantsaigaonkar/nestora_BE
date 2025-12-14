// import User from "../models/user.js";
// import passport from "passport";

// // ==========================================
// // REGISTER USER
// // ==========================================
// export const registerUser = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check for existing email
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Check for existing username
//     const existingUsername = await User.findOne({ username });
//     if (existingUsername) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);

//     // Login user after registration
//     req.login(registeredUser, (err) => {
//       if (err) return next(err);


//       console.log(`user created`);
      
//       return res.status(200).json({
//         message: `${username} registered successfully`,
//         user: {
//           username: registeredUser.username,
//           email: registeredUser.email,
//           _id: registeredUser._id.toString(),
//         },
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// };

// // ==========================================
// // LOGIN USER
// // ==========================================
// export const loginUser = (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);

//     if (!user) {
//       return res.status(400).json({ message: "Invalid username or password" });
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);

//       return res.json({
//         message: "Login successful",
//         user: {
//           username: user.username,
//           email: user.email,
//           _id: user._id.toString(),
//         },
//       });
//     });
//   })(req, res, next);
// };

// // ==========================================
// // LOGOUT USER
// // ==========================================
// export const logoutUser = (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);

//     res.json({ message: "Logged out successfully" });
//   });
// };

// // ==========================================
// // CHECK AUTH STATUS
// // ==========================================
// export const checkAuth = (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ loggedIn: true, user: req.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// };

// // ==========================================
// // PROFILE (PROTECTED)
// // ==========================================
// export const userProfile = (req, res) => {
//   res.json({
//     message: "Welcome to your profile",
//     user: req.user,
//   });
// };

// // ==========================================
// // CURRENT USER INFO
// // ==========================================
// export const getCurrentUser = (req, res) => {
//   if (!req.user) return res.json(null);
//   res.json(req.user);
// };




import User from "../models/user.js";
import passport from "passport";

/* =========================
   REGISTER
========================= */
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        message: "Registered successfully",
        user: {
          _id: registeredUser._id.toString(),
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

/* =========================
   LOGOUT (FIXED)
========================= */
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("nestora.sid"); // ⚠️ match your session name
      res.json({ message: "Logged out successfully" });
    });
  });
};

/* =========================
   CHECK AUTH (🔥 MOST IMPORTANT FIX)
========================= */
export const checkAuth = (req, res) => {
  // ⛔ DISABLE CACHE
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.isAuthenticated()) {
    return res.status(200).json({
      loggedIn: true,
      user: {
        _id: req.user._id.toString(),
        username: req.user.username,
        email: req.user.email,
      },
    });
  }

  return res.status(401).json({ loggedIn: false });
};

/* =========================
   PROTECTED PROFILE
========================= */
export const userProfile = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({
    message: "Welcome",
    user: req.user,
  });
};

/* =========================
   CURRENT USER
========================= */
export const getCurrentUser = (req, res) => {
  res.json(req.user || null);
};
