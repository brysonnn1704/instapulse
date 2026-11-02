import { useRef, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function Settings(){
  const theme = useStore(s=>s.theme)
  const setTheme = useStore(s=>s.setTheme)
  const notificationPrefs = useStore(s=>s.notificationPrefs)
  const setNotificationPrefs = useStore(s=>s.setNotificationPrefs)
  const recentSearches = useStore(s=>s.recentSearches)
  const clearSearchesOnly = useStore(s=>s.clearSearchesOnly)
  const resetData = useStore(s=>s.resetData)
  const exportData = useStore(s=>s.exportData)

  const [confirmReset, setConfirmReset] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [exportText, setExportText] = useState('')

  const doExport = ()=>{
    const txt = exportData()
    setExportText(txt)
    setShowExport(true)
  }
  const downloadExport = ()=>{
    const blob = new Blob([exportText], { type:'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `instapulse-export-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }
  const copyExport = async()=>{
    try{ await navigator.clipboard.writeText(exportText); alert('Copied to clipboard') }catch{ alert('Copy failed') }
  }

  // Escape closes modals
  useEffect(()=>{
    const h=(e)=>{ if(e.key==='Escape'){ setConfirmReset(false); setShowExport(false)}}
    window.addEventListener('keydown', h)
    return ()=> window.removeEventListener('keydown', h)
  },[])

  return (
    <div className="max-w-[630px] mx-auto px-4 pt-6 pb-8 w-full">
      <h1 className="text-xl font-bold mb-6">Settings</h1>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-3">Appearance</h2>
        <p className="text-xs text-zinc-500 mb-3">Theme is persisted and applies across reloads.</p>
        <div className="flex gap-2">
          {(['light','dark','system']).map(t=>(
            <button key={t} onClick={()=>setTheme(t)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize border ${theme===t?'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white':'bg-zinc-100 dark:bg-zinc-800 border-transparent'}`}>{t}</button>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-3">Notifications</h2>
        <div className="space-y-3">
          {(['likes','comments','follows']).map(k=>(
            <label key={k} className="flex items-center justify-between gap-4">
              <span className="text-sm capitalize">{k}</span>
              <button
                onClick={()=> setNotificationPrefs({ [k]: !notificationPrefs[k] })}
                className={`relative w-[44px] h-[26px] rounded-full transition ${notificationPrefs[k]?'bg-black dark:bg-white':'bg-zinc-300 dark:bg-zinc-700'}`}
                aria-label={`Toggle ${k}`}
              >
                <span className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white dark:bg-zinc-900 transition ${notificationPrefs[k]?'left-[21px]':'left-[3px]'}`} />
              </button>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-3">Search</h2>
        <p className="text-sm text-zinc-500 mb-2">{recentSearches.length} recent searches stored.</p>
        <button onClick={clearSearchesOnly} disabled={recentSearches.length===0} className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold disabled:opacity-40">Clear recent searches</button>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-3">Data</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={doExport} className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold">Export data (JSON)</button>
          <button onClick={()=>setConfirmReset(true)} className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold">Reset all data</button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">Export downloads your local data. Reset clears localStorage and restores demo data — it cannot be undone.</p>
      </section>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setConfirmReset(false)} />
          <div role="dialog" aria-modal="true" className="relative bg-white dark:bg-zinc-900 rounded-xl w-full max-w-[420px] p-6">
            <h3 className="font-semibold mb-2">Reset all data?</h3>
            <p className="text-sm text-zinc-500 mb-4">This will clear posts, conversations, saves, searches and settings and reload demo data. This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={()=>setConfirmReset(false)} className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold">Cancel</button>
              <button onClick={()=>{ resetData(); try{ localStorage.removeItem('instapulse-state') }catch{}; location.reload() }} className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold">Reset</button>
            </div>
          </div>
        </div>
      )}

      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowExport(false)} />
          <div role="dialog" aria-modal="true" className="relative bg-white dark:bg-zinc-900 rounded-xl w-full max-w-[640px] max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <span className="font-semibold text-sm">Exported data</span>
              <button onClick={()=>setShowExport(false)} className="text-sm font-semibold">Close</button>
            </div>
            <textarea readOnly value={exportText} className="flex-1 w-full p-4 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 outline-none resize-none" />
            <div className="flex gap-2 p-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
              <button onClick={copyExport} className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold">Copy</button>
              <button onClick={downloadExport} className="px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold">Download JSON</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
