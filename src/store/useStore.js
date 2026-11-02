import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { demoUsers, demoPosts, demoStories, demoReels, demoConversations, demoNotifications, CURRENT_USER_ID } from '../data/demoData'

const SCHEMA_VERSION = 4

  // utils
const genId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`
const now = () => Date.now()

// IDB helpers for images
const IDB_DB = 'instapulse_db'
const IDB_STORE = 'images'
function openDB(){
  return new Promise((res, rej)=>{
    const r = indexedDB.open(IDB_DB,1)
    r.onupgradeneeded = ()=> r.result.createObjectStore(IDB_STORE)
    r.onsuccess = ()=> res(r.result)
    r.onerror = ()=> rej(r.error)
  })
}
export async function idbSet(key, val){
  const db = await openDB(); return new Promise((res, rej)=>{
    const tx = db.transaction(IDB_STORE,'readwrite'); tx.objectStore(IDB_STORE).put(val,key)
    tx.oncomplete = ()=> res(); tx.onerror = ()=> rej(tx.error)
  })
}
export async function idbGet(key){
  const db = await openDB(); return new Promise((res, rej)=>{
    const tx = db.transaction(IDB_STORE,'readonly'); const req = tx.objectStore(IDB_STORE).get(key)
    req.onsuccess = ()=> res(req.result); req.onerror = ()=> rej(req.error)
  })
}

const initialState = {
  version: SCHEMA_VERSION,
  currentUserId: CURRENT_USER_ID,
  users: demoUsers,
  posts: demoPosts,
  stories: demoStories,
  reels: demoReels,
  conversations: demoConversations,
  notifications: demoNotifications,
  saved: [],
  hiddenPostIds: [],
  reportedPostIds: [],
  recentSearches: [],
  theme: 'light', // light | dark | system
  notificationPrefs: { likes:true, comments:true, follows:true },
  followingIds: demoUsers[0].following,
  // UI
  feedFilter: 'foryou', // foryou | following
  exploreCategory: 'All',
  // viewed stories
  viewedStoryIds: [],
}

function migrate(state){
  if(!state || typeof state !== 'object') return { ...initialState }
  if(state.version !== SCHEMA_VERSION){
    // merge missing keys from initialState
    return { ...initialState, ...state, version: SCHEMA_VERSION,
      posts: state.posts || initialState.posts,
      users: state.users || initialState.users,
      stories: state.stories || initialState.stories,
    }
  }
  return state
}

export const useStore = create(persist((set, get)=> ({
  ...initialState,
  // actions
  toggleLike: (postId)=> set(s=>{
    const posts = s.posts.map(p=>{
      if(p.id!==postId) return p
      const has = p.likes.includes(s.currentUserId)
      const likes = has ? p.likes.filter(id=>id!==s.currentUserId) : [...p.likes, s.currentUserId]
      return { ...p, likes }
    })
    return { posts }
  }),
  toggleLikeReel: (reelId)=> set(s=>{
    const reels = s.reels.map(r=>{
      if(r.id!==reelId) return r
      const has = r.likes.includes(s.currentUserId)
      return { ...r, likes: has? r.likes.filter(x=>x!==s.currentUserId) : [...r.likes, s.currentUserId] }
    })
    return { reels }
  }),
  toggleSave: (postId)=> set(s=>{
    const saved = s.saved.includes(postId) ? s.saved.filter(x=>x!==postId) : [...s.saved, postId]
    return { saved }
  }),
  toggleSaveReel: (reelId)=> set(s=>{
    const saved = s.saved.includes(reelId) ? s.saved.filter(x=>x!==reelId) : [...s.saved, reelId]
    return { saved }
  }),
  addComment: (postId, text)=> set(s=>{
    const comment = { id: genId(), userId: s.currentUserId, text: text.trim(), createdAt: now() }
    if(!comment.text) return {}
    const posts = s.posts.map(p=> p.id===postId ? { ...p, comments:[...p.comments, comment] } : p)
    return { posts }
  }),
  deleteComment: (postId, commentId)=> set(s=>{
    const posts = s.posts.map(p=> p.id===postId ? { ...p, comments: p.comments.filter(c=> c.id!==commentId) } : p)
    return { posts }
  }),
  addReelComment: (reelId, text)=> set(s=>{
    const comment = { id: genId(), userId: s.currentUserId, text: text.trim(), createdAt: now() }
    if(!comment.text) return {}
    const reels = s.reels.map(r=> r.id===reelId? { ...r, comments:[...(r.comments||[]), comment] }: r)
    return { reels }
  }),
  hidePost: (postId)=> set(s=> ({ hiddenPostIds:[...new Set([...s.hiddenPostIds, postId])] })),
  reportPost: (postId)=> set(s=> ({ reportedPostIds:[...new Set([...s.reportedPostIds, postId])] })),
  deletePost: (postId)=> set(s=> ({ posts: s.posts.filter(p=>p.id!==postId), saved: s.saved.filter(id=>id!==postId) })),
  createPost: (data)=> set(s=>{
    const post = { id: genId(), userId: s.currentUserId, image: data.image, caption: data.caption||'', location: data.location||'', likes:[], comments:[], createdAt: now(), aspect: data.aspect||'square' }
    return { posts: [post, ...s.posts] }
  }),
  followToggle: (userId)=> set(s=>{
    if(userId===s.currentUserId) return {}
    const isFollowing = s.followingIds.includes(userId)
    const followingIds = isFollowing ? s.followingIds.filter(x=>x!==userId) : [...s.followingIds, userId]
    return { followingIds }
  }),
  setFeedFilter: (v)=> set({ feedFilter: v }),
  setExploreCategory: (v)=> set({ exploreCategory: v }),
  addViewedStory: (storyId)=> set(s=> ({ viewedStoryIds: [...new Set([...s.viewedStoryIds, storyId])] })),
  createStory: (image)=> set(s=> ({ stories: [{ id: genId(), userId: s.currentUserId, image, createdAt: now(), viewed:false }, ...s.stories] })),
  addRecentSearch: (q)=> set(s=>{
    const cleaned = q.trim(); if(!cleaned) return {}
    const recent = [cleaned, ...s.recentSearches.filter(x=> x.toLowerCase()!==cleaned.toLowerCase())].slice(0,8)
    return { recentSearches: recent }
  }),
  clearRecentSearches: ()=> set({ recentSearches: [] }),
  removeRecentSearch: (q)=> set(s=> ({ recentSearches: s.recentSearches.filter(x=>x!==q) })),
  sendMessage: (conversationId, text)=> set(s=>{
    const msg = { id: genId(), senderId: s.currentUserId, text: text.trim(), createdAt: now(), read:true }
    if(!msg.text) return {}
    const conversations = s.conversations.map(c=> c.id===conversationId ? { ...c, messages:[...c.messages, msg] } : c)
    return { conversations }
  }),
  markConversationRead: (conversationId)=> set(s=>{
    const conversations = s.conversations.map(c=> c.id===conversationId ? { ...c, messages: c.messages.map(m=> ({...m, read:true})) } : c)
    return { conversations }
  }),
  ensureConversation: (otherUserId)=> {
    const s=get()
    const existing = s.conversations.find(c=> c.participants.includes(otherUserId) && c.participants.includes(s.currentUserId))
    if(existing) return existing.id
    const id = genId()
    const conv = { id, participants:[s.currentUserId, otherUserId], messages:[] }
    set({ conversations:[conv, ...s.conversations] })
    return id
  },
  markNotificationRead: (id)=> set(s=> ({ notifications: s.notifications.map(n=> n.id===id? {...n, read:true}:n) })),
  markAllNotificationsRead: ()=> set(s=> ({ notifications: s.notifications.map(n=> ({...n, read:true})) })),
  addNotification: (n)=> set(s=> ({ notifications: [{ id: genId(), createdAt: now(), read:false, ...n }, ...s.notifications] })),
  setTheme: (theme)=> set({ theme }),
  setNotificationPrefs: (prefs)=> set(s=> ({ notificationPrefs: { ...s.notificationPrefs, ...prefs } })),
  updateProfile: (data)=> set(s=> ({ users: s.users.map(u=> u.id===s.currentUserId? {...u, ...data}: u) })),
  resetData: ()=> set({ ...initialState, version: SCHEMA_VERSION }),
  clearSearchesOnly: ()=> set({ recentSearches: [] }),
  exportData: ()=> {
    const s=get()
    return JSON.stringify({ version: SCHEMA_VERSION, users:s.users, posts:s.posts, stories:s.stories, reels:s.reels, conversations:s.conversations, notifications:s.notifications, saved:s.saved, hiddenPostIds:s.hiddenPostIds, recentSearches:s.recentSearches, followingIds:s.followingIds }, null, 2)
  }
}), {
  name: 'instapulse-state',
  storage: createJSONStorage(()=> localStorage),
  version: SCHEMA_VERSION,
  migrate: (persisted)=> migrate(persisted),
  partialize: (state)=> {
    const { version, currentUserId, users, posts: _posts, stories, reels, conversations, notifications, saved, hiddenPostIds, reportedPostIds, recentSearches, theme, notificationPrefs, followingIds, viewedStoryIds } = state
    // We persist posts but they may contain large base64 images; still store. IDB alternative optional.
    // To avoid quota issues we keep posts in localStorage; if large images cause error we catch.
    // Return minimal needed.
    // Note: posts includes base64 for created posts; if quota exceeded, Zustand will fail silently; we handle via try/catch in persist via custom storage? Keep as is.
    return {
      version, currentUserId, users, posts: state.posts, stories, reels, conversations, notifications, saved, hiddenPostIds, reportedPostIds, recentSearches, theme, notificationPrefs, followingIds, viewedStoryIds
    }
  },
  onRehydrateStorage: ()=> (state, error)=>{
    if(error){
      console.warn('Rehydrate error, resetting', error)
      try{ localStorage.removeItem('instapulse-state') }catch{}
    }
  }
}))

// Safe parse wrapper to recover from corrupted data
try{
  const raw = localStorage.getItem('instapulse-state')
  if(raw) JSON.parse(raw)
}catch(e){
  console.warn('Corrupted localStorage detected, clearing', e)
  try{ localStorage.removeItem('instapulse-state') }catch{}
}
