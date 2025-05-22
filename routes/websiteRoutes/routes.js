const express = require("express");
const main = express.Router();
const mongoose = require("mongoose");
const Blog = require("../../model/blogModel"); // Adjust path as needed

main.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find(); // Await is required
    res.render("blogWebsite", { blogs: allBlogs }); // Passing blogs to the view
  } catch (error) {
    res.status(500).send("Failed to load blog homepage");
  }
});
main.get("/blog-single/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send("Invalid blog ID");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // Send blog data to the HBS page
    res.render("single-blog", { blog });
  } catch (err) {
    res.status(500).send("Error loading blog page");
  }
});
main.get("/login", (req, res) => {
  res.render("login"); // No .hbs extension needed
});
main.get("/signup", (req, res) => {
  res.render("signup"); // No .hbs extension needed
});

module.exports = main;
