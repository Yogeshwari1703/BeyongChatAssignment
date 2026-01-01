
# 🧠 AI Article Enhancement Platform

An end-to-end **content aggregation and AI rewriting platform** that:
- Scrapes original blog articles
- Finds external reference sources via Google Search
- Generates **original, SEO-friendly rewritten articles using Gemini AI**
- Preserves **original source attribution**
- Serves content via a REST API

Built with **Node.js, Express, MongoDB, Cheerio, and Google Gemini AI**.

---

## 🚀 Features

- 🔗 Scrapes original articles from **BeyondChats**
- 🌐 Fetches external reference articles using **Google Custom Search API**
- 🧠 Uses **Google Gemini AI** to generate original rewritten content
- 🧾 Stores:
  - Original source link
  - Original scraped content
  - AI-generated updated content
- 🔄 Toggle between **Updated Version** and **Original Source**
- 🛡️ SEO-safe (no plagiarism, no inline copied references)


---

## 🏗️ Tech Stack

| Layer        | Technology |
|--------------|------------|
| Backend      | Node.js, Express |
| Database     | MongoDB (Mongoose) |
| Scraping     | Axios, Cheerio |
| AI           | Google Gemini API |
| Search       | Google Custom Search API |
| Frontend     | React (Markdown rendering) |

---

## 📁 Backend Project Structure

```

src/
│
├── server.js               # Express app only
│
├── config/
│   └── db.js               # MongoDB connection
│
├── scripts/with gemini
│   ├── processArticles.js # update article content by processing top 2 searches in google with the help of gemini-2.5-flash llm model  
│   └── scrapeBeyondChats.js # scrap 5 oldest articles from beyond chat
│
├── routes/
│   └── article.routes.js   # API routes
│
├── controllers/  
│   └── articleController.js   
│
├── models/
│   └── Article.js          # Mongoose schema
│
└── utils/
└── ScrapeArticle.js

````

---

## 🔄 Application Flow

1. **Scrape Original Articles**
   - Fetches article titles & links from BeyondChats
   - Stores original content & source URL

2. **Find Reference Sources**
   - Uses Google Custom Search
   - Scrapes clean paragraph main content and url

3. **AI Content Generation**
   - Gemini rewrites content using ideas only
   - Ensures originality & SEO safety

4. **Serve via API**
   - `/api/articles`
   - Frontend toggles:
     - Updated AI content
     - Original source link

---

## 🧪 Environment Variables

Create a `.env` file in server/src folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
OR
MONGO_URI=mongodb://localhost:27017/db-name

GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id

GEMINI_API_KEY=your_gemini_api_key
````

---

## ▶️ How to Run
##  Backend

```bash
cd server
```

### Install dependencies

```bash
npm install
```

```bash
cd src
```

### Start 
#### scrape Articles from beyondChat
```bash
node script/scrapeBeyondChats.js
```
#### search article title on google and scrap main content of top 2 serches 
```bash
node utils/ScrapeArticle.js
```
#### update original content by sending main content of both top searches to gemini
```bash
node script/processArticles.js
```
#### run the backend server
```bash
nodemon server.js
```

---
##  frontend  (open new terminal in main project directory)

```bash
cd client
```

### Install dependencies

```bash
npm install
```

### Start 

```bash
npm start
```

---

## 📡 API Endpoints

### Get all articles

```http
GET /api/articles
```

**Response includes:**

* `title`
* `content` (AI rewritten)
* `link` (original source)
* `updatedAt`
* `references` (internal use only)

---

## 🛡️ SEO & Ethical Design

* ❌ No copied paragraphs
* ❌ No inline scraped references
* ✅ Only **ideas are used**
* ✅ Original source link clearly shown
* ✅ Updated date shown (not published date)

This avoids plagiarism and search engine penalties.

---

## 🧠 Why This Project Matters

This project demonstrates:

* Real-world web scraping
* AI content generation pipelines
* Clean backend architecture
* SEO-aware system design
* Production-style job orchestration



---

## 👩‍💻 Author

**Yogeshwari Sakharwade**
Artificial Intelligence & Data Science
Backend | AI | Web Development

---

## 📄 License

This project is for **educational and research purposes only**.

---


