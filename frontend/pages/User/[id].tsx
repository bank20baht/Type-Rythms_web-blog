import axios from "axios";
import CardArticle from "@/components/CardArticleComponent";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

export type ArticleData = {
  _id: string;
  title: string;
  user_name: string;
  user_img: string;
  timestamp: string;
  user_email: string
}

interface Props {
  articles: ArticleData[];
  currentPage: number;
  totalPages: number;
}

export default function User({ articles, currentPage, totalPages }: Props) {
  const router = useRouter();
  const { id } = router.query
  const goToNextPage = () => {
    window.location.href = `/?page=${currentPage + 1}`;
  };

  const goToPreviousPage = () => {
    window.location.href = `/?page=${currentPage - 1}`;
  };

  return (
    <div className="contaniner">
      <Head>
        <title>Type-Rythms Web blog</title>
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
            .map((article: any) => {
              return <CardArticle article={article} key={article._id} />;
            })
        ) : (
          <div>No articles found.</div>
        )}
      </div>
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query
  const page = query.page ? Number(query.page) : 1;
  const limit = 5;
  let articles
  let totalPages
  try {
    const response = await axios.get(
    `http://localhost:5000/api/user/${id}?page=${page}&limit=${limit}`
    );
    articles = response.data.results;
    totalPages = Math.ceil(response.data.count / limit);
  } catch (error) {
    console.error(error)
  }


  return { props: { articles, currentPage: page, totalPages } };
};