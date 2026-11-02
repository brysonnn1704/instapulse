import { useState, useRef } from 'react'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, MapPin } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatTime } from '../utils/helpers'
import { Link, useNavigate } from 'react-router-dom'

export default function PostCard({ post }){
  const users = useStore(s=>s.users)
  const currentUserId = useStore(s=>s.currentUserId)
  const toggleLike = useStore(s=>s.toggleLike)
  const toggleSave = useStore(s=>s.toggleSave)
  const addComment = useStore(s=>s.addComment)
  const deleteComment = useStore(s=>s.deleteComment)
  const hidePost = useStore(s=>s.hidePost)
  const reportPost = useStore(s=>s.reportPost)
  const deletePost = useStore(s=>s.deletePost)
  const saved = useStore(s=>s.saved)
  const [showComments,setShowComments]=useState(false)
  const [commentText,setCommentText]=useState('')
  const [showMenu,setShowMenu]=useState(false)
  const [likedAnim,setLikedAnim]=useState(false)
  const navigate = useNavigate()
  const user = users.find(u=>u.id===post.userId)
  const isLiked = post.likes.includes(currentUserId)
  const isSaved = saved.includes(post.id)
  const isOwn = post.userId===currentUserId
  const imgRef = useRef(null)

  const handleDoubleClick = ()=>{
    if(!isLiked) toggleLike(post.id)
    setLikedAnim(true)
    setTimeout(()=>setLikedAnim(false), 900)
  }
  const handleCopy = async()=>{
    const url = `${window.location.origin}/post/${post.id}`
    try{ await navigator.clipboard.writeText(url) }catch{}
    if(navigator.share){
      try{ await navigator.share({ title:'InstaPulse', url })}catch{}
    }
    setShowMenu(false)
  }
  const handleShareBtn = async()=>{
    const url = `${window.location.origin}/post/${post.id}`
    try{
      if(navigator.share){ await navigator.share({title:'InstaPulse', url}); return }
    }catch{}
    try{ await navigator.clipboard.writeText(url); alert('Link copied!') }catch{ alert(url) }
  }

  return (
    <article className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl lg:rounded-none lg:border-x-0 lg:border-t-0 overflow-hidden max-w-[470px] mx-auto w-full mb-4 lg:mb-6">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <Link to={`/profile/${user?.username}`} className="flex items-center gap-3 flex-1 min-w-0">
          <img src={user?.avatar} alt={`${user?.name} avatar`} className="w-8 h-8 rounded-full object-cover"/>
          <div className="min-w-0">
            <div className="text-sm font-semibold flex items-center gap-1 truncate">{user?.username} {user?.verified && <span className="text-[#0095f6]">•</span>}</div>
            {post.location && <div className="text-xs text-zinc-500 flex items-center gap-1 truncate"><MapPin size={10}/>{post.location}</div>}
          </div>
        </Link>
        <div className="relative">
          <button onClick={()=>setShowMenu(v=>!v)} aria-label="More options" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreHorizontal size={18}/></button>
          {showMenu && (
            <div className="absolute right-0 top-9 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-20">
              <button onClick={handleCopy} className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">Copy link</button>
              <button onClick={()=>{ hidePost(post.id); setShowMenu(false)}} className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">Hide</button>
              <button onClick={()=>{ reportPost(post.id); setShowMenu(false); alert('Reported')}} className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">Report</button>
              {isOwn && <button onClick={()=>{ if(confirm('Delete post?')) deletePost(post.id); setShowMenu(false)}} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">Delete</button>}
              <button onClick={()=>setShowMenu(false)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <div className="relative bg-black overflow-hidden select-none" onDoubleClick={handleDoubleClick}>
        <img
          ref={imgRef}
          src={post.image}
          alt={post.caption || `Post by ${user?.username}`}
          loading="lazy"
          className={`w-full object-cover ${post.aspect==='portrait'?'aspect-[4/5]': post.aspect==='landscape'?'aspect-[16/9]':'aspect-square'} max-h-[580px]`}
          onError={e=>{ e.currentTarget.src=`https://picsum.photos/seed/fallback${post.id}/600/600` }}
        />
        {likedAnim && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Heart size={80} className="text-white fill-white drop-shadow-xl animate-[ping_0.9s_ease-out]" /></div>}
      </div>

      <div className="px-3 pt-2.5 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={()=>toggleLike(post.id)} aria-label={isLiked?'Unlike':'Like'} className="p-1 -ml-1">
            <Heart size={24} className={isLiked?'fill-red-500 text-red-500':'hover:opacity-60'} />
          </button>
          <button onClick={()=>setShowComments(v=>!v)} aria-label="Comment" className="p-1 hover:opacity-60"><MessageCircle size={24}/></button>
          <button onClick={handleShareBtn} aria-label="Share" className="p-1 hover:opacity-60"><Send size={22}/></button>
          <button onClick={()=>toggleSave(post.id)} aria-label={isSaved?'Unsave':'Save'} className="ml-auto p-1">
            <Bookmark size={22} className={isSaved?'fill-black dark:fill-white':''}/>
          </button>
        </div>
        <div className="text-sm font-semibold mt-1">{post.likes.length.toLocaleString()} likes</div>
        <div className="text-sm mt-1 leading-snug">
          <Link to={`/profile/${user?.username}`} className="font-semibold mr-2">{user?.username}</Link>
          <span>{post.caption}</span>
        </div>
        {post.comments.length>0 && (
          <button onClick={()=>setShowComments(v=>!v)} className="text-sm text-zinc-500 mt-1">View {post.comments.length>1? `all ${post.comments.length} comments`:'comment'}</button>
        )}
        {(showComments || post.comments.length>0) && (
          <div className="mt-1 space-y-1">
            {post.comments.slice(-3).map(c=>{
              const cu = users.find(u=>u.id===c.userId)
              const canDelete = c.userId===currentUserId || post.userId===currentUserId
              return (
                <div key={c.id} className="text-sm flex gap-2 group">
                  <span className="font-semibold shrink-0">{cu?.username}</span>
                  <span className="flex-1">{c.text}</span>
                  {canDelete && <button onClick={()=>deleteComment(post.id,c.id)} className="opacity-0 group-hover:opacity-100 text-xs text-zinc-400 hover:text-red-500 ml-2">Delete</button>}
                </div>
              )
            })}
          </div>
        )}
        <div className="text-[11px] text-zinc-500 uppercase tracking-wide mt-1">{formatTime(post.createdAt)} ago • <Link to={`/post/${post.id}`} className="underline">View post</Link></div>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
          <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && commentText.trim()){ addComment(post.id, commentText); setCommentText('')}}} placeholder="Add a comment..." className="flex-1 text-sm bg-transparent outline-none py-1" aria-label="Add comment"/>
          <button onClick={()=>{ if(commentText.trim()){ addComment(post.id, commentText); setCommentText('')}}} disabled={!commentText.trim()} className="text-sm font-semibold text-[#0095f6] disabled:opacity-40">Post</button>
        </div>
      </div>
    </article>
  )
}
