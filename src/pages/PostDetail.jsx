import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import PostCard from '../components/PostCard'

export default function PostDetail(){
  const { id } = useParams()
  const posts = useStore(s=>s.posts)
  const post = posts.find(p=>p.id===id)
  const navigate = useNavigate()
  if(!post){
    return (
      <div className="max-w-[630px] mx-auto px-4 pt-10 text-center">
        <p className="font-semibold">Post not found</p>
        <p className="text-sm text-zinc-500 mt-1">It may have been deleted or hidden.</p>
        <button onClick={()=>navigate('/')} className="mt-4 px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold">Go to feed</button>
      </div>
    )
  }
  return (
    <div className="max-w-[630px] mx-auto px-0 lg:px-4 pt-4 pb-8 w-full">
      <button onClick={()=>navigate(-1)} className="mb-3 text-sm font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 ml-3 lg:ml-0">← Back</button>
      <PostCard post={post}/>
    </div>
  )
}
