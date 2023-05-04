import axios from "@/lib/axios";
import { signIn, useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session, status } = useSession();

  const refreshToken = async () => {
    if (status !== "authenticated" || !session?.user?.refreshtoken) {
      signIn();
      return;
    }

    try {
      const res = await axios.post("/auth/refresh", {
        refreshtoken: session.user.refreshtoken,
      });

      if (session) {
        session.user.accesstoken = res.data.accesstoken;
      }
    } catch (e) {
      console.error("Error refreshing token:", e);
      signIn();
    }
  };

  return refreshToken;
};