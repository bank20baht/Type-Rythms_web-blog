import React from 'react';
import axios from 'axios';
import CardArticle from '@/components/CardArticleComponent';

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
