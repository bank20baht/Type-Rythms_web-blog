import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CardArticle from '@/components/CardArticleComponent'
import { useRouter } from 'next/router'

export type ArticleData = {
  _id: string;
  title: string;
  timestamp: string;
  user_name: string;
  user_img: string;
};

const apiURL = "http://localhost:5000/api/user/";

const MyStory = () => {
  const [articles, setArticles] = useState<ArticleData[] | null>();
  const router = useRouter();
  const { id } = router.query;
  console.log("id in Mystroty page => " + id);
  useEffect(() => {
    const getMyArticle = async () => {
      try {
        const response = await axios.get(apiURL + id);
        setArticles(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getMyArticle();
  }, []);

  return (
    <div>
      {articles && articles.length > 0 ? (
        articles
          .slice(0)
          .reverse()
          .map((article) => <CardArticle article={article} key={article._id} />)
      ) : (

        <div>
          No-article in database
        </div>
      )}
        
    </div>
    
  )
}

export default MyStory;