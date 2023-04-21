import React from 'react'
import axios from 'axios'
import CardArticle from '@/components/CardArticleComponent'
import Head from 'next/head'
export type ArticleData = {
  _id: string;
  title: string;
  user_name: string;
  user_img: string;
  timestamp: string
}

const apiURL = "http://localhost:5000/api/articles";

const index = ({ articles }: { articles: ArticleData[] }) => {
  return (
    <>
      <Head>
        <title>Type-Rythms Web blog</title>
        <meta name="description" content="This is a description of my web page."></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <div>
      {articles && articles.length > 0 ? (
        articles
          .slice(0)
          .reverse()
          .map((article) => <CardArticle article={article} key={article._id} />)
      ) : (
        <div>No articles found.</div>
      )}
    </div>
    </>
    
  );
};

export const getServerSideProps = async (context: any) => {
  let articles = null;

  try {
    const response = await axios.get(apiURL);
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

export default index