import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CardArticle from '@/components/CardArticleComponent'

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
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;
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