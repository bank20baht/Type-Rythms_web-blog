import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Head from "next/head";
import CommentComponent from "@/components/CommentComponent";

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
    router.push("/Article/" + id);
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
          <h1>{article.title}</h1>
        </div>
        <div className="m-3 flex flex-col  bg-white border shadow-md rounded-xl p-4 md:p-5 whitespace-pre-wrap">
          <p className="text-left">{article.content}</p>
        </div>
        <div className="flex flex-row justify-end p-2 m-2">
          <img className="avatar-img" src={article.user_img} alt="u_img" />
          <h2 className="m-1">{article.user_name}</h2>
        </div>
        <div className="flex flex-row justify-end">
          <div className="buttom-primary w-auto" onClick={deleteArticle}>
            DEL
          </div>
          <div
            className="buttom-secondary w-auto"
            onClick={() => {
              router.push("/Edit/" + article._id);
            }}
          >
            EDIT
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
            className="buttom-primary flex justify-center"
            onClick={postComment}
          >
            comment
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
          <div>No comments yet</div>
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

