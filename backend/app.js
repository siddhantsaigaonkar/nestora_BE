import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/reviews.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/user.js";
import userRouter from "./routes/user.js";
import dotenv from "dotenv";
dotenv.config(); 







const app = express();
const port = 8001;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

/* -----------------------------------------------------
   CORS
----------------------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use((req, res, next) => {
  console.log("📩 Incoming Request:", req.method, req.url);
  next();
});


/* -----------------------------------------------------
   Parsers
----------------------------------------------------- */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------------------------
   SESSION
----------------------------------------------------- */
app.use(
  session({
    secret: "mySecretFlash",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

/* -----------------------------------------------------
   PASSPORT (JSON FIX)
----------------------------------------------------- */

app.use(passport.initialize());
app.use(passport.session());



passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    User.authenticate()
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id); // store only user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});



/* -----------------------------------------------------
   MongoDB
----------------------------------------------------- */
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("DB Error:", err));

/* -----------------------------------------------------
   Routes
----------------------------------------------------- */
app.use("/api/listings", listingRouter);
app.use("/api", reviewRouter);
app.use("/api", userRouter);



  //  Error Handler

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});


//  Start Server
  





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
