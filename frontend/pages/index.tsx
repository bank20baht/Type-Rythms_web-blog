/*import React from 'react'
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
*/

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Data {
  id: number;
  name: string;
}

export default function Home(): JSX.Element {
  const [data, setData] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    const response = await axios.get(`http://localhost:5000/api/data?page=${currentPage}&limit=5`);
    setData(response.data.results);
    console.log(response)
    setTotalPages(Math.ceil(response.data.count / 5));
    console.log(totalPages)
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <h1>My Paginated Data</h1>
      {data.map((item: Data) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>ID: {item.id}</p>
        </div>
      ))}
        <p>Page {currentPage} of {totalPages}</p>
      <div>
        {currentPage > 1 && (
          <button className="buttom-primary" onClick={goToPreviousPage}>Previous</button>
        )}
        {currentPage < totalPages! && (
          <button className="buttom-primary" onClick={goToNextPage}>Next</button>
        )}
      </div>
    </div>
  );
}
