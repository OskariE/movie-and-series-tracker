import { useState, useEffect } from 'react'
import Stat from '../components/Stat.jsx'
import TitleCard from '../components/TitleCard.jsx'
import localTitlesService from '../services/localTitles.js'

function statsFrom(titles) {
  const watching = titles.filter((t) => t.status === 'watching').length
  const completed = titles.filter((t) => t.status === 'completed').length
  const plan = titles.filter((t) => t.status === 'plan').length
  const minutes = titles.reduce((sum, t) => {
    if (t.type === 'series') return sum + (t.episodesWatched * Number(t.runTime.split(" ")[0]))
    if (t.type === 'movie' && t.status === 'completed') return sum + Number(t.runTime.split(" ")[0])
  return sum
}, 0)
  
  return { watching, completed, plan, hours: Number(Math.round((minutes / 60))) }
}


export default function Dashboard() {
  const [titles, setTitles] = useState(null)

  useEffect(() => {
    localTitlesService.getAll().then(t =>
      setTitles(t)
    )
  }, [])

  const stats = titles ? statsFrom(titles) : { watching: 0, completed: 0, plan: 0, hours: 0 }
  const watchingNow = titles ? titles.filter((t) => t.status === 'watching') : []
  const planned = titles ? titles.filter((t) => t.status === 'plan') : []
  const completed = titles ? titles.filter((t) => t.status === 'completed') : []

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
          <h1 className="header-title">Dashboard</h1>
        </div>
      </header>

      <section className="stat-grid">
        <Stat label="Watching" value={stats.watching} />
        <Stat label="Completed" value={stats.completed} />
        <Stat label="Plan to Watch" value={stats.plan} />
        <Stat label="Hours Logged" value={`${stats.hours}h`} />
      </section>

      <section className="reel">
        <h2 className="label">Continue Watching</h2>
        {watchingNow.length === 0 ? (
          <p className="empty-row-compact">Add a movie or series to get started.</p>
        ) : (
          <div className="title-grid">
            {watchingNow.map((t) => (
              <TitleCard key={t.id} title={t} onAdvance={advanceEpisode} onToggleMovie={toggleMovieWatched} poster={t.poster} showBar={true} />
            ))}
          </div>
        )}
      </section>

      <div className="reel-split">
        <section className="reel">
          <h2 className="label">Up Next</h2>
          {planned.length === 0 ? (
            <p className="empty-row-compact">The queue is clear.</p>
          ) : (
            <ul className="up-next-list">
              {planned.slice(0, 5).map((t) => (
                <li key={t.id} className="up-next-item">
                  <span className="up-next-swatch" style={{ background: `hsl(${t.hue} 45% 32%)` }} />
                  <span className="up-next-title">{t.title}</span>
                  <button className="button" onClick={() => changeStatus(t.id)}>Start watching</button>
                  <span className="up-next-type">{t.type === 'series' ? 'Series' : 'Movie'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="reel">
          <h2 className="label">Recently Completed</h2>
          {completed.length === 0 ? (
            <p className="empty-row-compact">Nothing finished yet.</p>
          ) : (
            <ul className="up-next-list">
              {completed.slice(0, 5).map((t) => (
                <li key={t.id} className="up-next-item">
                  <span className="up-next-swatch" style={{ background: `hsl(${t.hue} 45% 32%)` }} />
                  <span className="up-next-title">{t.title}</span>
                  <span className="up-next-type">{t.type === 'series' ? 'Series' : 'Movie'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}