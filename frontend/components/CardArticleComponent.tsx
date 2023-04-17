import React from 'react'
import { useRouter } from 'next/router'


const CardArticleComponent = (props: any) => {
    const router = useRouter(); 
    const { article } = props;
    function getDate() {
        let time = Date.parse(article.timestamp);
        let date = new Date(time);
        return date.toDateString();
    }
    
    return (
        <div onClick={() => {
            router.push("/Article/" + article._id)
        }}>
            <div className="max-w-[120rem] w-full mx-auto sm:items-center m-3 flex flex-col justify-center bg-white border shadow-md rounded-xl p-4 md:p-5 hover:shadow-2xl hover:text-red-400">
                <h1 className='font-bold text-2xl'>{article.title}</h1>
                <div className='flex flex-row justify-center'>
                    <img className='rounded-full w-6 h-6 m-1' src={article?.user_img} alt="u_img"/>
                    <h2 className='m-1'>{article.user_name} | {getDate()}</h2>
                </div>
            </div>
        </div>

  )
}

export default CardArticleComponent