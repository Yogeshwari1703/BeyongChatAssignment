
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const connectDB = require("../config/db");
const Article = require("../models/Article");

const BASE_URL = "https://beyondchats.com";

async function scrapeBeyondChats() {
  try {
    const articles = [];
    await connectDB();

    console.log("🔍 Scraping BeyondChats for articles...");

    // Loop pages from newest to oldest until we get 5 oldest articles
    for (let page = 15; page >= 1 && articles.length < 5; page--) {
      const url =
        page === 1
          ? `${BASE_URL}/blogs/`
          : `${BASE_URL}/blogs/page/${page}/`;

      console.log("Scraping listing page:", url);

      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        },
      });

      const $ = cheerio.load(data);

      $("article").each((_, el) => {
        if (articles.length >= 5) return;

        const title = $(el).find("h2 a, h3 a").first().text().trim();
        const link = $(el).find("h2 a, h3 a").attr("href");

        if (title && link) {
          articles.push({
            title,
            link: link.startsWith("http") ? link : `${BASE_URL}${link}`,
            originalContent: "", // will populate below
            content: "",         // can remain empty or processed later
          });
        }
      });
    }

    // Now fetch original content for each article
    for (const article of articles) {
      console.log("Fetching article content:", article.link);
      try {
        const { data } = await axios.get(article.link, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
          },
        });

        const $ = cheerio.load(data);
        // Adjust selector based on the blog's HTML structure
        const content = $("article").text().trim() || $("div.post-content").text().trim();

        article.originalContent = content;
      } catch (err) {
        console.error("❌ Failed to fetch article content:", article.link, err.message);
      }
    }

    console.log(`✅ Found ${articles.length} articles. Saving to DB...`);

    for (const article of articles) {
      await Article.updateOne(
        { title: article.title },
        { ...article },
        { upsert: true }
      );
      console.log("Saved:", article.title);
    }

    console.log("✅ All articles saved to DB!");
    process.exit();
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
  }
}

scrapeBeyondChats();

