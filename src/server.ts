import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import { logger } from "./utils/logEvent";
import api from "./routes/index";
import errorHandler from "./utils/errorHandler";

// env
dotenv.config();

const app = express();

// logger middlerware
app.use(logger);

//built in middlerware to handle urlencoded data
//in other words, form data:
// content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//built in middlerware for json
app.use(bodyParser.json());

//session
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
  session({
    name: "session",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      expires: expiryDate,
    },
  })
);

//Cross origin middleware
app.use("*", cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, API-Key, Authorization, Set-Cookie, Cooki, Bearer"
//   );
//   next();
// });

// PROTECT ALL ROUTES THAT FOLLOW
// app.use((req, res, next) => {
//   const apiKey = req.get("API-Key");
//   if (!apiKey || apiKey !== process.env.API_KEY) {
//     res.status(401).json({ error: "minta api key nya dulu wakwaw" });
//   } else {
//     next();
//   }
// });

app.get("/", (req, res) => {
  res.json({
    massage: `Welcome Digi Workshop`,
  });
});

//ROUTES
app.use("/api/v1", api);

// error middlerware
app.use(errorHandler);

app.listen(process.env.PORT || 4000, () =>
  console.log(`Server Berjalan http://localhost:${process.env.PORT}`)
);
