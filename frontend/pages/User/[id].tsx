import React from "react";
import axios from "axios";
import CardArticle from "@/components/CardArticleComponent";
import Head from "next/head";
import { useRouter } from "next/router";

type ArticleData = {
  _id: string;
  title: string;
  timestamp: string;
  user_email: string;
  user_name: string;
  user_img: string;
};

const apiURL = "http://localhost:5000/api/user/";

const MyStory = ({ articles }: { articles: ArticleData[] }) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>{id}</title>
        <meta
          name="description"
          content="This is a description of my web page."
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <div>
        <div className="max-w-[120rem] w-full mx-auto sm:items-center m-3 flex flex-col justify-center">
          <img
            className="rounded-full w-20 h-20 m-1"
            src={articles[0].user_img}
            alt="u_img"
          />
          <div className="">{articles[0].user_name}</div>
          <div>{articles[0].user_email}</div>
        </div>
        {articles && articles.length > 0 ? (
          articles
            .slice(0)
            .reverse()
            .map((article) => (
              <CardArticle article={article} key={article._id} />
            ))
        ) : (
          <div>No articles found.</div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;
  let articles = null;

  try {
    const response = await axios.get(apiURL + id);
    articles = response.data;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      articles,
    },
  };
};

export default MyStory;
