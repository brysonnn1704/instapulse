import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Grid3x3, Bookmark, Tag, Settings, Edit3, X, MessageCircle } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Profile(){
  const { username } = useParams()
  const users = useStore(s=>s.users)
  const posts = useStore(s=>s.posts)
  const saved = useStore(s=>s.saved)
  const followingIds = useStore(s=>s.followingIds)
  const currentUserId = useStore(s=>s.currentUserId)
  const followToggle = useStore(s=>s.followToggle)
  const ensureConversation = useStore(s=>s.ensureConversation)
  const updateProfile = useStore(s=>s.updateProfile)
  const [tab,setTab]=useState('grid') // grid | saved | tagged
  const [editOpen,setEditOpen]=useState(false)
  const [form,setForm]=useState({ name:'', username:'', bio:'' })

  const profileUser = useMemo(()=> users.find(u=>u.username===username),[users, username])
  const isOwn = profileUser?.id===currentUserId
  const isFollowing = profileUser && followingIds.includes(profileUser.id)

  const userPosts = useMemo(()=> profileUser ? posts.filter(p=> p.userId===profileUser.id) : [],[posts, profileUser])
  const savedPosts = useMemo(()=> posts.filter(p=> saved.includes(p.id)),[posts, saved])

  if(!profileUser){
    return <div className="max-w-[935px] mx-auto px-4 pt-10 text-center"><p className="font-semibold">User not found</p><Link to="/" className="text-sm text-[#0095f6]">Go home</Link></div>
  }

  const openEdit = ()=>{
    setForm({ name: users.find(u=>u.id===currentUserId)?.name||'', username: users.find(u=>u.id===currentUserId)?.username||'', bio: users.find(u=>u.id===currentUserId)?.bio||'' })
    setEditOpen(true)
  }
  const saveEdit = ()=>{
    if(!form.username.trim() || !form.name.trim()){ alert('Name and username required'); return }
    // uniqueness check
    if(users.some(u=> u.username===form.username && u.id!==currentUserId)){ alert('Username taken'); return }
    updateProfile({ name: form.name.trim(), username: form.username.trim(), bio: form.bio })
    setEditOpen(false)
  }

  const stats = {
    posts: userPosts.length,
    followers: isOwn ? users.filter(u=> followingIds.includes(profileUser.id) ? false : false).length : 0, // simplified: count followers as users who follow this profile not tracked; fake count
    following: isOwn ? followingIds.length : 3,
  }
  // For non-own, followers/following fake but consistent
  const followersCount = isOwn ? 128 : Math.floor( (profileUser.username.length*13+42) % 200 + 20)
  const followingCount = isOwn ? followingIds.length : Math.floor( (profileUser.username.length*7) % 80 + 10)

  return (
    <div className="max-w-[935px] mx-auto px-4 pt-6 pb-8 w-full">
      {/* header */}
      <div className="flex gap-6 md:gap-10 items-start">
        <img src={profileUser.avatar} alt={profileUser.name} className="w-[77px] h-[77px] md:w-[150px] md:h-[150px] rounded-full object-cover shrink-0"/>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-xl font-light">{profileUser.username}</h1>
            {isOwn ? (
              <>
                <button onClick={openEdit} className="px-4 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold flex items-center gap-1"><Edit3 size={14}/> Edit profile</button>
                <Link to="/settings" className="px-4 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold flex items-center gap-1"><Settings size={14}/> Settings</Link>
              </>
            ) : (
              <>
                <button onClick={()=>followToggle(profileUser.id)} className={`px-6 py-1.5 rounded-lg text-sm font-semibold ${isFollowing?'bg-zinc-100 dark:bg-zinc-800':'bg-accent-gradient text-white'}`}>{isFollowing?'Following':'Follow'}</button>
                <Link to={`/messages/${ensureConversation(profileUser.id)}`} onClick={()=>ensureConversation(profileUser.id)} className="px-4 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold flex items-center gap-1"><MessageCircle size={14}/> Message</Link>
              </>
            )}
          </div>
          <div className="hidden md:flex gap-8 mb-3">
            <span className="text-sm"><b>{userPosts.length}</b> posts</span>
            <span className="text-sm"><b>{followersCount}</b> followers</span>
            <span className="text-sm"><b>{followingCount}</b> following</span>
          </div>
          <div className="text-sm">
            <div className="font-semibold">{profileUser.name} {profileUser.verified && <span className="text-[#0095f6]">✓</span>}</div>
            <div className="whitespace-pre-wrap leading-snug">{profileUser.bio}</div>
          </div>
        </div>
      </div>
      <div className="flex md:hidden gap-6 border-t border-zinc-200 dark:border-zinc-800 mt-6">
        <div className="flex-1 text-center py-3"><div className="font-semibold text-sm">{userPosts.length}</div><div className="text-xs text-zinc-500">posts</div></div>
        <div className="flex-1 text-center py-3 border-x border-zinc-200 dark:border-zinc-800"><div className="font-semibold text-sm">{followersCount}</div><div className="text-xs text-zinc-500">followers</div></div>
        <div className="flex-1 text-center py-3"><div className="font-semibold text-sm">{followingCount}</div><div className="text-xs text-zinc-500">following</div></div>
      </div>

      {/* tabs */}
      <div className="flex justify-center gap-8 border-t border-zinc-200 dark:border-zinc-800 mt-6">
        <button onClick={()=>setTab('grid')} className={`flex items-center gap-1 py-3 text-xs font-semibold tracking-widest border-t ${tab==='grid'?'border-black dark:border-white -mt-px': 'border-transparent text-zinc-500'}`}><Grid3x3 size={14}/> POSTS</button>
        <button onClick={()=>setTab('saved')} className={`flex items-center gap-1 py-3 text-xs font-semibold tracking-widest border-t ${tab==='saved'?'border-black dark:border-white -mt-px': 'border-transparent text-zinc-500'}`}><Bookmark size={14}/> SAVED</button>
        <button onClick={()=>setTab('tagged')} className={`flex items-center gap-1 py-3 text-xs font-semibold tracking-widest border-t ${tab==='tagged'?'border-black dark:border-white -mt-px': 'border-transparent text-zinc-500'}`}><Tag size={14}/> TAGGED</button>
      </div>

      {tab==='grid' && (
        userPosts.length===0 ? <div className="text-center py-16 border border-dashed rounded-xl text-sm text-zinc-500">No posts yet.</div> :
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {userPosts.map(p=>(
            <Link key={p.id} to={`/post/${p.id}`} className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900 group relative">
              <img src={p.image} alt={p.caption} loading="lazy" className="w-full h-full object-cover group-hover:opacity-90"/>
            </Link>
          ))}
        </div>
      )}
      {tab==='saved' && (
        savedPosts.length===0 ? <div className="text-center py-16 border border-dashed rounded-xl text-sm text-zinc-500">No saved posts.</div> :
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {savedPosts.map(p=>(
            <Link key={p.id} to={`/post/${p.id}`} className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <img src={p.image} alt={p.caption} loading="lazy" className="w-full h-full object-cover"/>
            </Link>
          ))}
        </div>
      )}
      {tab==='tagged' && (
        <div className="text-center py-16 border border-dashed rounded-xl">
          <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center mx-auto mb-3"><Tag size={28}/></div>
          <p className="font-light text-xl">Photos of you</p>
          <p className="text-sm text-zinc-500 mt-1">When people tag you, you'll see it here.</p>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setEditOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative bg-white dark:bg-zinc-900 rounded-xl w-full max-w-[420px] p-6">
            <button onClick={()=>setEditOpen(false)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Close"><X size={18}/></button>
            <h2 className="font-semibold mb-4">Edit profile</h2>
            <div className="space-y-3">
              <label className="block text-sm">Name<input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="mt-1 w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-[#833AB4]"/></label>
              <label className="block text-sm">Username<input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} className="mt-1 w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-[#833AB4]"/></label>
              <label className="block text-sm">Bio<textarea value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} rows={3} className="mt-1 w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-[#833AB4]"/></label>
              <button onClick={saveEdit} className="w-full bg-accent-gradient text-white py-2 rounded-lg font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
