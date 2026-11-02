import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, Compass, Clapperboard, MessageCircle, Heart, SquarePlus, User, Bookmark, Settings } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useState, useEffect, useRef } from 'react'

function ThemeEffect(){
  const theme = useStore(s=>s.theme)
  useEffect(()=>{
    const root = document.documentElement
    const apply = (t)=>{
      if(t==='system'){
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', prefersDark)
      } else {
        root.classList.toggle('dark', t==='dark')
      }
    }
    apply(theme)
    if(theme==='system'){
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const h = ()=> apply('system')
      mq.addEventListener('change', h)
      return ()=> mq.removeEventListener('change', h)
    }
  },[theme])
  return null
}

function LeftNav({ onCreate }){
  const currentUserId = useStore(s=>s.currentUserId)
  const users = useStore(s=>s.users)
  const me = users.find(u=>u.id===currentUserId)
  const notifications = useStore(s=>s.notifications)
  const unread = notifications.filter(n=>!n.read).length
  const loc = useLocation()
  const linkCls = ({isActive})=> `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] transition ${isActive?'bg-zinc-100 dark:bg-zinc-900 font-semibold':'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`
  return (
    <aside className="hidden lg:flex flex-col w-[245px] xl:w-[275px] border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 p-3 shrink-0">
      <div className="px-3 py-4 mb-2">
        <span className="text-[28px] font-bold tracking-tight text-accent-gradient">InstaPulse</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/" className={linkCls}><Home size={22}/> Home</NavLink>
        <NavLink to="/explore" className={linkCls}><Compass size={22}/> Explore</NavLink>
        <NavLink to="/reels" className={linkCls}><Clapperboard size={22}/> Reels</NavLink>
        <NavLink to="/messages" className={linkCls}><MessageCircle size={22}/> Messages</NavLink>
        <NavLink to="/notifications" className={linkCls}><Heart size={22}/> Notifications {unread>0 && <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unread}</span>}</NavLink>
        <button onClick={onCreate} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left"><SquarePlus size={22}/> Create</button>
        <NavLink to={`/profile/${me?.username}`} className={linkCls}><img src={me?.avatar} alt={me?.name} className="w-[22px] h-[22px] rounded-full object-cover"/>{me?.username}</NavLink>
        <NavLink to="/saved" className={linkCls}><Bookmark size={22}/> Saved</NavLink>
        <NavLink to="/settings" className={linkCls}><Settings size={22}/> Settings</NavLink>
      </nav>
      <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <img src={me?.avatar} alt="" className="w-8 h-8 rounded-full"/>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{me?.username}</div>
            <div className="text-xs text-zinc-500 truncate">{me?.name}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function BottomNav({ onCreate }){
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 z-30 flex justify-around items-center h-[52px] px-1 safe-bottom">
      <NavLink to="/" className={({isActive})=>`p-2 ${isActive?'opacity-100':'opacity-60'}`} aria-label="Home"><Home size={22}/></NavLink>
      <NavLink to="/explore" className={({isActive})=>`p-2 ${isActive?'opacity-100':'opacity-60'}`} aria-label="Explore"><Compass size={22}/></NavLink>
      <NavLink to="/reels" className={({isActive})=>`p-2 ${isActive?'opacity-100':'opacity-60'}`} aria-label="Reels"><Clapperboard size={22}/></NavLink>
      <button onClick={onCreate} className="p-2 opacity-60" aria-label="Create"><SquarePlus size={22}/></button>
      <NavLink to="/messages" className={({isActive})=>`p-2 ${isActive?'opacity-100':'opacity-60'}`} aria-label="Messages"><MessageCircle size={22}/></NavLink>
      <NavLink to={`/profile/${useStore.getState().users.find(u=>u.id===useStore.getState().currentUserId)?.username}`} className="p-2 opacity-60" aria-label="Profile"><User size={22}/></NavLink>
    </nav>
  )
}

function TopHeader({ onSearch, onCreate }){
  const loc = useLocation()
  const isHome = loc.pathname==='/'
  const searchQ = useRef(null)
  const navigate = useNavigate()
  const [q,setQ]=useState('')
  // hide on some routes? show everywhere mobile
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 px-3 h-[56px]">
      <span className="font-bold text-[22px] tracking-tight text-accent-gradient shrink-0">InstaPulse</span>
      <div className="flex-1 relative ml-2">
        <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"/>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ navigate(`/explore?q=${encodeURIComponent(q)}`); setQ('')}}} placeholder="Search" className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#833AB4]" aria-label="Search"/>
      </div>
      <button onClick={()=>navigate('/notifications')} className="p-2 shrink-0" aria-label="Notifications"><Heart size={20}/></button>
      <button onClick={()=>navigate('/messages')} className="p-2 shrink-0" aria-label="Messages"><MessageCircle size={20}/></button>
    </header>
  )
}

function RightSuggestions(){
  const users = useStore(s=>s.users)
  const followingIds = useStore(s=>s.followingIds)
  const followToggle = useStore(s=>s.followToggle)
  const currentUserId = useStore(s=>s.currentUserId)
  const [showAll, setShowAll] = useState(false)
  const allSuggestions = users.filter(u=> u.id!==currentUserId && !followingIds.includes(u.id))
  const suggestions = showAll ? allSuggestions : allSuggestions.slice(0,5)
  const me = users.find(u=>u.id===currentUserId)
  const loc = useLocation()
  const navigate = useNavigate()
  const showOn = ['/','/explore']
  const show = showOn.some(p=> loc.pathname===p || loc.pathname.startsWith('/explore'))
  if(!show) return <div className="hidden xl:block w-[320px] shrink-0" />
  return (
    <aside className="hidden xl:block w-[320px] shrink-0 pl-6 pt-6">
      <div className="sticky top-6 space-y-6">
        <div className="flex items-center gap-3">
          <img src={me?.avatar} alt={me?.name} className="w-10 h-10 rounded-full"/>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{me?.username}</div>
            <div className="text-xs text-zinc-500 truncate">{me?.name}</div>
          </div>
          <button onClick={()=>navigate(`/profile/${me?.username}`)} className="text-xs font-semibold text-[#0095f6]">Switch</button>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-zinc-500">Suggested for you</span>
            <button onClick={()=>setShowAll(v=>!v)} className="text-xs font-semibold hover:text-zinc-600 dark:hover:text-zinc-300">{showAll ? 'Show less' : 'See All'}</button>
          </div>
          <div className="space-y-3">
            {suggestions.map(u=>(
              <div key={u.id} className="flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover"/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{u.username}</div>
                  <div className="text-xs text-zinc-500 truncate">Suggested</div>
                </div>
                <button onClick={()=>followToggle(u.id)} className="text-xs font-semibold text-[#0095f6] hover:text-[#00376b]">Follow</button>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-zinc-400 leading-relaxed">
          About • Help • Press • API • Jobs • Privacy • Terms<br/>© 2026 InstaPulse
        </div>
      </div>
    </aside>
  )
}

export default function Layout({ children, onCreate }){
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col lg:flex-row max-w-[1920px] mx-auto">
      <ThemeEffect/>
      <LeftNav onCreate={onCreate}/>
      <div className="flex-1 min-w-0 flex flex-col">
        <TopHeader onCreate={onCreate}/>
        <div className="flex flex-1 min-w-0">
          <main className="flex-1 min-w-0 max-w-[935px] mx-auto w-full pb-[64px] lg:pb-0">
            {children}
          </main>
          <RightSuggestions/>
        </div>
      </div>
      <BottomNav onCreate={onCreate}/>
    </div>
  )
}
