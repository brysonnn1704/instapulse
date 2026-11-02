import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Search, Send, ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatMsgTime } from '../utils/helpers'

function ConversationList({ onSelect }){
  const conversations = useStore(s=>s.conversations)
  const users = useStore(s=>s.users)
  const currentUserId = useStore(s=>s.currentUserId)
  const [q,setQ]=useState('')
  const filtered = useMemo(()=>{
    const lower=q.toLowerCase()
    return conversations.filter(c=>{
      const otherId = c.participants.find(id=> id!==currentUserId)
      const u = users.find(x=>x.id===otherId)
      return !q || u.username.toLowerCase().includes(lower) || u.name.toLowerCase().includes(lower)
    }).sort((a,b)=> {
      const at = a.messages[a.messages.length-1]?.createdAt||0
      const bt = b.messages[b.messages.length-1]?.createdAt||0
      return bt-at
    })
  },[conversations,q,users,currentUserId])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="font-bold text-lg">Messages</h2>
        <p className="text-xs text-zinc-500">Local only — not real delivery.</p>
        <div className="relative mt-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search conversations" className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#833AB4]" aria-label="Search conversations"/>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {filtered.map(c=>{
          const otherId = c.participants.find(id=> id!==currentUserId)
          const u = users.find(x=>x.id===otherId)
          const last = c.messages[c.messages.length-1]
          const unread = c.messages.filter(m=> m.senderId!==currentUserId && !m.read).length
          return (
            <button key={c.id} onClick={()=>onSelect(c.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left border-b border-zinc-100 dark:border-zinc-900/50">
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{u.username}</span>
                  {unread>0 && <span className="bg-[#0095f6] text-white text-[11px] px-1.5 py-0.5 rounded-full">{unread}</span>}
                  <span className="ml-auto text-xs text-zinc-500 shrink-0">{last? formatMsgTime(last.createdAt):''}</span>
                </div>
                <div className="text-xs text-zinc-500 truncate">{last? last.text : 'No messages yet'}</div>
              </div>
            </button>
          )
        })}
        {filtered.length===0 && <p className="text-sm text-zinc-500 text-center py-8">No conversations.</p>}
      </div>
    </div>
  )
}

function ChatView({ conversationId, onBack }){
  const conversations = useStore(s=>s.conversations)
  const users = useStore(s=>s.users)
  const currentUserId = useStore(s=>s.currentUserId)
  const sendMessage = useStore(s=>s.sendMessage)
  const markConversationRead = useStore(s=>s.markConversationRead)
  const c = conversations.find(x=>x.id===conversationId)
  const [text,setText]=useState('')
  const bottomRef=useRef(null)
  const otherId = c ? c.participants.find(id=> id!==currentUserId) : null
  const other = users.find(u=>u.id===otherId)

  useEffect(()=>{ if(c) markConversationRead(c.id) },[c?.id])
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[c?.messages.length])

  if(!c) return <div className="flex items-center justify-center h-full text-sm text-zinc-500 p-8">Select a conversation.</div>

  const doSend = ()=>{
    if(!text.trim()) return
    sendMessage(c.id, text)
    setText('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <button onClick={onBack} className="lg:hidden p-1" aria-label="Back"><ArrowLeft size={18}/></button>
        <Link to={`/profile/${other?.username}`} className="flex items-center gap-3 flex-1 min-w-0">
          <img src={other?.avatar} alt={other?.name} className="w-8 h-8 rounded-full"/>
          <div>
            <div className="text-sm font-semibold">{other?.username}</div>
            <div className="text-xs text-zinc-500">Active now • local</div>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-zinc-50 dark:bg-zinc-950/30">
        {c.messages.map(m=>{
          const isMe = m.senderId===currentUserId
          return (
            <div key={m.id} className={`flex ${isMe?'justify-end':'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${isMe?'bg-[#0095f6] text-white rounded-br-sm':'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-bl-sm'}`}>
                <div>{m.text}</div>
                <div className={`text-[11px] mt-1 ${isMe?'text-white/70':'text-zinc-500'}`}>{formatMsgTime(m.createdAt)}</div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef}/>
      </div>
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2 shrink-0 bg-white dark:bg-black">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') doSend()}} placeholder="Message..." className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#833AB4]" aria-label="Message input"/>
        <button onClick={doSend} disabled={!text.trim()} className="bg-accent-gradient text-white rounded-full p-2.5 disabled:opacity-40 shrink-0" aria-label="Send"><Send size={16}/></button>
      </div>
    </div>
  )
}

export default function Messages(){
  const navigate = useNavigate()
  const { id } = useParams()
  const [mobileSelected, setMobileSelected] = useState(id||null)
  useEffect(()=> setMobileSelected(id||null),[id])

  const handleSelect = (cid)=>{
    setMobileSelected(cid)
    navigate(`/messages/${cid}`, { replace: false })
  }
  const handleBack = ()=>{
    setMobileSelected(null)
    navigate('/messages')
  }

  // desktop: split; mobile: show either list or chat
  return (
    <div className="max-w-[935px] mx-auto w-full h-[calc(100dvh-56px)] lg:h-[calc(100vh-0px)] lg:pt-6 lg:px-4">
      <div className="h-full border border-zinc-200 dark:border-zinc-800 rounded-none lg:rounded-xl overflow-hidden bg-white dark:bg-black flex">
        {/* list pane */}
        <div className={`w-full lg:w-[340px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${mobileSelected ? 'hidden lg:flex' : 'flex'}`}>
          <ConversationList onSelect={handleSelect}/>
        </div>
        {/* chat pane */}
        <div className={`flex-1 min-w-0 flex-col ${mobileSelected ? 'flex' : 'hidden lg:flex'}`}>
          <ChatView conversationId={mobileSelected} onBack={handleBack}/>
        </div>
      </div>
    </div>
  )
}
