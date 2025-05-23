const Blog = require("../model/blogModel"); // Note: use Blog (capitalized) to match model naming
const fs = require("fs")
const mongoose = require("mongoose");
// Correct async function syntax
async function create(req, res) {
  try {
    const blogData = req.body;
    // const pic = req.file.filename

    // Add the logged-in user's ID
    const newBlog = await Blog.create({
      ...blogData,
      createdBy: req.user.userId,
      pic: req.file ? `/uploads/${req.file.filename}` : null,

    });
    console.log("User from token:", req.user);

    console.log(newBlog);
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog', details: err.message });
  }
}

async function getData(req, res) {
  try {
    const allBlogs = await Blog.find();
    res.status(200).json(allBlogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs', details: err.message });
  }
}

async function SingleBlogByMongoId(req, res) {
  try {
    const mongoId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(mongoId)) {
      return res.status(400).json({ error: "Invalid MongoDB ID" });
    }

    const blog = await Blog.findById(mongoId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog', details: err.message });
  }
}



// const myBlogs = async (req, res) => {
//   try {
//     const userId = req.user.userId; // or req.user.id

//     const blogs = await Blog.find({ createdBy: userId }).sort({ createdAt: -1 }).populate({ path: "createdBy", select: "username email" });

//     res.status(200).json(blogs);
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };

const myBlogs = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // Safe fallback

    const blogs = await Blog.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "createdBy",
        select: "username email"
      });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ success: false, message: 'Something went wrong while fetching your blogs.' });
  }
};

// async function updateBlog(req, res) {
//   try {
//     const blogId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(blogId)) {
//       return res.status(400).json({ error: "Invalid MongoDB ID" });
//     }

//     const updatedBlog = await Blog.findOneAndUpdate(
//       { _id: blogId, createdBy: req.user.userId }, // Only allow the creator to update
//       req.body,
//       { new: true }
//     );

//     if (!updatedBlog) {
//       return res.status(404).json({ error: "Blog not found or unauthorized" });
//     }

//     res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update blog", details: err.message });
//   }
// }
// async function updateBlog(req, res) {
//   try {
//     const blogId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(blogId)) {
//       return res.status(400).json({ error: "Invalid MongoDB ID" });
//     }

//     // Find the existing blog first to get the current image path
//     const existingBlog = await Blog.findOne({ _id: blogId, createdBy: req.user.userId });
    
//     if (!existingBlog) {
//       return res.status(404).json({ error: "Blog not found or unauthorized" });
//     }

//     // Extract updatable fields
//     const { title, topic, category, description, content, hashtag } = req.body;
    
//     const updateData = {
//       title,
//       topic,
//       category,
//       description,
//       content,
//       hashtag: hashtag ? JSON.parse(hashtag) : undefined,
//       updatedAt: new Date()
//     };

//     // Handle image update
//     if (req.file) {
//       // Set new image path
//       updateData.pic = `/uploads/blogs/${req.file.filename}`;
      
//       // Delete old image if it exists
//       if (existingBlog.pic) {
//         const oldImagePath = path.join(__dirname, '..', 'public', existingBlog.pic);
//         fs.unlink(oldImagePath, (err) => {
//           if (err) console.error('Error deleting old image:', err);
//         });
//       }
//     }

//     const updatedBlog = await Blog.findOneAndUpdate(
//       { _id: blogId, createdBy: req.user.userId },
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({ 
//       message: "Blog updated successfully", 
//       blog: updatedBlog 
//     });

//   } catch (err) {
//     console.error("Update blog error:", err);
    
//     // Delete the newly uploaded file if error occurred after upload
//     if (req.file) {
//       const newImagePath = path.join(__dirname, '..', 'public', 'uploads', 'blogs', req.file.filename);
//       fs.unlink(newImagePath, (err) => {
//         if (err) console.error('Error cleaning up new image:', err);
//       });
//     }

//     res.status(500).json({ 
//       error: "Failed to update blog",
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// }

// const updateBlog = async (req, res) => {
//   try {
//     const blogId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(blogId)) {
//       return res.status(400).json({ error: "Invalid blog ID format" });
//     }

//     console.log("🔍 Blog ID:", blogId);
//     console.log("🔍 Request User ID:", req.user?.userId);
//     console.log("🔍 Body:", req.body);
//     console.log("🔍 Uploaded File:", req.file);

//     // Find the blog and confirm user is the author
//     const existingBlog = await Blog.findOne({ _id: blogId, createdBy: req.user.userId });

//     if (!existingBlog) {
//       return res.status(404).json({ error: "Blog not found or unauthorized access" });
//     }

//     // Extract updatable fields
//     const { title, topic, category, description, content, hashtag } = req.body;

//     const updateData = {
//       title,
//       topic,
//       category,
//       description,
//       content,
//       updatedAt: new Date()
//     };

//     if (hashtag) {
//       try {
//         updateData.hashtag = JSON.parse(hashtag);
//       } catch (err) {
//         return res.status(400).json({ error: "Invalid hashtag format. Must be JSON stringified array." });
//       }
//     }

//     // Handle image update
//     if (req.file) {
//       updateData.pic = `/uploads/blogs/${req.file.filename}`;

//       // Delete old image
//       if (existingBlog.pic) {
//         const oldImagePath = path.join(__dirname, '..', 'public', existingBlog.pic);
//         fs.unlink(oldImagePath, (err) => {
//           if (err) console.error("Error deleting old image:", err);
//         });
//       }
//     }

//     // Update blog
//     const updatedBlog = await Blog.findOneAndUpdate(
//       { _id: blogId, createdBy: req.user.userId },
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       message: "✅ Blog updated successfully",
//       blog: updatedBlog
//     });

//   } catch (err) {
//     console.error("🔥 Update Blog Error:", err);

//     // Cleanup newly uploaded image on error
//     if (req.file) {
//       const newImagePath = path.join(__dirname, '..', 'public', 'uploads', 'blogs', req.file.filename);
//       fs.unlink(newImagePath, (err) => {
//         if (err) console.error("Error cleaning up uploaded image:", err);
//       });
//     }

//     res.status(500).json({
//       error: "❌ Failed to update blog",
//       details: err.message,
//       stack: err.stack // Remove this in production
//     });
//   }
// };

async function updateBlog(req, res) {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: "Invalid MongoDB ID" });
    }

    // Find the existing blog first to get the current image path
    const existingBlog = await Blog.findOne({ _id: blogId, createdBy: req.user.userId });
    
    if (!existingBlog) {
      return res.status(404).json({ error: "Blog not found or unauthorized" });
    }

    // Extract updatable fields
    const { title, topic, category, description, content, hashtag } = req.body;

    let hashtagsArray;

    // Handle hashtag - if it's a string, parse it, else accept as is
    if (typeof hashtag === 'string') {
      try {
        hashtagsArray = JSON.parse(hashtag);
        if (!Array.isArray(hashtagsArray)) {
          return res.status(400).json({ error: "Invalid hashtag format. Must be an array." });
        }
      } catch {
        return res.status(400).json({ error: "Invalid hashtag format. Must be JSON stringified array." });
      }
    } else if (Array.isArray(hashtag)) {
      hashtagsArray = hashtag;
    } else if (hashtag === undefined) {
      hashtagsArray = undefined; // no update on hashtags
    } else {
      return res.status(400).json({ error: "Hashtag must be an array or JSON stringified array." });
    }

    const updateData = {
      title,
      topic,
      category,
      description,
      content,
      updatedAt: new Date()
    };

    if (hashtagsArray !== undefined) {
      updateData.hashtag = hashtagsArray;
    }

    // Handle image update
    if (req.file) {
      // Set new image path
      updateData.pic = `/uploads/blogs/${req.file.filename}`;
      
      // Delete old image if it exists
      if (existingBlog.pic) {
        const oldImagePath = path.join(__dirname, '..', 'public', existingBlog.pic);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId, createdBy: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: "Blog updated successfully", 
      blog: updatedBlog 
    });

  } catch (err) {
    console.error("Update blog error:", err);
    
    // Delete the newly uploaded file if error occurred after upload
    if (req.file) {
      const newImagePath = path.join(__dirname, '..', 'public', 'uploads', 'blogs', req.file.filename);
      fs.unlink(newImagePath, (err) => {
        if (err) console.error('Error cleaning up new image:', err);
      });
    }

    res.status(500).json({ 
      error: "Failed to update blog",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}


async function deleteBlog(req, res) {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: "Invalid MongoDB ID" });
    }

    const deletedBlog = await Blog.findOneAndDelete({
      _id: blogId,
      createdBy: req.user.userId, // Only allow the creator to delete
    });

    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found or unauthorized" });
    }

    res.status(200).json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog", details: err.message });
  }
}



module.exports = {create,getData,SingleBlogByMongoId,myBlogs,deleteBlog,updateBlog};
