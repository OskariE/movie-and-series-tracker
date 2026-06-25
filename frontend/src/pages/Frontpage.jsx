import { useState, useEffect } from 'react'
import Stat from '../components/Stat.jsx'
import TitleCard from '../components/TitleCard.jsx'
import localTitlesService from '../services/localTitles.js'

function statsFrom(titles) {
  const watching = titles.filter((t) => t.status === 'watching').length
  const completed = titles.filter((t) => t.status === 'completed').length
  const plan = titles.filter((t) => t.status === 'plan').length
  const hours = titles.reduce((sum, t) => {
    if (t.type === 'series') return sum + t.episodesWatched * 0.7
    return sum + (t.progressPct / 100) * 2
  }, 0)
  return { watching, completed, plan, hours: Math.round(hours) }
}

export default function Dashboard() {
  const [titles, setTitles] = useState([])

  useEffect(() => {
    localTitlesService.getAll().then(t =>
      setTitles(t)
    )
  }, [])

  const stats = statsFrom(titles)

  const watchingNow = titles.filter((t) => t.status === 'watching')
  const planned = titles.filter((t) => t.status === 'plan')
  const completed = titles.filter((t) => t.status === 'completed')

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
    const updated = { ...t, status: watched ? 'watching' : 'completed', progressPct: watched ? t.progressPct : 100 }
    const saved = await localTitlesService.update(id, updated)
    setTitles((prev) => prev.map((t) => (t.id === id ? saved : t)))
  }

  return (
    <div className="dashboard">
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
          <p className="empty-row">Add a movie or series to get started.</p>
        ) : (
          <div className="title-grid">
            {watchingNow.map((t) => (
              <TitleCard key={t.id} title={t} onAdvance={advanceEpisode} onToggleMovie={toggleMovieWatched} poster={t.poster} />
            ))}
          </div>
        )}
      </section>

      <div className="reel-split">
        <section className="reel">
          <h2 className="label">Up Next</h2>
          {planned.length === 0 ? (
            <p className="empty-row compact">The queue is clear.</p>
          ) : (
            <ul className="up-next-list">
              {planned.map((t) => (
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
            <p className="empty-row compact">Nothing finished yet.</p>
          ) : (
            <ul className="up-next-list">
              {completed.map((t) => (
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
