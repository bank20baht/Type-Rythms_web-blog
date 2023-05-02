import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import { VscCheckAll } from "react-icons/vsc";
import { object, string } from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSession } from "next-auth/react";
const apiURL = "http://localhost:5000/api/article/";

type Props = {
  articleData: {
    title: string;
    content: string;
  };
};


const EditPage = ({ articleData }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query
  const initialValues = {
    title: articleData.title,
    content: articleData.content,
  };

  const onSubmit = async (values: any) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/update/article", 
      {
        _id: id,
        title: values.title,
        content: values.content,
        user_email: session?.user?.email,
        user_name: session?.user?.name,
        user_img: session?.user?.image,
      });
      router.push("/Article/" + id);
    } catch (error) {
      console.error(error);
    }
  };

  const validationSchema = object().shape({
    title: string().required("title is a required field"),
    content: string()
      .required("Content is a required field")
      .min(30, "Content must be at least 8 characters"),
  });
  return (
    <>
      <Head>
        <title>Write Article</title>
        <meta
          name="description"
          content="This is a description of my web page."
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(FormDatas) => (
          <div className="content-center flex flex-col justify-center md:p-5">
            <Form>
              <Field
                type="text"
                className="input-title"
                name="title"
                placeholder="Title"
              />
              <ErrorMessage
                className="text-red-500"
                name="title"
                component="p"
              />
              <Field
                component="textarea"
                className="textarea-content"
                rows={20}
                name="content"
                placeholder="Content"
              />
              <ErrorMessage
                className="text-red-500"
                name="content"
                component="p"
              />
              <div className="flex justify-end">
                Posting as {session?.user?.name}
              </div>
              <div className="flex justify-end p-2 m-2 max-w-[120rem] w-full mx-auto">
                <button className="buttom-primary flex" type="submit">
                  Update
                  <VscCheckAll/>
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};

export default EditPage;

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
    return { notFound: true };
  }
};
