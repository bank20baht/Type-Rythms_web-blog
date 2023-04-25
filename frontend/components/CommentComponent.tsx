import React from 'react'

const CommentComponent = (prop: any) => {
  return (
    <div className='flex flex-row'>
        <img className='rounded-full w-14 h-14 p-1 m-1' 
        src={"https://images.unsplash.com/photo-1682193965136-c8650b543426?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"} alt="comment_u_img"/>
        <div>
            <h1 className='p-1 font-bold'>Nattapong Promthong test</h1>
            <h1 className=''>Hello world Hello world Hello world
            Hello world Hello </h1>            
        </div>

    </div>
  )
}

export default CommentComponent