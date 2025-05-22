// const mongoose = require("mongoose");

// const blogSchema = new mongoose.Schema({
//   id: Number,
//   title: String,
//   topic: String,
//   category: String,
//   content: String,
//   description: String,
//   publishDate: String, // or use Date if you prefer
//   author: String,
//   pic: String,
//   hashtag: {
//     type: [String],
//     default: []
//   }
//   });

// const Blog = mongoose.model("Blog", blogSchema);

// module.exports = Blog;


const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  topic: String,
  category: String,
  content: String,
  description: String,
  publishDate: { type: Date, default: Date.now },
  author:String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", 
    required:true
   },
  pic: String,
  hashtag: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Blog", blogSchema);

