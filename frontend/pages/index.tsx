import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CardArticle from '@/components/CardArticleComponent'

export type ArticleData = {
  _id: string;
  title: string;
  user_name: string;
  user_img: string;
  timestamp: string
}

const apiURL = "http://localhost:5000/api/articles";

const index = () => {
  const [articles, setArticle] = useState<ArticleData[] | null>()

  useEffect(() => {
    const getArticle =async () => {
      try {
        const response = await axios.get(apiURL)
        setArticle(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    getArticle();
  }, [])
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

export default index