import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export type ArticleData = {
  _id: string;
  title: string;
  content: string;
  user_email: string;
  timestamp: string;
  user_name: string;
  user_img: string;
};

const apiURL = "http://localhost:5000/api/article/";

const Article = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<ArticleData | null>();
  useEffect(() => {
    const getArticleById = async () => {
      try {
        const response = await axios.get(apiURL + id);
        setArticle(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      getArticleById();
    }
  }, [id]);

  const deleteArticle = async () => {
    await axios.delete(apiURL + id);
    setArticle(null);
    router.push("/");
  };

  return (
    <div className="contaniner">
      <div className="sm:items-center m-3 flex flex-col justify-center bg-white border shadow-md rounded-xl p-4 md:p-5">
        <h1>{article?.title}</h1>
      </div>
      <div className="sm:items-center m-3 flex flex-col justify-center bg-white border shadow-md rounded-xl p-4 md:p-5">
        <p>{article?.content}</p>
      </div>
      <div className="flex flex-row justify-end p-2 m-2">
        <img
          className="avatar-img"
          src={article?.user_img}
          alt="u_img"
        />
        <h2 className="m-1">{article?.user_name}</h2>
      </div>
    </div>
  );
};

export default Article;
