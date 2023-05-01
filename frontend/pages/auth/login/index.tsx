import { signIn } from "next-auth/react";
import { useRef } from "react";

interface IProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LoginPage = ({ searchParams }: IProps) => {
  const email = useRef("");
  const password = useRef("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      email: email.current,
      password: password.current,
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
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
        <input
          className="input-title"
          name="Email"
          placeholder="Email"
          onChange={(e) => {email.current = e.target.value
            console.log(email.current)}}
        />
        <input
          className="input-title"
          name="Password"
          placeholder="Password"
          type={"password"}
          onChange={(e) => {password.current = e.target.value
            console.log(password.current)
        }}
        />
        <div className="buttom-primary" onClick={onSubmit}>
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginPage;