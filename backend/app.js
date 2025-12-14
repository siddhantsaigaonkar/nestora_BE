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
import MongoStore from "connect-mongo";
dotenv.config(); 


const app = express();
const port = 8001;
const MONGO_URL = process.env.MONGO_URL;

/* -----------------------------------------------------
   CORS
----------------------------------------------------- */
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "https://nestora-fe.vercel.app",
    credentials: true,
  })
);

// app.options("*", cors());


// 🔥 REQUIRED for sessions + cookies
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });


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



app.set("trust proxy", 1);

/* -----------------------------------------------------
   SESSION
----------------------------------------------------- */
app.use(
  session({
    name: "nestora.sid",
    secret: "mySecretFlash",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // Session expires in 14 days
    }),
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
