import axios from "axios";
import { useSession } from "next-auth/react";
export default function Welcome() {
  const { data: session } = useSession();
  const handleClick = async () => {
    try {
      const response = await axios.get("http://localhost:5000/welcome", {
        headers: {
          Authorization: `Bearer ${session?.user.accesstoken}`,
        },
      });
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
