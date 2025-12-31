// const mongoose = require("mongoose");

// const articleSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     content: { type: String },
//     author: { type: String },
//     link: { type: String, unique: true },
//     publishedAt: { type: Date },
//     source: { type: String, default: "BeyondChats" },
//   },
//   { timestamps: true } // createdAt & updatedAt
// );

// module.exports = mongoose.model("Article", articleSchema);

const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: String,
    link: { type: String, unique: true },   // unique identifier
    originalContent: String,
    content: String,
    references: [
      { url: String, scrapedContent: String }
    ]
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Article", articleSchema);
