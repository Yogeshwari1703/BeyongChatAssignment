// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Calendar, Link2 } from "lucide-react";
// import { motion } from "framer-motion";
// import "./ArticleCard.css";

// export default function ArticleCard({ article }) {
//   return (
//     <motion.article
//       className="article-card"
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="article-title">{article.title}</h1>

//       <div className="article-meta">
//         <Calendar size={16} />
//         <span>
//           Updated on{" "}
//           {new Date(article.updatedAt).toLocaleDateString("en-IN", {
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           })}
//         </span>
//       </div>

//       <div className="article-content">
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {article.content}
//         </ReactMarkdown>
//       </div>

//       {article.references?.length > 0 && (
//         <div className="article-references">
//           <h3>
//             <Link2 size={18} /> References
//           </h3>
//           <ul>
//             {article.references.map((ref, i) => (
//               <li key={i}>
//                 <a href={ref.url} target="_blank" rel="noreferrer">
//                   {ref.url}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </motion.article>
//   );
// }


import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Link2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import "./ArticleCard.css";

export default function ArticleCard({ article }) {
  const [view, setView] = useState("updated"); // updated | original

  return (
    <motion.article
      className="article-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* TITLE */}
      <h1 className="article-title">{article.title}</h1>

      {/* META */}
      <div className="article-meta">
        <Calendar size={16} />
        <span>
          Updated on{" "}
          {new Date(article.updatedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* TOGGLE */}
      <div className="article-toggle">
        <button
          className={view === "updated" ? "active" : ""}
          onClick={() => setView("updated")}
        >
          Updated Version
        </button>
        <button
          className={view === "original" ? "active" : ""}
          onClick={() => setView("original")}
        >
          Original Source
        </button>
      </div>

      {/* CONTENT */}
      <div className="article-content">
        {view === "updated" ? (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content || "Updated version coming soon..."}
            </ReactMarkdown>

            {/* REFERENCES (ONLY FOR UPDATED VERSION) */}
            {article.references?.length > 0 && (
              <div className="article-references">
                <h3>
                  <Link2 size={18} /> Sources & References
                </h3>
                <ul>
                  {article.references.map((ref, i) => (
                    <li key={i}>
                      <a href={ref.url} target="_blank" rel="noreferrer">
                        {ref.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          /* ORIGINAL SOURCE VIEW */
          <div className="original-source-box">
            <p className="source-note">
              This article was originally published on <strong>BeyondChats</strong>.
            </p>

            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="original-link"
            >
              <ExternalLink size={16} />
              Read original article on BeyondChats
            </a>

            {article.author && (
              <p className="source-meta">
                ✍️ Author: <strong>{article.author}</strong>
              </p>
            )}

            {article.publishedAt && (
              <p className="source-meta">
                🗓️ Published on:{" "}
                {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
