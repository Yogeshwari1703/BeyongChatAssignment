// const axios = require("axios");
// const cheerio = require("cheerio");
// require("dotenv").config();
// const connectDB = require("../config/db");
// const Article = require("../models/Article");


// const BASE_URL = "https://beyondchats.com";

// async function scrapeBeyondChats() {
//   try {
//     const articles = [];
//     await connectDB();

//     // We KNOW total pages = 15
//     for (let page = 15; page >= 1 && articles.length < 5; page--) {
//       const url =
//         page === 1
//           ? `${BASE_URL}/blogs/`
//           : `${BASE_URL}/blogs/page/${page}/`;

//       console.log("Scraping:", url);

//       const { data } = await axios.get(url, {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
//         },
//       });

//       const $ = cheerio.load(data);

//       $("article").each((_, el) => {
//         if (articles.length >= 5) return;

//         const title = $(el).find("h2, h3").first().text().trim();
//         const link = $(el).find("a").attr("href");

//         const dateText =
//           $(el).find("time").attr("datetime") ||
//           $(el).find("time").text().trim();

//         let author =
//           $(el).find(".author").text().trim() ||
//           $(el).find("[rel='author']").text().trim() ||
//           "Unknown";

//         if (title && link && dateText) {
//           articles.push({
//             title,
//             link: link.startsWith("http")
//               ? link
//               : `${BASE_URL}${link}`,
//             publishedAt: new Date(dateText),
//             author,
//           });
//         }
//       });
//     }

//     // Safety sort (oldest → newest)
//     articles.sort((a, b) => a.publishedAt - b.publishedAt);

//     console.log("✅ 5 OLDEST ARTICLES:");
//     for (const article of articles) {
//   await Article.updateOne(
//     { link: article.link },
//     article,
//     { upsert: true }
//   );
// }

// console.log("✅ Articles saved to DB");
// process.exit();

//   } catch (err) {
//     console.error("Scraping failed:", err.message);
//   }
// }

// scrapeBeyondChats();


// const axios = require("axios");
// const cheerio = require("cheerio");
// require("dotenv").config();
// const connectDB = require("../config/db");
// const Article = require("../models/Article");

// const BASE_URL = "https://beyondchats.com";

// async function scrapeBeyondChats() {
//   try {
//     const articles = [];
//     await connectDB();

//     console.log("🔍 Scraping BeyondChats for article titles...");

//     // Loop pages from newest to oldest until we get 5 oldest articles
//     for (let page = 15; page >= 1 && articles.length < 5; page--) {
//       const url =
//         page === 1
//           ? `${BASE_URL}/blogs/`
//           : `${BASE_URL}/blogs/page/${page}/`;

//       console.log("Scraping listing page:", url);

//       const { data } = await axios.get(url, {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
//         },
//       });

//       const $ = cheerio.load(data);

//       $("article").each((_, el) => {
//         if (articles.length >= 5) return;

//         const title = $(el).find("h2 a, h3 a").first().text().trim();
//         const link = $(el).find("h2 a, h3 a").attr("href");

//         if (title) {
//           articles.push({
//             title,
//             link: link.startsWith("http") ? link : `${BASE_URL}${link}`,
//             originalContent: "", // empty for now
//             content: "",         // empty for now
//           });
//         }
//       });
//     }

//     // Safety sort (oldest → newest)
//     articles.sort((a, b) => 0); // optional if you want exact order

//     console.log(`✅ Found ${articles.length} articles. Saving to DB...`);

//     for (const article of articles) {
//       await Article.updateOne(
//         { title: article.title },
//         { ...article },
//         { upsert: true }
//       );
//       console.log("Saved:", article.title);
//     }

//     console.log("✅ All articles saved to DB!");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Scraping failed:", err.message);
//   }
// }

// scrapeBeyondChats();



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









// const axios = require("axios");
// const cheerio = require("cheerio");
// require("dotenv").config();

// const connectDB = require("../config/db");
// const Article = require("../models/Article");

// const BASE_URL = "https://beyondchats.com";

// async function scrapeBeyondChats() {
//   try {
//     await connectDB();
//     console.log("✅ DB Connected");

//     const articles = [];

//     console.log("🔍 Scraping article list...");

//     // STEP 1: Collect correct article links
//     for (let page = 15; page >= 1 && articles.length < 5; page--) {
//       const url =
//         page === 1
//           ? `${BASE_URL}/blogs/`
//           : `${BASE_URL}/blogs/page/${page}/`;

//       const { data } = await axios.get(url);
//       const $ = cheerio.load(data);

//       $("article").each((_, el) => {
//         if (articles.length >= 5) return;

//         const anchor = $(el).find("h2 a, h3 a").first();
//         const title = anchor.text().trim();
//         const link = anchor.attr("href");

//         if (!title || !link) return;

//         articles.push({
//           title,
//           link: link.startsWith("http") ? link : `${BASE_URL}${link}`,
//         });
//       });
//     }

//     console.log(`✅ Found ${articles.length} articles`);

//     // STEP 2: Visit each article & scrape REAL content
//     for (const article of articles) {
//       console.log("\n📄 Scraping:", article.title);
//       console.log("🔗 URL:", article.link);

//       const { data } = await axios.get(article.link);
//       const $ = cheerio.load(data);

//       /**
//        * REAL CONTENT LOGIC:
//        * - Inside <article>
//        * - Elementor container with multiple paragraphs
//        * - Filters out headers / footers / CTA
//        */
//       const container = $("article .elementor-widget-container")
//         .filter((_, el) => $(el).find("p").length >= 3)
//         .first();

//       if (!container.length) {
//         console.log("❌ No valid content found, skipping");
//         continue;
//       }

//       // Clean junk
//       container.find("script, style, iframe").remove();

//       const originalHTML = container.html();

//       // DEBUG CHECK (optional)
//       console.log("✅ Content length:", originalHTML.length);

//       // STEP 3: SAVE TO DB
//       await Article.updateOne(
//         { link: article.link }, // unique identifier
//         {
//           title: article.title,
//           link: article.link,
//           originalContent: originalHTML, // 🔥 REAL ORIGINAL CONTENT
//         },
//         { upsert: true }
//       );

//       console.log("💾 Saved to DB");
//     }

//     console.log("\n🎉 DONE: All articles scraped & saved");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Scraping failed:", err.message);
//     process.exit(1);
//   }
// }

// scrapeBeyondChats();


// const axios = require("axios");
// const cheerio = require("cheerio");
// require("dotenv").config();

// const connectDB = require("../config/db");
// const Article = require("../models/Article");

// const BASE_URL = "https://beyondchats.com";

// async function scrapeBeyondChats() {
//   try {
//     await connectDB();
//     console.log("✅ DB Connected");

//     const articles = [];
//     console.log("🔍 Scraping article list only (NO content)...");

//     // Collect 5 OLDEST articles
//     for (let page = 15; page >= 1 && articles.length < 5; page--) {
//       const url =
//         page === 1
//           ? `${BASE_URL}/blogs/`
//           : `${BASE_URL}/blogs/page/${page}/`;

//       const { data } = await axios.get(url, {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
//         },
//       });

//       const $ = cheerio.load(data);

//       $("article").each((_, el) => {
//         if (articles.length >= 5) return;

//         const anchor = $(el).find("h2 a, h3 a").first();
//         const title = anchor.text().trim();
//         const link = anchor.attr("href");

//         if (!title || !link) return;

//         articles.push({
//           title,
//           link: link.startsWith("http") ? link : `${BASE_URL}${link}`,
//         });
//       });
//     }

//     console.log(`✅ Found ${articles.length} articles`);

//     // Save minimal article records
//     for (const article of articles) {
//       console.log("💾 Saving:", article.title);

//       await Article.updateOne(
//         { link: article.link },
//         {
//           title: article.title,
//           link: article.link,
//           source: "BeyondChats",
//           originalContent: "", // intentionally empty
//         },
//         { upsert: true }
//       );
//     }

//     console.log("\n🎉 DONE: Articles saved without scraping content");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Scraping failed:", err.message);
//     process.exit(1);
//   }
// }

// scrapeBeyondChats();
