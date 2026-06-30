import localTitlesService from '../services/localTitles.js'
import { useState, useEffect } from 'react'
import TitleCard from '../components/TitleCard.jsx'

export default function MyList() {
  const [titles, setTitles] = useState([])
  const watching = titles.filter((t) => t.status === 'watching')
  const plan = titles.filter((t) => t.status === 'plan')
  const list = [ ...watching, ...plan]
  
  useEffect(() => {
    localTitlesService.getAll().then(t =>
      setTitles(t)
    )
  }, [])

  async function advanceEpisode(id) {
    const t = titles.find((t) => t.id === id)
    if (!t || t.type !== 'series') return
    const next = Math.min(t.episodesWatched + 1, t.episodesTotal)
    const updated = { ...t, episodesWatched: next, status: next === t.episodesTotal ? 'completed' : 'watching' }
    const saved = await localTitlesService.update(id, updated)
    setTitles((prev) => prev.map((t) => (t.id === id ? saved : t)))
  }

  async function changeStatus(id) {
    const t = titles.find((t) => t.id === id)
    if (!t) return
    const updated = { ...t, status: 'watching' }
    const saved = await localTitlesService.update(id, updated)
    setTitles((prev) => prev.map((t) => (t.id === id ? saved : t)))
  }

  async function toggleMovieWatched(id) {
    const t = titles.find((t) => t.id === id)
    if (!t || t.type !== 'movie') return
    const watched = t.status === 'completed'
    const updated = { ...t, status: watched ? 'watching' : 'completed', progressPct: 100 }
    const saved = await localTitlesService.update(id, updated)
    setTitles((prev) => prev.map((t) => (t.id === id ? saved : t)))
  }

  return (
    <div className="base">
      <header className="header">
        <div className="header-row">
          <h1 className="header-title">My List</h1>
        </div>
      </header>
      <div className="title-grid">
        {list.map((t) => (
          <TitleCard key={t.id} title={t} onAdvance={advanceEpisode} onToggleMovie={toggleMovieWatched} poster={t.poster} showBar={true} showRemove={true}/>
        ))}
      </div>
    </div>
  )
}