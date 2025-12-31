// require("dotenv").config();
// const connectDB = require("../config/db");

// const { getArticles } = require("../services/articleService");
// const searchGoogle = require("../services/googleSearch");

// async function processArticles() {
//   try {
//     await connectDB();

//     const articles = await getArticles(5);

//     for (const article of articles) {
//       console.log("\n🔍 Searching for:", article.title);

//       const results = await searchGoogle(article.title);

//       console.log("Top 2 Google results:");
//       results.forEach((r, i) => {
//         console.log(`${i + 1}. ${r.title}`);
//         console.log(r.link);
//       });
//     }

//     process.exit();
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     process.exit(1);
//   }
// }

// processArticles();


// require('dotenv').config();
// const mongoose = require('mongoose');
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const axios = require('axios');

// // Replace with your actual Article model path
// const Article = require('../models/Article');

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ DB connection failed:', err));

// // Helper function to search Google Custom Search API
// async function searchGoogle(query) {
//   try {
//     const response = await axios.get(
//       `https://www.googleapis.com/customsearch/v1`,
//       {
//         params: {
//           key: process.env.GOOGLE_API_KEY,
//           cx: process.env.GOOGLE_CSE_ID,
//           q: query
//         }
//       }
//     );

//     return response.data.items.slice(0, 2).map(item => ({
//       title: item.title,
//       url: item.link
//     }));
//   } catch (error) {
//     console.error('❌ Google search failed:', error.message);
//     return [];
//   }
// }

// // Function to update article using Gemini
// async function updateArticleWithGemini(originalArticle, topArticles) {
//   const prompt = `
// Write a detailed, SEO-optimized article for the title:

// "${originalArticle.title}"

// Use professional tone and modern formatting.
// `;


//   const model = genAI.getGenerativeModel({
//     model: "gemini-3-flash-preview"
//   });

// //   const prompt = `
// // Rewrite and improve the article below.
// // Make it SEO-friendly, well structured, and similar in quality to top Google articles.

// // Top reference URLs:
// // 1. ${topArticles[0]?.url}
// // 2. ${topArticles[1]?.url}

// // ORIGINAL ARTICLE:
// // ${originalArticle.content}
// // `;

//   const result = await model.generateContent([
//     {
//       role: "user",
//       parts: [{ text: prompt }]
//     }
//   ]);

//   const updatedText =
//     result.response.candidates?.[0]?.content?.parts?.[0]?.text;

//   if (!updatedText) {
//     console.log("❌ Gemini returned empty response");
//     return null;
//   }

//   return updatedText;
// }



// // Main function to process all articles
// async function processArticles() {
//   try {
//     const articles = await Article.find({});

//     for (const article of articles) {
//       console.log(`\n🔍 Searching for: ${article.title}`);

//       // Step 1: Get top 2 Google results
//       const topResults = await searchGoogle(article.title);
//       if (topResults.length === 0) {
//         console.log('No Google results found. Skipping this article.');
//         continue;
//       }

//       console.log('Top 2 Google results:');
//       topResults.forEach((res, i) => console.log(`${i + 1}. ${res.title}\n${res.url}`));

//       // Step 2: Generate updated content with Gemini
//       const updatedContent = await updateArticleWithGemini(article, topResults);

//       // Step 3: Save updated content to DB
//       if (updatedContent) {
//   article.content = updatedContent;
//   await article.save();
//   console.log('✅ Article updated successfully.');
// } else {
//   console.log('⚠️ Article skipped due to empty AI response');
// }


//       console.log('✅ Article updated successfully.');
//     }

//     console.log('\n🎉 All articles processed!');
//     mongoose.connection.close();

//   } catch (err) {
//     console.error('❌ Error processing articles:', err);
//   }
// }

// // Run the script
// processArticles();









// require("dotenv").config();
// const mongoose = require("mongoose");
// const axios = require("axios");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Article model
// const Article = require("../models/Article");

// // Init Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // MongoDB connect
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => {
//     console.error("❌ DB connection failed:", err);
//     process.exit(1);
//   });

// /* ---------------------------------------
//    Google Search Helper
// ---------------------------------------- */
// async function searchGoogle(query) {
//   try {
//     const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
//       params: {
//         key: process.env.GOOGLE_API_KEY,
//         cx: process.env.GOOGLE_CSE_ID,
//         q: query,
//       },
//     });

//     if (!res.data.items) return [];

//     return res.data.items.slice(0, 2).map((item) => ({
//       title: item.title,
//       url: item.link,
//     }));
//   } catch (err) {
//     console.error("❌ Google search failed:", err.message);
//     return [];
//   }
// }

// /* ---------------------------------------
//    Gemini Article Rewriter
// ---------------------------------------- */
// async function updateArticleWithGemini(article, topArticles) {
//   if (!article.content || article.content.trim().length < 50) {
//     console.log("❌ Article has no usable content, skipping");
//     return null;
//   }

//   const prompt = `
// Rewrite and improve the following article.

// Title:
// "${article.title}"

// Requirements:
// - SEO optimized
// - Professional tone
// - Clear headings
// - Better structure
// - Similar quality to top Google articles

// Reference URLs:
// 1. ${topArticles[0]?.url}
// 2. ${topArticles[1]?.url}

// ORIGINAL ARTICLE:
// ${article.content}
// `;

//   const model = genAI.getGenerativeModel({
//     model: "gemini-3-flash-preview",
//   });

//   const result = await model.generateContent([
//     {
//       role: "user",
//       parts: [{ text: prompt }],
//     },
//   ]);

//   const updatedText =
//     result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

//   if (!updatedText) {
//     console.log("❌ Gemini returned empty response");
//     return null;
//   }

//   return updatedText.trim();
// }

// /* ---------------------------------------
//    Main Processor
// ---------------------------------------- */
// async function processArticles() {
//   try {
//     const articles = await Article.find({});

//     if (!articles.length) {
//       console.log("⚠️ No articles found");
//       return;
//     }

//     for (const article of articles) {
//       console.log(`\n🔍 Processing: ${article.title}`);

//       // Google Search
//       const topResults = await searchGoogle(article.title);
//       if (!topResults.length) {
//         console.log("⚠️ No Google results found, skipping");
//         continue;
//       }

//       topResults.forEach((r, i) =>
//         console.log(`${i + 1}. ${r.title}\n${r.url}`)
//       );

//       // Gemini Rewrite
//       const updatedContent = await updateArticleWithGemini(
//         article,
//         topResults
//       );

//       if (!updatedContent) {
//         console.log("⚠️ Skipped due to empty AI response");
//         continue;
//       }

//       // Save original once
//       if (!article.originalContent) {
//         article.originalContent = article.content;
//       }

//       article.content = updatedContent;
//       await article.save();

//       console.log("✅ Article updated successfully");
//     }

//     console.log("\n🎉 All articles processed!");
//   } catch (err) {
//     console.error("❌ Error processing articles:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// // Run
// processArticles();



// require("dotenv").config();
// const mongoose = require("mongoose");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const Article = require("../models/Article");

// // ------------------ CONNECT DB ------------------
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ Mongo error:", err));

// // ------------------ GEMINI INIT ------------------
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // ------------------ GOOGLE SEARCH ------------------
// async function searchGoogle(query) {
//   try {
//     const res = await axios.get(
//       "https://www.googleapis.com/customsearch/v1",
//       {
//         params: {
//           key: process.env.GOOGLE_API_KEY,
//           cx: process.env.GOOGLE_CSE_ID,
//           q: query,
//         },
//       }
//     );

//     return (res.data.items || []).slice(0, 2).map((item) => ({
//       title: item.title,
//       url: item.link,
//     }));
//   } catch (err) {
//     console.log("❌ Google search failed");
//     return [];
//   }
// }

// // ------------------ SCRAPER ------------------
// async function scrapeArticleContent(url) {
//   try {
//     const res = await axios.get(url, {
//       timeout: 15000,
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
//       },
//     });

//     const $ = cheerio.load(res.data);
//     let text = "";

//     $("p").each((_, el) => {
//       const para = $(el).text().trim();
//       if (para.length > 50) {
//         text += para + "\n";
//       }
//     });

//     return text.substring(0, 8000);
//   } catch (err) {
//     console.log("❌ Scraping failed:", url);
//     return "";
//   }
// }

// // ------------------ GEMINI PROCESS ------------------
// async function generateWithGemini(article, ref1, ref2, links) {
//   if (!article.originalContent) {
//     console.log("❌ Article has no usable content, skipping");
//     return null;
//   }

//   const prompt = `
// You are a professional SEO content writer.

// ORIGINAL ARTICLE:
// ${article.originalContent}

// REFERENCE ARTICLE 1:
// ${ref1}

// REFERENCE ARTICLE 2:
// ${ref2}

// TASK:
// - Rewrite the original article
// - Match structure and depth of reference articles
// - Improve headings, formatting, clarity
// - Professional blog tone
// - Add references at bottom

// REFERENCES:
// - ${links[0]}
// - ${links[1]}

// Return ONLY the final article content.
// `;

//   const result = await model.generateContent(prompt);
//   return result.response.text();
// }

// // ------------------ MAIN PROCESS ------------------
// async function processArticles() {
//   try {
//     const articles = await Article.find({});

//     for (const article of articles) {
//       console.log(`\n🔍 Processing: ${article.title}`);

//       const results = await searchGoogle(article.title);
//       if (results.length < 2) {
//         console.log("❌ Not enough Google results");
//         continue;
//       }

//       results.forEach((r, i) =>
//         console.log(`${i + 1}. ${r.title}\n${r.url}`)
//       );

//       const ref1 = await scrapeArticleContent(results[0].url);
//       const ref2 = await scrapeArticleContent(results[1].url);

//       if (ref1.length < 300 && ref2.length < 300) {
//         console.log("❌ Reference content too weak, skipping");
//         continue;
//       }

//       const updatedContent = await generateWithGemini(
//         article,
//         ref1,
//         ref2,
//         [results[0].url, results[1].url]
//       );

//       if (!updatedContent) {
//         console.log("⚠️ Skipped due to empty AI response");
//         continue;
//       }

//       article.content = updatedContent;
//       await article.save();

//       console.log("✅ Article updated");
//     }

//     console.log("\n🎉 All articles processed!");
//     mongoose.connection.close();
//   } catch (err) {
//     console.error("❌ Error processing articles:", err);
//   }
// }

// // ------------------ RUN ------------------
// processArticles();


require("dotenv").config();
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Article = require("../models/Article");

// ------------------ CONNECT DB ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ Mongo error:", err.message);
    process.exit(1);
  });

// ------------------ GEMINI INIT ------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ------------------ GEMINI PROCESS ------------------
async function generateWithGemini(article, references) {
  const validReferences = references.filter(
    ref =>
      ref.scrapedContent &&
      typeof ref.scrapedContent === "string" &&
      ref.scrapedContent.trim().length > 100
  );

  if (validReferences.length === 0) {
    console.log("⚠️ No usable reference content:", article.title);
    return null;
  }

  const refTexts = validReferences
    .map((ref, i) => `REFERENCE ${i + 1}:\n${ref.scrapedContent}`)
    .join("\n\n");

  const prompt = `
You are a professional SEO blog writer.

ORIGINAL ARTICLE TITLE:
${article.title}

REFERENCE MATERIAL:
${refTexts}

TASK:
- Rewrite the article using the reference material
- Professional SEO blog tone
- Use headings and bullet points
- Ensure originality
`;

  while (true) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if (err.message.includes("429")) {
        console.log("⏳ Rate limit hit. Waiting 60 seconds...");
        await sleep(60000); // wait 1 minute
      } else {
        console.error("❌ Gemini error:", err.message);
        return null;
      }
    }
  }
}


// ------------------ MAIN PROCESS ------------------
async function processArticles() {
  try {
    const articles = await Article.find({
      references: { $exists: true, $ne: [] },
    });

    if (articles.length === 0) {
      console.log("⚠️ No articles found to process");
      return;
    }

    for (const article of articles) {
      console.log(`\n🔍 Processing: ${article.title}`);

      const references = article.references || [];

      const updatedContent = await generateWithGemini(
        article,
        references
      );

      if (!updatedContent) {
        console.log("⏭️ Skipped article");
        continue;
      }

      article.content = updatedContent;
      await article.save();

      console.log("✅ Article updated in DB");
    }

    console.log("\n🎉 All articles processed successfully!");
  } catch (err) {
    console.error("❌ Error processing articles:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

// ------------------ RUN ------------------
processArticles();













// require("dotenv").config();
// const mongoose = require("mongoose");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Article = require("../models/Article");

// // ------------------ CONNECT DB ------------------
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ Mongo error:", err));

// // ------------------ GEMINI INIT ------------------
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // ------------------ GEMINI PROCESS ------------------
// async function generateWithGemini(article, references) {
//   if (!references || references.length === 0) {
//     console.log("❌ No references available, skipping article:", article.title);
//     return null;
//   }

//   // Join all reference contents
//   const refTexts = references.map((ref, i) => `REFERENCE ARTICLE ${i + 1}:\n${ref.scrapedContent}`).join("\n\n");
//   const refLinks = references.map((ref) => ref.url);

//   const prompt = `
// You are a professional SEO content writer.

// ORIGINAL ARTICLE TITLE:
// ${article.title}

// TASK:
// - Rewrite the article using the references below
// - Match structure, depth, formatting, and headings of references
// - Professional blog tone
// - Include references at the bottom

// ${refTexts}

// REFERENCES:
// ${refLinks.join("\n")}

// Return ONLY the final article content.
// `;

//   try {
//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (err) {
//     console.log("❌ Gemini generation failed for article:", article.title);
//     return null;
//   }
// }

// // ------------------ MAIN PROCESS ------------------
// async function processArticles() {
//   try {
//     const articles = await Article.find({});

//     for (const article of articles) {
//       console.log(`\n🔍 Processing: ${article.title}`);

//       const references = article.references || [];

//       // If no references found, skip
//       if (references.length === 0) {
//         console.log("⚠️ No reference content found, skipping");
//         continue;
//       }

//       const updatedContent = await generateWithGemini(article, references);

//       if (!updatedContent) {
//         console.log("⚠️ Skipped due to empty AI response");
//         continue;
//       }

//       article.content = updatedContent;
//       await article.save();

//       console.log("✅ Article updated in DB");
//     }

//     console.log("\n🎉 All articles processed!");
//     mongoose.connection.close();
//   } catch (err) {
//     console.error("❌ Error processing articles:", err);
//   }
// }

// // ------------------ RUN ------------------
// processArticles();