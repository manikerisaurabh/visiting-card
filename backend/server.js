const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./routes/auth.routes.js");
const userRoute = require("./routes/user.route.js");
const cardRoute = require("./routes/card.routes.js");
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
require("dotenv").config();

const port = process.env.PORT | 8080;

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/card", cardRoute);
app.listen(port, () => {
  console.log("Server is listening on port : ", port);
});
