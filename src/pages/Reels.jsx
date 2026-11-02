import { useEffect, useRef, useState } from 'react'
import { Heart, MessageCircle, Bookmark, Volume2, VolumeX, MoreHorizontal } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Link } from 'react-router-dom'

export default function Reels(){
  const reels = useStore(s=>s.reels)
  const users = useStore(s=>s.users)
  const currentUserId = useStore(s=>s.currentUserId)
  const toggleLikeReel = useStore(s=>s.toggleLikeReel)
  const toggleSaveReel = useStore(s=>s.toggleSaveReel)
  const addReelComment = useStore(s=>s.addReelComment)
  const followToggle = useStore(s=>s.followToggle)
  const followingIds = useStore(s=>s.followingIds)
  const saved = useStore(s=>s.saved)
  const [activeIdx, setActiveIdx] = useState(0)
  const [muted, setMuted] = useState(true)
  const [commentInputs, setCommentInputs] = useState({})
  const [showComments, setShowComments] = useState(null)
  const [failedIds, setFailedIds] = useState({})
  const containerRef = useRef(null)
  const videoRefs = useRef({})

  // Intersection to know active video
  useEffect(()=>{
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const idx = Number(e.target.dataset.idx)
          setActiveIdx(idx)
        }
      })
    }, { threshold: 0.6 })
    const els = containerRef.current?.querySelectorAll('[data-idx]')
    els?.forEach(el=> obs.observe(el))
    return ()=> obs.disconnect()
  },[reels.length])

  // Play only active
  useEffect(()=>{
    Object.entries(videoRefs.current).forEach(([id, vid])=>{
      if(!vid) return
      const isActive = Number(vid.dataset.idx)===activeIdx
      if(isActive && !failedIds[id]){
        vid.muted = muted
        const p = vid.play()
        if(p) p.catch(()=>{})
      } else {
        vid.pause()
      }
    })
  },[activeIdx, muted, failedIds])

  if(reels.length===0) return <div className="text-center py-16 text-sm text-zinc-500">No reels</div>

  return (
    <div ref={containerRef} className="h-[calc(100dvh-56px)] lg:h-[calc(100vh-0px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black max-w-[420px] mx-auto w-full">
      {reels.map((r, idx)=>{
        const user = users.find(u=>u.id===r.userId)
        const isLiked = r.likes.includes(currentUserId)
        const isSaved = saved.includes(r.id)
        const isFollowing = followingIds.includes(r.userId)
        const failed = !!failedIds[r.id]
        return (
          <div key={r.id} data-idx={idx} className="relative h-[calc(100dvh-56px)] lg:h-[calc(100vh-0px)] snap-start flex items-center justify-center bg-black overflow-hidden">
            {failed ? (
              <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-900 text-white p-6 text-center">
                <img src={r.thumb} alt="" className="w-full h-full object-cover opacity-50 absolute inset-0"/>
                <div className="relative z-10">
                  <p className="font-semibold">Video unavailable</p>
                  <p className="text-sm opacity-70 mt-1">This reel failed to load.</p>
                </div>
              </div>
            ) : (
              <video
                ref={el=>{ if(el){ videoRefs.current[r.id]=el } }}
                data-idx={idx}
                src={r.video}
                poster={r.thumb}
                loop
                playsInline
                muted={muted}
                preload="metadata"
                className="w-full h-full object-contain"
                onError={()=> setFailedIds(s=> ({...s, [r.id]:true}))}
              />
            )}

            {/* overlay controls */}
            <button onClick={()=>setMuted(v=>!v)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white" aria-label={muted?'Unmute':'Mute'}>
              {muted? <VolumeX size={18}/> : <Volume2 size={18}/>}
            </button>

            {/* right actions */}
            <div className="absolute right-3 bottom-[120px] flex flex-col items-center gap-5 text-white">
              <button onClick={()=>toggleLikeReel(r.id)} aria-label={isLiked?'Unlike':'Like'} className="flex flex-col items-center">
                <span className={`p-3 rounded-full ${isLiked?'bg-red-500':'bg-white/15'} backdrop-blur`}>
                  <Heart size={22} className={isLiked?'fill-white text-white':''}/>
                </span>
                <span className="text-xs mt-1 font-semibold">{r.likes.length}</span>
              </button>
              <button onClick={()=> setShowComments(showComments===r.id? null: r.id)} aria-label="Comments" className="flex flex-col items-center">
                <span className="p-3 rounded-full bg-white/15 backdrop-blur"><MessageCircle size={22}/></span>
                <span className="text-xs mt-1 font-semibold">{r.comments?.length||0}</span>
              </button>
              <button onClick={()=>toggleSaveReel(r.id)} aria-label={isSaved?'Unsave':'Save'} className="flex flex-col items-center">
                <span className={`p-3 rounded-full ${isSaved?'bg-white text-black':'bg-white/15'} backdrop-blur`}>
                  <Bookmark size={22} className={isSaved?'fill-black':''}/>
                </span>
              </button>
              <button className="p-3 rounded-full bg-white/15 backdrop-blur" aria-label="More"><MoreHorizontal size={18}/></button>
              <Link to={`/profile/${user?.username}`} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white"><img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover"/></Link>
            </div>

            {/* bottom info */}
            <div className="absolute left-3 right-16 bottom-6 text-white">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{user?.username}</span>
                {user?.id!==currentUserId && (
                  <button onClick={()=>followToggle(user.id)} className={`text-xs font-semibold px-3 py-1 rounded-full border ${isFollowing?'bg-white text-black border-white':'bg-transparent border-white text-white'}`}>{isFollowing?'Following':'Follow'}</button>
                )}
              </div>
              <p className="text-sm mt-1 leading-snug line-clamp-2">{r.caption}</p>
            </div>

            {/* comments sheet */}
            {showComments===r.id && (
              <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-zinc-900 rounded-t-2xl max-h-[45%] flex flex-col z-20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold text-sm">Comments ({r.comments?.length||0})</span>
                  <button onClick={()=>setShowComments(null)} className="text-xs font-semibold">Close</button>
                </div>
                <div className="flex-1 overflow-auto p-3 space-y-3">
                  {(r.comments||[]).length===0 && <p className="text-sm text-zinc-500 text-center py-6">No comments yet.</p>}
                  {(r.comments||[]).map(c=>{
                    const cu = users.find(u=>u.id===c.userId)
                    return <div key={c.id} className="flex gap-2 text-sm"><span className="font-semibold shrink-0">{cu?.username}</span><span>{c.text}</span></div>
                  })}
                </div>
                <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                  <input
                    value={commentInputs[r.id]||''}
                    onChange={e=> setCommentInputs(s=> ({...s, [r.id]: e.target.value}))}
                    onKeyDown={e=>{ if(e.key==='Enter' && commentInputs[r.id]?.trim()){ addReelComment(r.id, commentInputs[r.id]); setCommentInputs(s=> ({...s, [r.id]:''}))}}}
                    placeholder="Add a comment..."
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-2 text-sm outline-none"
                  />
                  <button onClick={()=>{ if(commentInputs[r.id]?.trim()){ addReelComment(r.id, commentInputs[r.id]); setCommentInputs(s=> ({...s, [r.id]:''}))}}} className="text-sm font-semibold text-[#0095f6]">Post</button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
