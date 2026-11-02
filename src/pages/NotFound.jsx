import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="max-w-[630px] mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-sm text-zinc-500 mt-2">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="inline-block mt-6 px-6 py-2 rounded-full bg-accent-gradient text-white text-sm font-semibold">Go to Home Feed</Link>
    </div>
  )
}
