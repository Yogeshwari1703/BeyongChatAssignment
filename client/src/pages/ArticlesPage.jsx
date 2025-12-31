import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/articles")
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
