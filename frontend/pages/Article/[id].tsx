import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

type ArticleData = {
  _id: string;
  title: string;
  content: string;
  user_email: string;
  timestamp: string;
  user_name: string;
  user_img: string;
};

const apiURL = "http://localhost:5000/api/article/";

const Article = ({ article }: { article: ArticleData }) => {
  const router = useRouter();

  const deleteArticle = async () => {
    await axios.delete(apiURL + article._id);
    router.push("/");
  };

  return (
    <div className="contaniner">
      <div className="sm:items-center m-3 flex flex-col justify-center bg-white border shadow-md rounded-xl p-4 md:p-5">
        <h1>{article.title}</h1>
      </div>
      <div className="sm:items-center m-3 flex flex-col justify-center bg-white border shadow-md rounded-xl p-4 md:p-5" style={{
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word"
      }}>
        {article.content}
      </div>
      <div className="flex flex-row justify-end p-2 m-2">
        <img className="avatar-img" src={article.user_img} alt="u_img" />
        <h2 className="m-1">{article.user_name}</h2>
      </div>
      <div className="flex flex-row justify-end">
        <div className="buttom-primary w-auto" onClick={deleteArticle}>
          DEL
        </div>
        <div
          className="buttom-secondary w-auto"
          onClick={() => {
            router.push("/Edit/" + article._id);
          }}
        >
          EDIT
        </div>
      </div>
    </div>
  );
};

export default Article;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  try {
    const response = await axios.get(apiURL + id);
    const article = response.data;

    return {
      props: { article },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
    };
  }
}
