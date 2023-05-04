import axios from "@/lib/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import router from "next/router";
import { object, string } from "yup";

interface IProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const apiURL = "/register";

const RegisterPage = ({ searchParams }: IProps) => {
  const initialValues = {
    email: "",
    password: "",
    name: "",
  };

  const onSubmit = async (values: any) => {
    try {
      const response = await axios.post(apiURL, {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  const validationSchema = object().shape({
    email: string()
      .required("Email is a required field")
      .email("Invalid email format"),
    password: string()
      .required("Password is a required field")
      .min(4, "Password must be at least 8 characters"),
    name: string().required("Name is a required field"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formDatas) => (
        <Form>
          <div className="flex flex-col justify-center items-center  h-screen bg-gradient-to-br gap-1 from-red-200 to-white">
            {searchParams?.message && (
              <p className="text-red-700 bg-red-100 py-2 px-5 rounded-md">
                {searchParams?.message}
              </p>
            )}
            <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
              <h1>Register</h1>
              <Field
                className={
                  formDatas.touched.name && Boolean(formDatas.errors.name)
                    ? "border border-red-500 input-title"
                    : "border border-black input-title"
                }
                name="name"
                placeholder="Name"
                type="text"
              />
              <ErrorMessage
                className="text-red-500"
                name="name"
                component="p"
              />

              <Field
                className={
                  formDatas.touched.email && Boolean(formDatas.errors.email)
                    ? "border border-red-500 input-title"
                    : "border border-black input-title"
                }
                name="email"
                placeholder="Email"
                type="email"
              />
              <ErrorMessage
                className="text-red-500"
                name="email"
                component="p"
              />

              <Field
                className={
                  formDatas.touched.password &&
                  Boolean(formDatas.errors.password)
                    ? "border border-red-500 input-title"
                    : "border border-black input-title"
                }
                name="password"
                placeholder="Password"
                type="password"
              />
              <ErrorMessage
                className="text-red-500"
                name="password"
                component="p"
              />

              <button className="buttom-primary" type="submit">
                Register
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterPage;
