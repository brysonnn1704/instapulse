import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function CreateModal({ open, onClose }){
  const createPost = useStore(s=>s.createPost)
  const createStory = useStore(s=>s.createStory)
  const [mode,setMode]=useState('post') // post | story
  const [file,setFile]=useState(null)
  const [preview,setPreview]=useState('')
  const [caption,setCaption]=useState('')
  const [location,setLocation]=useState('')
  const [aspect,setAspect]=useState('square')
  const [error,setError]=useState('')
  const inputRef=useRef(null)

  useEffect(()=>{
    if(!open){ setFile(null); setPreview(''); setCaption(''); setLocation(''); setError(''); setAspect('square') }
    const h = (e)=>{ if(e.key==='Escape') onClose() }
    if(open) window.addEventListener('keydown', h)
    return ()=> window.removeEventListener('keydown', h)
  },[open])

  const onFile = (e)=>{
    const f = e.target.files?.[0]
    if(!f) return
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)){
      setError('Only JPG, PNG, WebP allowed'); return
    }
    if(f.size > 8*1024*1024){ setError('File too large (max 8MB)'); return }
    setError('')
    setFile(f)
    const reader = new FileReader()
    reader.onload = ()=> setPreview(reader.result)
    reader.readAsDataURL(f)
  }

  const compress = (dataUrl)=> new Promise((res)=>{
    const img=new Image()
    img.onload=()=>{
      const canvas=document.createElement('canvas')
      let w=img.width, h=img.height
      const max=1080
      if(w>max || h>max){ const r=Math.min(max/w, max/h); w=Math.round(w*r); h=Math.round(h*r) }
      canvas.width=w; canvas.height=h
      const ctx=canvas.getContext('2d')
      ctx.drawImage(img,0,0,w,h)
      res(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src=dataUrl
  })

  const publish = async ()=>{
    if(!preview){ setError('Please select an image'); return }
    const compressed = await compress(preview)
    if(mode==='story'){
      createStory(compressed)
    } else {
      createPost({ image: compressed, caption, location, aspect })
    }
    onClose()
  }

  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative bg-white dark:bg-zinc-900 rounded-xl w-full max-w-[720px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Close"><X size={20}/></button>
          <span className="font-semibold">Create new {mode}</span>
          <button onClick={publish} className="text-[#0095f6] font-semibold text-sm">Share</button>
        </div>
        <div className="flex gap-2 px-4 pt-3">
          <button onClick={()=>setMode('post')} className={`px-3 py-1 rounded-full text-sm ${mode==='post'?'bg-black text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-800'}`}>Post</button>
          <button onClick={()=>setMode('story')} className={`px-3 py-1 rounded-full text-sm ${mode==='story'?'bg-black text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-800'}`}>Story</button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center min-h-[280px] overflow-hidden bg-zinc-50 dark:bg-zinc-800/50">
            {preview ? (
              <div className={`${aspect==='portrait'?'aspect-[4/5]': aspect==='landscape'?'aspect-[16/9]':'aspect-square'} w-full max-w-[420px] mx-auto overflow-hidden bg-black`}>
                <img src={preview} alt="Preview" className="w-full h-full object-cover"/>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-zinc-500 mb-3">JPG, PNG, WebP up to 8MB</p>
                <button onClick={()=>inputRef.current?.click()} className="bg-accent-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold">Select image</button>
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="hidden" aria-label="Upload image"/>
          {preview && <button onClick={()=>inputRef.current?.click()} className="text-sm text-[#0095f6] font-semibold">Change image</button>}
          {mode==='post' && (
            <>
              <div className="flex gap-2">
                <button onClick={()=>setAspect('square')} className={`px-3 py-1 rounded-full text-xs border ${aspect==='square'?'bg-black text-white dark:bg-white dark:text-black border-black':'border-zinc-300 dark:border-zinc-700'}`}>1:1</button>
                <button onClick={()=>setAspect('portrait')} className={`px-3 py-1 rounded-full text-xs border ${aspect==='portrait'?'bg-black text-white dark:bg-white dark:text-black border-black':'border-zinc-300 dark:border-zinc-700'}`}>4:5</button>
                <button onClick={()=>setAspect('landscape')} className={`px-3 py-1 rounded-full text-xs border ${aspect==='landscape'?'bg-black text-white dark:bg-white dark:text-black border-black':'border-zinc-300 dark:border-zinc-700'}`}>16:9</button>
              </div>
              <textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Write a caption..." rows={3} className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-sm bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-[#833AB4]" />
              <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Add location" className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-sm bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-[#833AB4]" />
            </>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}
