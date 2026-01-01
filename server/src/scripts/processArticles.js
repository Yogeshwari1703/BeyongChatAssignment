
require("dotenv").config();
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Article = require("../models/Article");

// ------------------ CONNECT DB ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// ------------------ GEMINI INIT ------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ------------------ GEMINI PROCESS ------------------
async function generateWithGemini(article, references) {
  if (!references || references.length === 0) {
    console.log("❌ No references available, skipping article:", article.title);
    return null;
  }

  // Join all reference contents
  const refTexts = references.map((ref, i) => `REFERENCE ARTICLE ${i + 1}:\n${ref.scrapedContent}`).join("\n\n");
  const refLinks = references.map((ref) => ref.url);

  const prompt = `
You are a professional SEO content writer.

ORIGINAL ARTICLE TITLE:
${article.title}

TASK:
- Rewrite the article using the references below
- Match structure, depth, formatting, and headings of references
- Professional blog tone

Return ONLY the final article content.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.log("❌ Gemini generation failed for article:", article.title);
    return null;
  }
}

// ------------------ MAIN PROCESS ------------------
async function processArticles() {
  try {
    const articles = await Article.find({});

    for (const article of articles) {
      console.log(`\n🔍 Processing: ${article.title}`);

      const references = article.references || [];

      // If no references found, skip
      if (references.length === 0) {
        console.log("⚠️ No reference content found, skipping");
        continue;
      }

      const updatedContent = await generateWithGemini(article, references);

      if (!updatedContent) {
        console.log("⚠️ Skipped due to empty AI response");
        continue;
      }

      article.content = updatedContent;
      await article.save();

      console.log("✅ Article updated in DB");
    }

    console.log("\n🎉 All articles processed!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error processing articles:", err);
  }
}

// ------------------ RUN ------------------
processArticles();


