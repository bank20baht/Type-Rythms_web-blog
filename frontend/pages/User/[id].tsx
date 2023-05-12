import axios from "axios";
import CardArticle from "@/components/CardArticleComponent";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"
import { useState } from "react";
export type ArticleData = {
  _id: string;
  title: string;
  user_name: string;
  user_img: string;
  timestamp: string;
  user_email: string
}

export type userData = {
  name: string;
  email: string;
  image: string;
}

interface Props {
  articles: ArticleData[];
  currentPage: number;
  totalPages: number;
  user: userData;
}

export default function User({ articles, currentPage, totalPages, user }: Props) {
  const router = useRouter();
  const { id } = router.query
  const { data: session } = useSession()
  const goToNextPage = () => {
    window.location.href = `/?page=${currentPage + 1}`;
  };

  const goToPreviousPage = () => {
    window.location.href = `/?page=${currentPage - 1}`;
  };

  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: any) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo', file, fileName);

    try {
      const res = await axios.put('http://localhost:5000/api/upload/changeAvatar/'+ id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res)
      setFile('');
      setFileName('');
    } catch (err) {
      console.log(err);
    }
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
            src={user?.image as string}
            alt="u_img"
          />
              <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
      {fileName && <p>Selected file: {fileName}</p>}
    </form>
          <div className="">{user?.name}</div>
          <div>{user?.email}</div>
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
  let articles = null
  let totalPages = 0
  let user = null
  try {
    const articlebyuser = await axios.get(
    `http://localhost:5000/api/articles/user/${id}?page=${page}&limit=${limit}`
    );
    articles = articlebyuser.data.results;
    totalPages = Math.ceil(articlebyuser.data.count / limit);
    const userinfomation = await axios.get(
      `http://localhost:5000/api/user/${id}`
    )
    user = userinfomation.data
  } catch (error) {
    console.error(error)
  }


  return { props: { articles, currentPage: page, totalPages, user } };
};