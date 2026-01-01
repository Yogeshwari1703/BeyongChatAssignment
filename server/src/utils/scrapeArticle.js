// utils/scrapeReferences.js
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Article = require("../models/Article");

// ------------------ CONNECT DB ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------ GOOGLE SEARCH ------------------
async function searchGoogle(title) {
  try {
    const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID,
        q: title,
      },
    });

    const items = res.data.items || [];
    return items
      .filter((item) => item.link && !item.link.includes("beyondchats.com"))
      .slice(0, 2)
      .map((item) => ({ title: item.title, url: item.link }));
  } catch (err) {
    console.error("❌ Google search failed for:", title);
    return [];
  }
}

// ------------------ SCRAPER ------------------
async function scrapeContent(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
      },
    });

    const $ = cheerio.load(data);

    // Remove unwanted tags
    $("script, style, nav, footer, header, ads, iframe").remove();

    let text = "";
    $("p").each((_, el) => {
      const paragraph = $(el).text().trim();
      if (paragraph.length > 40) text += paragraph + "\n";
    });

    return text.trim().substring(0, 8000); // limit to 8000 chars
  } catch (err) {
    console.error(`❌ Failed to scrape ${url}`);
    return "";
  }
}

// ------------------ MAIN PROCESS ------------------
async function processReferences() {
  try {
    const articles = await Article.find({});

    for (const article of articles) {
      console.log(`\n🔍 Processing: ${article.title}`);

      const googleResults = await searchGoogle(article.title);
      if (googleResults.length < 2) {
        console.log("❌ Not enough Google results, skipping...");
        continue;
      }

      const references = [];

      for (const result of googleResults) {
        const content = await scrapeContent(result.url);
        if (!content) {
          // console.log(`❌ Skipped empty content from ${result.url}`);
          continue;
        }

        references.push({
          url: result.url,
          scrapedContent: content,
        });
      }

      if (references.length === 0) {
        console.log("⚠️ No valid reference content found, skipping...");
        continue;
      }

      article.references = references;
      await article.save();
      console.log("✅ References updated in DB");
    }

    console.log("\n🎉 All articles processed!");
    mongoose.connection.close();
  } catch (err) {
    // console.error("❌ Error processing articles:", err);
    mongoose.connection.close();
  }
}

// ------------------ RUN ------------------
processReferences();

