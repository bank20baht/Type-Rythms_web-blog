
import React, { useState } from "react";
import axios from "axios";

const apiURL = "http://localhost:5000/api/article/";

type Props = {
  articleData: {
    title: string;
    content: string;
  };
};

const Edit = ({ articleData }: Props) => {
  const [article, setArticle] = useState(articleData);

  const handleChange = (e: any) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/update/article",
        {
          title: article.title,
          content: article.content,
          user_email: "bank_update",
          user_name: "bank_update",
          user_img: "bank_update",
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content-center flex flex-col justify-center md:p-5">
      <input
        type="text"
        className="input-title"
        name="title"
        placeholder="Title"
        value={article.title}
        onChange={handleChange}
      ></input>
      <textarea
        className="textarea-content"
        rows={20}
        name="content"
        placeholder="Content"
        value={article.content}
        onChange={handleChange}
      ></textarea>
      <div className="flex justify-end p-2 m-2 max-w-[120rem] w-full mx-auto">
        <div className="buttom-primary" onClick={() => {}}>
          Update
        </div>
      </div>
    </div>
  );
};

export default Edit;

export const getServerSideProps = async ({ params }: any) => {
  try {
    const response = await axios.get(apiURL + params.id);
    const articleData = {
      _id: response.data._id,
      title: response.data.title,
      content: response.data.content,
    };
    return { props: { articleData } };
  } catch (error) {
    console.error(error);
    return { props: {} };
  }
};
