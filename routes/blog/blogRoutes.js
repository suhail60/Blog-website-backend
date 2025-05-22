const express = require('express');
const router = express.Router();
const upload = require("../../config/multerConfig")
// const Blog = require('../models/blog');
const {create,getData,SingleBlogByMongoId,myBlogs,updateBlog,deleteBlog} = require("../../controller/blog")
// const  = require("../../controller/authController/auth.js")
const verifyLogin = require("../../middleware/authverify")


router.post('/create', verifyLogin, upload.single("pic"), create)
router.get("/read",getData)
router.get("/read/:id",SingleBlogByMongoId)
router.get("/myBlogs",verifyLogin,myBlogs);
router.put("/update/:id", verifyLogin, updateBlog);
router.delete("/delete/:id", verifyLogin, deleteBlog);

module.exports = router;
