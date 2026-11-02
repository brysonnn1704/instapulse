import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Heart, MessageCircle, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const categories = ['All','Travel','Design','Food','Art','Nature','Style']

function matchesCategory(post, cat){
  if(cat==='All') return true
  const caption = post.caption.toLowerCase()
  const map = {
    Travel: ['travel','japan','tokyo','kyoto','beach','hike'],
    Design: ['design','workspace','poster'],
    Food: ['food','ramen','matcha','mochi','cook'],
    Art: ['art','digital','dreamscape','celestial','paint'],
    Nature: ['nature','wildlife','safari','plants','ocean','beach'],
    Style: ['style','ootd','minimal','fashion','layers'],
  }
  const keys = map[cat]||[]
  return keys.some(k=> caption.includes(k))
}

export default function Explore(){
  const posts = useStore(s=>s.posts)
  const users = useStore(s=>s.users)
  const exploreCategory = useStore(s=>s.exploreCategory)
  const setExploreCategory = useStore(s=>s.setExploreCategory)
  const addRecentSearch = useStore(s=>s.addRecentSearch)
  const recentSearches = useStore(s=>s.recentSearches)
  const removeRecentSearch = useStore(s=>s.removeRecentSearch)
  const clearRecentSearches = useStore(s=>s.clearRecentSearches)
  const hiddenPostIds = useStore(s=>s.hiddenPostIds)
  const reportedPostIds = useStore(s=>s.reportedPostIds)

  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [searchInput, setSearchInput] = useState(q)
  const [visibleCount, setVisibleCount] = useState(18)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(()=>{ setSearchInput(q) },[q])
  useEffect(()=>{
    const h=(e)=>{ if(e.key==='Escape') setSelectedPost(null)}
    window.addEventListener('keydown', h)
    return ()=> window.removeEventListener('keydown', h)
  },[])

  const base = useMemo(()=> posts.filter(p=> !hiddenPostIds.includes(p.id) && !reportedPostIds.includes(p.id)), [posts, hiddenPostIds, reportedPostIds])

  const filtered = useMemo(()=>{
    let arr = base
    if(q){
      const lower = q.toLowerCase()
      const isHashtag = lower.startsWith('#')
      const term = isHashtag ? lower : lower
      arr = arr.filter(p=>{
        const user = users.find(u=>u.id===p.userId)
        const caption = p.caption.toLowerCase()
        const username = user?.username.toLowerCase()||''
        const name = user?.name.toLowerCase()||''
        if(isHashtag) return caption.includes(term)
        return caption.includes(term) || username.includes(term) || name.includes(term)
      })
    }
    arr = arr.filter(p=> matchesCategory(p, exploreCategory))
    return arr
  },[base, q, exploreCategory, users])

  const displayed = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  const doSearch = (val)=>{
    const v = val.trim()
    if(v){
      addRecentSearch(v)
      setParams({ q: v })
    } else {
      setParams({})
    }
  }

  const onSubmit = (e)=>{
    e.preventDefault()
    doSearch(searchInput)
  }
  const onRecentClick = (r)=>{
    setSearchInput(r)
    doSearch(r)
  }

  return (
    <div className="max-w-[935px] mx-auto px-2 lg:px-4 pt-4 pb-8 w-full">
      <form onSubmit={onSubmit} className="relative max-w-[480px] mx-auto mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
        <input value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="Search users, captions, #hashtags" className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#833AB4]" aria-label="Search"/>
        {searchInput && <button type="button" onClick={()=>{setSearchInput(''); setParams({})}} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="Clear"><X size={16}/></button>}
      </form>

      {!q && recentSearches.length>0 && (
        <div className="max-w-[480px] mx-auto mb-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Recent searches</span>
            <button onClick={clearRecentSearches} className="text-xs font-semibold text-[#0095f6]">Clear all</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(r=>(
              <span key={r} className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1 text-sm">
                <button onClick={()=>onRecentClick(r)} className="hover:underline">{r}</button>
                <button onClick={()=>removeRecentSearch(r)} aria-label={`Remove ${r}`} className="ml-1 p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"><X size={12}/></button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-2">
        {categories.map(c=>(
          <button key={c} onClick={()=>setExploreCategory(c)} className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border ${exploreCategory===c?'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white':'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>{c}</button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
          <p className="font-semibold">No results</p>
          <p className="text-sm text-zinc-500 mt-1">Try another search or category.</p>
        </div>
      ) : (
        <>
          <div className="masonry">
            {displayed.map(p=>{
              const user = users.find(u=>u.id===p.userId)
              return (
                <button key={p.id} onClick={()=>setSelectedPost(p)} className="masonry-item relative group w-full text-left overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <img src={p.image} alt={p.caption||`Post by ${user?.username}`} loading="lazy" className="w-full object-cover" onError={e=>{e.currentTarget.src=`https://picsum.photos/seed/fallback${p.id}/600/600`}}/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 text-white text-sm font-semibold">
                    <span className="flex items-center gap-1"><Heart size={16} className="fill-white"/>{p.likes.length}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={16} className="fill-white"/>{p.comments.length}</span>
                  </div>
                </button>
              )
            })}
          </div>
          {hasMore && <div className="flex justify-center mt-6"><button onClick={()=>setVisibleCount(v=>v+12)} className="px-6 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700">Load More</button></div>}
        </>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={()=>setSelectedPost(null)} />
          <div role="dialog" aria-modal="true" className="relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden w-full max-w-[900px] max-h-[90vh] flex flex-col lg:flex-row">
            <button onClick={()=>setSelectedPost(null)} className="absolute top-3 right-3 z-10 p-2 bg-black/60 rounded-full text-white" aria-label="Close"><X size={16}/></button>
            <div className="flex-1 bg-black flex items-center justify-center min-h-[300px]">
              <img src={selectedPost.image} alt={selectedPost.caption} className="max-h-[80vh] w-auto object-contain"/>
            </div>
            <div className="w-full lg:w-[340px] shrink-0 p-4 flex flex-col gap-3 overflow-auto">
              {(()=>{ const u=users.find(x=>x.id===selectedPost.userId); return (
                <div className="flex items-center gap-3">
                  <img src={u?.avatar} alt={u?.name} className="w-8 h-8 rounded-full"/>
                  <span className="font-semibold text-sm">{u?.username}</span>
                </div>
              )})()}
              <p className="text-sm leading-snug">{selectedPost.caption}</p>
              <div className="text-xs text-zinc-500">{selectedPost.likes.length} likes • {selectedPost.comments.length} comments</div>
              <Link to={`/post/${selectedPost.id}`} onClick={()=>setSelectedPost(null)} className="text-sm font-semibold text-[#0095f6]">Open post →</Link>
              <Link to={`/profile/${users.find(u=>u.id===selectedPost.userId)?.username}`} onClick={()=>setSelectedPost(null)} className="text-sm font-semibold">View profile →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
