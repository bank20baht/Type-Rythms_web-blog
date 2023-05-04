import axios from "@/lib/axios";
import { signIn, useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post("/auth/refresh", {
      refreshtoken: session?.user.refreshtoken,
    });
    console.log(res)
    if (session) session.user.accesstoken = res.data.accesstoken;
    else signIn();
  };
  return refreshToken;
};