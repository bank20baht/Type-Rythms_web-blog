import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Head from "next/head";
import CommentComponent from "@/components/CommentComponent";
import ReactMarkdown from "react-markdown";
import {
  VscEdit,
  VscClose,
  VscComment,
  VscHeart,
  VscHeartFilled,
} from "react-icons/vsc";
import { useSession } from "next-auth/react";
export type CommentData = {
  picture: string;
  username: string;
  comment: string;
};

export type ArticleData = {
  _id: string;
  title: string;
  content: string;
  user_email: string;
  timestamp: string;
  user_name: string;
  user_img: string;
  comment: CommentData[];
};

const apiURL = "http://localhost:5000/api/articles/";

const Article = ({ article }: { article: ArticleData }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const deleteArticle = async () => {
    await axios.delete(apiURL + "delete/" + article._id, {
      headers: {
        Authorization: `Bearer ${session?.user.accesstoken}`,
      },
    });
    router.push("/");
  };
  const initalState = {
    picture: "",
    username: "",
    comment: "",
  };
  const [commentData, setCommentData] = useState(initalState);
  const handleChange = (e: any) => {
    setCommentData({ ...commentData, [e.target.name]: e.target.value });
  };

  function postComment() {
    axios
      .post(apiURL + "comment/" + id, {
        picture: session?.user?.image,
        username: session?.user?.name,
        comment: commentData.comment,
      })
      .then((response) => {
        setCommentData(response.data);
      });
    setCommentData(initalState);
    //router.push("/Article/" + id);
    window.location.reload();
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="author" content={article.user_name}></meta>
        <meta
          name="description"
          content="This is a description of my web page."
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <div className="contaniner whitespace-pre-wrap overflow-wrap-break-word">
        <div className="m-3 flex flex-col items-center  bg-white border shadow-md rounded-xl p-4 md:p-5 break-all">
          <h2>{article.title}</h2>
        </div>
        <div className="m-3 flex flex-col  bg-white border shadow-md rounded-xl p-4 md:p-5 break-all">
          <ReactMarkdown>{article.content}</ReactMarkdown>
          <span className="divider-line"></span>
          <div className="flex">
            <VscHeart />
            <span>Like</span>
          </div>
        </div>
        <div className="flex flex-row justify-end p-2 m-2">
          <img className="avatar-img" src={article.user_img} alt="u_img" />
          <span className="m-1">{article.user_name}</span>
        </div>
        {session && article?.user_email == session.user?.email ? (
          <div className="flex flex-row justify-end">
            <div
              className="buttom-secondary w-auto flex"
              onClick={deleteArticle}
            >
              <VscClose />
              DEL
            </div>
            <div
              className="buttom-primary w-auto flex"
              onClick={() => {
                router.push("/Edit/" + article._id);
              }}
            >
              <VscEdit />
              EDIT
            </div>
          </div>
        ) : (
          <></>
        )}
        {session?.user ? (
          <div className="m-5">
            Leave a Comment:
            <textarea
              className="textarea-content"
              rows={3}
              name="comment"
              placeholder="Comment something"
              onChange={handleChange}
            ></textarea>
            <div
              className="buttom-primary w-auto flex justify-center"
              onClick={postComment}
            >
              <VscComment />
              comment
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            Please Login to comment this article
          </div>
        )}

        {article.comment && article.comment.length > 0 ? (
          <div className="m-5">
            <h3>Comments:</h3>
            {article.comment.map((comment: any, index: number) => (
              <CommentComponent key={index} comment={comment} />
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default Article;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  try {
    const response = await axios.get(apiURL + id);
    const { data: article } = response;

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
