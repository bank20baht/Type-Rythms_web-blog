import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Head from "next/head";
import CommentComponent from "@/components/CommentComponent";
import ReactMarkdown from "react-markdown";
import { VscEdit, VscClose, VscComment, VscHeart, VscHeartFilled } from "react-icons/vsc";
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

const apiURL = "http://localhost:5000/api/article/";

const Article = ({ article }: { article: ArticleData }) => {
  const router = useRouter();
  const { id } = router.query;
  const deleteArticle = async () => {
    await axios.delete(apiURL + article._id);
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
        picture:
          "https://images.unsplash.com/photo-1682348686716-9a71d77e681c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        username: "bank_comment",
        comment: commentData.comment,
      })
      .then((response) => {
        setCommentData(response.data);
      });
    setCommentData(initalState);
    //router.push("/Article/" + id);
    window.location.reload()
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
      <div className="contaniner">
        <div className="sm:items-center m-3 flex flex-col  bg-white border shadow-md rounded-xl p-4 md:p-5">
          <h2>{article.title}</h2>
        </div>
        <div className="m-3 flex flex-col  bg-white border shadow-md rounded-xl p-4 md:p-5 ">
          <ReactMarkdown>{article.content}</ReactMarkdown>
          <span className="h-0.5 w-full bg-gray-200 lg:w-1/3 m-1"></span>
          <div className="flex">
            <VscHeart/>
            <span>Like</span>
          </div>
        </div>
        <div className="flex flex-row justify-end p-2 m-2">
          <img className="avatar-img" src={article.user_img} alt="u_img" />
          <span className="m-1">{article.user_name}</span>
        </div>
        <div className="flex flex-row justify-end">
          <div className="buttom-secondary w-auto flex" onClick={deleteArticle}>
            <VscClose/>DEL
          </div>
          <div
            className="buttom-primary w-auto flex"
            onClick={() => {
              router.push("/Edit/" + article._id);
            }}
          >
            <VscEdit/>EDIT
          </div>
        </div>
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
            <VscComment/>comment
          </div>
        </div>
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
  )
}

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

