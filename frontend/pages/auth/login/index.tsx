import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string } from "yup";
interface IProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LoginPage = ({ searchParams }: IProps) => {
  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values: any) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  const validationSchema = object().shape({
    email: string()
      .required("Email is a required field")
      .email("Invalid email format"),
    password: string()
      .required("Password is a required field")
      .min(3, "Password must be at least 8 characters"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formDatas) => (
        <form onSubmit={formDatas.handleSubmit}>
          <div
            className={
              "flex flex-col justify-center items-center  h-screen bg-gradient-to-br gap-1 from-red-200 to-white"
            }
          >
            {searchParams?.message && (
              <p className="text-red-700 bg-red-100 py-2 px-5 rounded-md">
                {searchParams?.message}
              </p>
            )}
            <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
              <h1>Login</h1>
              <Field
                className={
                  formDatas.touched.email && Boolean(formDatas.errors.email)
                    ? "border border-red-500 input-title"
                    : "border border-black input-title"
                }
                name="email"
                placeholder="Email"
                type="email"
                onChange={formDatas.handleChange}
                value={formDatas.values.email}
              />
              {Boolean(formDatas.errors.email) && (
                <p className="text-red-500">{formDatas.errors.email}</p>
              )}

              <Field
                className={
                  formDatas.touched.password &&
                  Boolean(formDatas.errors.password)
                    ? "border border-red-500 input-title"
                    : "border border-black input-title"
                }
                name="password"
                placeholder="Password"
                type={"password"}
                onChange={formDatas.handleChange}
                value={formDatas.values.password}
              />
              {Boolean(formDatas.errors.password) && (
                <p className="text-red-500">{formDatas.errors.password}</p>
              )}

              <button className="buttom-primary" type="submit">
                Login
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default LoginPage;
