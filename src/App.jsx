import { Suspense, lazy, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CreateModal from './components/CreateModal'

const Feed = lazy(()=> import('./pages/Feed'))
const Explore = lazy(()=> import('./pages/Explore'))
const Reels = lazy(()=> import('./pages/Reels'))
const Messages = lazy(()=> import('./pages/Messages'))
const Notifications = lazy(()=> import('./pages/Notifications'))
const Profile = lazy(()=> import('./pages/Profile'))
const PostDetail = lazy(()=> import('./pages/PostDetail'))
const Saved = lazy(()=> import('./pages/Saved'))
const Settings = lazy(()=> import('./pages/Settings'))
const NotFound = lazy(()=> import('./pages/NotFound'))

function Fallback(){
  return <div className="flex items-center justify-center py-16 text-sm text-zinc-500">Loading…</div>
}

export default function App(){
  const [createOpen, setCreateOpen] = useState(false)

  // global Escape already handled per modal; no extra listener needed

  return (
    <BrowserRouter>
      <Layout onCreate={()=> setCreateOpen(true)}>
        <Suspense fallback={<Fallback/>}>
          <Routes>
            <Route path="/" element={<Feed/>} />
            <Route path="/explore" element={<Explore/>} />
            <Route path="/reels" element={<Reels/>} />
            <Route path="/messages" element={<Messages/>} />
            <Route path="/messages/:id" element={<Messages/>} />
            <Route path="/notifications" element={<Notifications/>} />
            <Route path="/profile/:username" element={<Profile/>} />
            <Route path="/post/:id" element={<PostDetail/>} />
            <Route path="/saved" element={<Saved/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Suspense>
      </Layout>
      <CreateModal open={createOpen} onClose={()=> setCreateOpen(false)} />
    </BrowserRouter>
  )
}
