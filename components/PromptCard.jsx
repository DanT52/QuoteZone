"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'



const PromptCard = ( { post, handleTagClick, handleEdit, handleDelete, handleAuthorClick}) => {

  const {data: session} = useSession()
  const pathName = usePathname()
  const router = useRouter()


  const [copied, setCopied] = useState("")
  const [saved, setSaved] = useState(post.usersSaved.includes(session?.user.id))
  const [savedCount, setSavedCount] = useState(post.usersSaved.length)
  const [savedLoading, setSavedLoading] = useState(false)

  const handleProfileClick = () => {
    

    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt)
    navigator.clipboard.writeText(` "${post.prompt}" \n -${post.author}`)
    setTimeout(()=> setCopied(""), 3000)
  }

  const handleSave = async (e) => {
    if (savedLoading){
      return
    }

    if (saved) {
      setSavedLoading(true)
      try {

        await fetch(`/api/prompt/save/unsave`,
        {
            method: 'PATCH',
            body: JSON.stringify({
                userId: session?.user.id,
                postId: post._id,
            })
        })



    }catch (error) {

        console.log(error)

    } 


      setSaved(false)
      setSavedLoading(false)
      setSavedCount(savedCount-1)
    } else {
      setSavedLoading(true)
      try {

        await fetch(`/api/prompt/save`,
        {
            method: 'PATCH',
            body: JSON.stringify({
                userId: session?.user.id,
                postId: post._id,
            })
        })



    }catch (error) {

        console.log(error)

    } 

      setSaved(true)
      setSavedLoading(false)
      setSavedCount(savedCount+1)
    }

    
    
    

}

  const [showMore, setShowMore] = useState(false)

  

  const needShowMore = (post.description !== '' || post.prompt.length> 300) ? true : false

  const truncatedPost = (needShowMore) ? post.prompt.substring(0, 355) +  ' ...': post.prompt

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

 

  return (
    <div className='prompt_card dark:bg-slate-800'>
      <div className='flex justify-between items-start gap-2'>
        <div
          onClick={handleProfileClick}
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
         >
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
            />
            <div className='flex flex-col'>
              <h3 className='font-satoshi font-semibold text-grey-900 dark:text-slate-300'>
                {post.creator.username}
              </h3>
              {post.showEmail && (
              <p className='font-inter text-sm text-gray-500 dark:text-slate-300'>
                 {post.creator.email}
              </p>
              )}
            </div>
        </div>

        <div className="cpy_btn cursor-pointer bg-slate-100 hover:bg-slate-200  dark:bg-slate-800 dark:hover:bg-slate-700 p-0 rounded-full mr-2" onClick={() => handleCopy()}>
          <Image
            src={copied === post.prompt 
            ? '/assets/icons/tick.svg'
            : '/assets/icons/copy.svg'}
            width={15}
            height={15}
          />

        </div>

        {session?.user ? (
          <div className=" cpy_btn cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-0 rounded-full" onClick={() => handleSave()}>
          <Image
            src={savedLoading
              ? '/assets/icons/loader.svg'
              : (saved) ? 
              '/assets/icons/bookmark-solid.svg' 
              : '/assets/icons/bookmark-regular.svg'}
            className="icon-purple"
            width={12}
            height={12}
          />
         
        </div>
      

        ) : (
          <div className=" cpy_btn cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-0 rounded-full" onClick={() => alert("Login to bookmark quotes.")}>
          <Image
            src={'/assets/icons/bookmark-disabled.svg'}
            className="icon-purple"
            width={12}
            height={12}
          />
         
        </div>


        )}

        <div>
          <p className='text-black dark:text-white text-xs'> {savedCount}</p>
        </div>
        




      </div>


      {showMore &&  (
        <div>
        <div className='mt-3'>
          <p className='text-gray-500 dark:text-slate-300 text-sm font-medium'>Prompt:</p>
        </div>
        <div className='  px-7'>
        <p className='my-4 font-satoshi text-sm text-gray-700 dark:text-slate-100'>{post.prompt}</p>
        </div>
  
        { post.description !== '' && (
        <div className='mt-4'>
          <p className='text-gray-500 dark:text-slate-300 text-sm font-medium'>Description:</p>
        
  
        <div className='  px-7'>
          <p className='my-4 font-satoshi text-sm text-gray-700 dark:text-slate-100 '>{post.description}</p>
        </div>
        </div>
        )}
        </div>
      ) }

      {(needShowMore && !showMore) &&  (
        <div>
          <p className=' mt-3 font-satoshi text-sm text-gray-700 dark:text-slate-100'>{truncatedPost}</p>
        </div>
      )}
      {(!needShowMore)&& (
        <div>
          <p className=' my-5  font-satoshi text-sm text-gray-700 dark:text-slate-100'>{truncatedPost}</p>
        </div>

      )}

      {needShowMore && (
        <div className='flex justify-end'>
        <button onClick={toggleShowMore} className='dark:text-white text-sm'>
        {showMore ? 'Show Less ▲' :'Show More ▼' }
      </button>
      </div>
      )}
      


      <div className='flex justify-between'>
        <div className='flex'>

          <p className='mx-2 font-inter text-sm text-gray-400 dark:text-slate-500'>author: </p>

          <p className='  font-inter text-sm orange_gradient cursor-pointer'
            onClick={() => handleAuthorClick && handleAuthorClick(post.author)}
          >
            {post.author}
          </p>

          <p className='ml-[30px] mx-3 font-inter text-sm text-gray-400 dark:text-slate-500'>catagory: </p>

          <p className='  font-inter text-sm blue_gradient cursor-pointer'
            onClick={() => handleTagClick && handleTagClick
            (post.tag)}
          >
            {post.tag}
          </p>
          
        </div>
        {(showMore || !needShowMore) && (
          <div>
          <p className='text-sm text-gray-400 dark:text-slate-500'>
            Posted {formatDistanceToNow(post.date)} ago.
          </p>
        </div>

        )}
        
    

      </div>

      {session?.user._id === post.creator.id &&
      pathName === '/profile' && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-500 dark:border-gray-100 pt-3'>


          <p
            className="font-inter text-sm text-orange-600 cursor-pointer hover:text-orange-900"
            onClick={handleEdit}
            
          >
            Edit
          </p>

          <p
            className="font-inter text-sm text-red-500 cursor-pointer hover:text-red-900"
            onClick={handleDelete}
            
          >
            Delete
          </p>
        </div>

      )}
    </div>
  )
}

export default PromptCard