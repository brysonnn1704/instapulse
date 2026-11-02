import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatTime } from '../utils/helpers'

export default function Notifications(){
  const notifications = useStore(s=>s.notifications)
  const users = useStore(s=>s.users)
  const markNotificationRead = useStore(s=>s.markNotificationRead)
  const markAllNotificationsRead = useStore(s=>s.markAllNotificationsRead)
  const [filter,setFilter]=useState('all') // all | unread

  const sorted = [...notifications].sort((a,b)=> b.createdAt - a.createdAt)
  const display = filter==='unread' ? sorted.filter(n=>!n.read) : sorted
  const unreadCount = notifications.filter(n=>!n.read).length

  const textFor = (n)=>{
    const u = users.find(x=>x.id===n.userId)
    if(n.type==='like') return `${u?.username} liked your post.`
    if(n.type==='comment') return `${u?.username} commented: ${n.text||''}`
    if(n.type==='follow') return `${u?.username} started following you.`
    return 'Notification'
  }
  const targetFor = (n)=>{
    if(n.postId) return `/post/${n.postId}`
    if(n.type==='follow') return `/profile/${users.find(u=>u.id===n.userId)?.username}`
    return '/'
  }

  return (
    <div className="max-w-[630px] mx-auto px-4 pt-6 pb-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Notifications</h1>
        {unreadCount>0 && <button onClick={markAllNotificationsRead} className="text-sm font-semibold text-[#0095f6]">Mark all read</button>}
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${filter==='all'?'bg-black text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-800'}`}>All</button>
        <button onClick={()=>setFilter('unread')} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${filter==='unread'?'bg-black text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-800'}`}>Unread {unreadCount>0 && `(${unreadCount})`}</button>
      </div>
      <div className="space-y-2">
        {display.length===0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
            <p className="text-sm text-zinc-500">No notifications.</p>
          </div>
        ) : display.map(n=>{
          const u = users.find(x=>x.id===n.userId)
          const target = targetFor(n)
          return (
            <Link key={n.id} to={target} onClick={()=>markNotificationRead(n.id)} className={`flex items-center gap-3 p-3 rounded-xl border ${n.read?'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800':'bg-[#eff6ff] dark:bg-zinc-800 border-[#bfdbfe] dark:border-zinc-700'} hover:opacity-90`}>
              <img src={u?.avatar} alt={u?.name} className="w-10 h-10 rounded-full object-cover shrink-0"/>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">{textFor(n)}</p>
                <p className="text-xs text-zinc-500">{formatTime(n.createdAt)} ago</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#0095f6] shrink-0"/>}
              {n.postId && <img src={useStore.getState().posts.find(p=>p.id===n.postId)?.image} alt="" className="w-10 h-10 rounded object-cover shrink-0 hidden sm:block"/>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
