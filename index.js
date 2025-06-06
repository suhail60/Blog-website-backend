require("dotenv").config();
const express = require("express");
const path = require("path");

const dbConnect = require("./dbconnect");

const cors = require("cors")
const authRoutes = require("./routes/auth/authroutes")

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// View engine setup



// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const mainRoutes = require("./routes/websiteRoutes/routes");
const Blog = require("./routes/blog/blogRoutes");

app.use("/uploads", express.static("uploads"));

app.use("/api", mainRoutes);
app.use("/api/blog", Blog);
app.use("/api/auth",authRoutes)
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Blog Website",
    status: "success",
  });
});

const PORT = process.env.PORT || 5000;
console.log(PORT)
const HOST = process.env.HOST || "localhost";
// Connect to DB, then start server
dbConnect()
  .then(() => {
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`Server running on http://"0.0.0.0":${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });


  
