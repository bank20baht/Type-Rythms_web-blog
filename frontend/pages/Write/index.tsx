import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { VscCheck } from "react-icons/vsc";
const apiURL = "http://localhost:5000/api/addArticle";


const Write = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState();
  const initalState = {
    title: "",
    content: "",
  };

  const [articleData, setArticleData] = useState(initalState);

  const handleChange = (e: any) => {
    setArticleData({ ...articleData, [e.target.name]: e.target.value });
  };

  //console.log(articleData);
  function postArticle() {
    axios
      .post(apiURL, {
        title: articleData.title,
        content: articleData.content,
        user_email: session?.user?.email,
        user_name: session?.user?.name,
        user_img: session?.user?.image,
      })
      .then((resspone) => {
        setArticles(resspone.data);
      });
    setArticleData(initalState);
    router.push("/");
  }
  return (
    <>
      <Head>
        <title>Write Article</title>
        <meta name="description" content="This is a description of my web page."></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
    <div className="content-center flex flex-col justify-center md:p-5">
      <input
        type="text"
        className="input-title"
        name="title"
        placeholder="Title"
        onChange={handleChange}
      ></input>
      <textarea
        className="textarea-content"
        rows={20}
        name="content"
        placeholder="Content"
        onChange={handleChange}
      ></textarea>
              <div className="flex justify-end">Posting as {session?.user?.name}</div>
      <div className="flex justify-end p-2 m-2 max-w-[120rem] w-full mx-auto">
        <div className="buttom-primary flex" onClick={postArticle}>Write<VscCheck/></div>
      </div>
    </div>
    </>

  );
};

export default Write