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

import axios from "axios";
import CardArticle from "@/components/CardArticleComponent";
import { GetServerSideProps } from "next";

interface Data {
  _id: string;
  title: string;
  user_name: string;
  user_img: string;
  timestamp: string;
}

interface Props {
  data: Data[];
  currentPage: number;
  totalPages: number;
}

export default function Home({ data, currentPage, totalPages }: Props) {
  const goToNextPage = () => {
    window.location.href = `/?page=${currentPage + 1}`;
  };

  const goToPreviousPage = () => {
    window.location.href = `/?page=${currentPage - 1}`;
  };

  return (
    <div className="contaniner">
      <></>
      {data.map((item: Data) => (
        <CardArticle article={item} key={item._id} />
      ))}
      <div className="flex justify-center">
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex justify-center">
        {currentPage > 1 && (
          <button className="buttom-primary w-1/8" onClick={goToPreviousPage}>
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button className="buttom-primary w-1/8" onClick={goToNextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = 5;
  const response = await axios.get(
    `http://localhost:5000/api/articles?page=${page}&limit=${limit}`
  );
  const data = response.data.results;
  console.log(data)
  const totalPages = Math.ceil(response.data.count / limit);
  return { props: { data, currentPage: page, totalPages } };
};

