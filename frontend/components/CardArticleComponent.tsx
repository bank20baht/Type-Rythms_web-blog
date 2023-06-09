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
                <h1 className='font-bold text-2xl break-all'>{article.title}</h1>
                <div className='flex flex-row justify-center break-all'>
                    <img className='avatar-img' src={article?.user_img} alt="u_img"/>
                    <span className='m-1'>{article.user_name} | {getDate()}</span>
                </div>
            </div>
        </div>

  )
}

export default CardArticleComponent