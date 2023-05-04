import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { VscCheck } from "react-icons/vsc";
import { object, string } from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "@/lib/axios";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
const apiURL = "/articles/";

const Write = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const initialValues = {
    title: "",
    content: "",
  };

  const onSubmit = async (values: any) => {
    try {
      const response = await axiosAuth.post(apiURL, {
        title: values.title,
        content: values.content,
        user_email: session?.user?.email,
        user_name: session?.user?.name,
        user_img: session?.user?.image,
      });
      router.push("/");
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
                  Write
                  <VscCheck />
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Write;
