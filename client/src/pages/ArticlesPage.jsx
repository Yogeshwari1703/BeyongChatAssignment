import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get("https://beyongchatassignment-3.onrender.com/api/articles")
      .then((res) => setArticles(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </>
  );
}
