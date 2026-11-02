import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Stories(){
  const stories = useStore(s=>s.stories)
  const users = useStore(s=>s.users)
  const viewedStoryIds = useStore(s=>s.viewedStoryIds)
  const addViewedStory = useStore(s=>s.addViewedStory)
  const currentUserId = useStore(s=>s.currentUserId)
  const [activeIdx,setActiveIdx]=useState(null) // story index open
  const [paused,setPaused]=useState(false)
  const timerRef=useRef(null)
  const progressRef=useRef(0)

  const openStory = (idx)=>{
    setActiveIdx(idx)
    addViewedStory(stories[idx].id)
    progressRef.current=0
  }
  const close = ()=> setActiveIdx(null)
  const next = ()=> {
    if(activeIdx===null) return
    if(activeIdx < stories.length-1){ setActiveIdx(activeIdx+1); addViewedStory(stories[activeIdx+1].id); progressRef.current=0 }
    else close()
  }
  const prev = ()=> {
    if(activeIdx===null) return
    if(activeIdx>0){ setActiveIdx(activeIdx-1); progressRef.current=0 }
  }

  useEffect(()=>{
    if(activeIdx===null || paused) return
    timerRef.current = setInterval(()=>{ progressRef.current += 0.02; if(progressRef.current>=1){ next() } }, 100)
    return ()=> clearInterval(timerRef.current)
  },[activeIdx, paused])

  useEffect(()=>{
    if(activeIdx===null) return
    const h = (e)=>{
      if(e.key==='Escape') close()
      if(e.key==='ArrowRight') next()
      if(e.key==='ArrowLeft') prev()
      if(e.key===' ') { e.preventDefault(); setPaused(v=>!v) }
    }
    window.addEventListener('keydown', h)
    return ()=> window.removeEventListener('keydown', h)
  },[activeIdx])

  return (
    <>
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl lg:rounded-none lg:border-x-0 px-2 py-3 mb-4 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 snap-x snap-mandatory">
          {stories.map((s,idx)=>{
            const u = users.find(x=>x.id===s.userId)
            const isViewed = viewedStoryIds.includes(s.id)
            const isOwn = s.userId===currentUserId
            return (
              <button key={s.id} onClick={()=>openStory(idx)} className="flex flex-col items-center gap-1 shrink-0 snap-start w-[64px]">
                <div className={`w-[60px] h-[60px] rounded-full p-[3px] ${isViewed?'bg-zinc-300 dark:bg-zinc-700':'story-ring'}`}>
                  <div className="bg-white dark:bg-black rounded-full p-[2px] w-full h-full">
                    <img src={u?.avatar} alt={u?.name} className="w-full h-full rounded-full object-cover"/>
                  </div>
                </div>
                <span className="text-[11px] truncate w-full text-center leading-tight">{isOwn?'Your story':u?.username}</span>
              </button>
            )
          })}
        </div>
      </div>

      {activeIdx!==null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-[420px] h-[100dvh] max-h-[800px] bg-black overflow-hidden flex flex-col">
            {/* progress bars */}
            <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
              {stories.map((_,i)=>(
                <div key={i} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-none" style={{ width: i<activeIdx? '100%': i===activeIdx? `${progressRef.current*100}%`:'0%' }} />
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-3 right-3 flex items-center gap-3 z-10 text-white">
              {(()=>{ const u=users.find(x=>x.id===stories[activeIdx].userId); return (
                <>
                  <img src={u?.avatar} alt="" className="w-8 h-8 rounded-full"/>
                  <span className="text-sm font-semibold">{u?.username}</span>
                  <span className="text-xs opacity-70">now</span>
                </>
              )})()}
              <div className="ml-auto flex items-center gap-2">
                <button onClick={()=>setPaused(v=>!v)} className="p-2 bg-white/10 rounded-full" aria-label={paused?'Play':'Pause'}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>
                <button onClick={close} className="p-2 bg-white/10 rounded-full" aria-label="Close"><X size={16}/></button>
              </div>
            </div>
            <img src={stories[activeIdx].image} alt="Story" className="flex-1 w-full object-contain bg-black" onClick={()=>{ if(!paused) next() }} />
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white disabled:opacity-30" disabled={activeIdx===0} aria-label="Previous"><ChevronLeft size={22}/></button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white" aria-label="Next"><ChevronRight size={22}/></button>
            {/* tap zones for mobile */}
            <button onClick={prev} className="absolute left-0 top-[80px] bottom-[80px] w-1/3" aria-label="Prev tap"/>
            <button onClick={next} className="absolute right-0 top-[80px] bottom-[80px] w-1/3" aria-label="Next tap"/>
          </div>
        </div>
      )}
    </>
  )
}
