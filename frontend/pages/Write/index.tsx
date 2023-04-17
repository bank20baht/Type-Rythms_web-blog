import React from 'react'

const index = () => {
  return (
    <div className='content-center flex flex-col justify-center '>
        <input type="text" className="max-w-[120rem] w-full mx-auto m-3 py-3 px-4 block border border-black rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 " placeholder="Title"></input>
        <textarea className="m-3 py-3 px-4 block max-w-[120rem] w-full mx-auto border border-black rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" rows={20} placeholder="Content"></textarea>
        <div className="flex justify-end p-2 m-2 max-w-[120rem] w-full mx-auto">
            <div className='buttom-primary'>Write</div>
      </div>
    </div>
    
  )
}

export default index