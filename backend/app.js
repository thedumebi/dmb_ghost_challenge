require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./utils/db");
const { cors, notFound, errorHandler } = require("./middlewares");

// port
const port = process.env.PORT || 4000;

const app = express();

// middlewares
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/comments", require("./routes/comments"));

// Static folder
// app.use(express.static(path.join(__dirname, "..", "/frontend")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/frontend/build/index.html"));
  });
} else {
  // app.get("/", (req, res) => {
  //   res.send(`API is running on port ${port}`);
  // });

  app.use(express.static(path.join(__dirname, "..", "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/frontend/build/index.html"));
  });
}

// more middlewares
app.use(notFound);
app.use(errorHandler);

// db
connectDB(() => {
  app.listen(port, () => {
    console.log(
      "\x1b[33m%s\x1b[0m",
      `Server running on port ${port} in ${process.env.NODE_ENV} mode`
    );
  });
});
