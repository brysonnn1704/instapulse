import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Saved(){
  const posts = useStore(s=>s.posts)
  const saved = useStore(s=>s.saved)
  const reels = useStore(s=>s.reels)
  // saved may contain post or reel ids
  const savedPosts = posts.filter(p=> saved.includes(p.id))
  const savedReels = reels.filter(r=> saved.includes(r.id))
  const isEmpty = savedPosts.length===0 && savedReels.length===0
  return (
    <div className="max-w-[935px] mx-auto px-4 pt-6 pb-8 w-full">
      <h1 className="text-xl font-bold mb-4">Saved</h1>
      {isEmpty ? (
        <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
          <p className="font-semibold">No saved posts yet</p>
          <p className="text-sm text-zinc-500 mt-1">Save posts and reels to see them here.</p>
          <Link to="/explore" className="inline-block mt-4 text-sm font-semibold text-[#0095f6]">Explore</Link>
        </div>
      ) : (
        <>
          {savedPosts.length>0 && (
            <>
              <h2 className="text-sm font-semibold text-zinc-500 mb-2">Posts</h2>
              <div className="grid grid-cols-3 gap-1 md:gap-2 mb-6">
                {savedPosts.map(p=>(
                  <Link key={p.id} to={`/post/${p.id}`} className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img src={p.image} alt={p.caption} loading="lazy" className="w-full h-full object-cover"/>
                  </Link>
                ))}
              </div>
            </>
          )}
          {savedReels.length>0 && (
            <>
              <h2 className="text-sm font-semibold text-zinc-500 mb-2">Reels</h2>
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {savedReels.map(r=>(
                  <Link key={r.id} to="/reels" className="aspect-[9/16] overflow-hidden bg-zinc-900 relative">
                    <img src={r.thumb} alt={r.caption} loading="lazy" className="w-full h-full object-cover"/>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold bg-black/20">Reel</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
