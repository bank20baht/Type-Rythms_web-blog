import axios from "axios";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
export default function Welcome() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const handleClick = async () => {
    try {
      const response = await axiosAuth.get("http://localhost:5000/welcome");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Welcome Page</h1>
      <button onClick={handleClick}>Get Welcome</button>
    </div>
  );
}
