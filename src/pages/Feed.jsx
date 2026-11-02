import { useStore } from '../store/useStore'
import PostCard from '../components/PostCard'
import Stories from '../components/Stories'

export default function Feed(){
  const posts = useStore(s=>s.posts)
  const hiddenPostIds = useStore(s=>s.hiddenPostIds)
  const reportedPostIds = useStore(s=>s.reportedPostIds)
  const feedFilter = useStore(s=>s.feedFilter)
  const setFeedFilter = useStore(s=>s.setFeedFilter)
  const followingIds = useStore(s=>s.followingIds)
  const currentUserId = useStore(s=>s.currentUserId)

  const filtered = posts.filter(p=> !hiddenPostIds.includes(p.id) && !reportedPostIds.includes(p.id))
  const display = feedFilter==='following' ? filtered.filter(p=> followingIds.includes(p.userId) || p.userId===currentUserId) : filtered

  return (
    <div className="max-w-[630px] mx-auto px-0 lg:px-4 pt-2 lg:pt-6 w-full">
      <Stories/>
      <div className="flex gap-2 justify-center mb-4 px-3 lg:px-0">
        <button onClick={()=>setFeedFilter('foryou')} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${feedFilter==='foryou'?'bg-black text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-900'}`}>For You</button>
        <button onClick={()=>setFeedFilter('following')} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${feedFilter==='following'?'bg-black text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-900'}`}>Following</button>
      </div>
      {display.length===0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl mx-3">
          <p className="text-sm text-zinc-500">No posts yet. Follow people or switch to For You.</p>
        </div>
      ) : display.map(p=> <PostCard key={p.id} post={p}/> )}
    </div>
  )
}
