import localTitlesService from '../services/localTitles.js'
import { useState, useEffect } from 'react'
import TitleCard from '../components/TitleCard.jsx'
import Header from '../components/Header.jsx'

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

  async function advanceEpisode(titleId) {
    const foundTitle = titles.find((t) => t.id === titleId)
    console.log(foundTitle)
    const next = (foundTitle.episodesWatched + 1)
    const updated = {...foundTitle, episodesWatched: next, status: next === foundTitle.episodesTotal ? 'completed' : 'watching'}

    const savedTitle = await localTitlesService.update(titleId, updated)
    setTitles((prev) => prev.map ((t) => (t.id === titleId ? savedTitle : t)))
  }
  

  async function changeStatus(id) {
    const t = titles.find((t) => t.id === id)
    if (!t) return
    const updated = { ...t, status: 'watching' }
    const saved = await localTitlesService.update(id, updated)
    setTitles((prev) => prev.map((t) => (t.id === id ? saved : t)))
  }


  async function removeTitle(id) {
    const t = titles.find((t) => t.id === id)
    if (!t) return
    await localTitlesService.remove(id)
    setTitles((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="base">
      <Header headerTitle="My list" />
      <div className="title-grid-big">
        {list.map((t) => (
          <TitleCard key={t.id} title={t} onAdvanceEpisode={() => advanceEpisode(t.id)} poster={t.poster} showRemove={true} onRemove={removeTitle} />
        ))}
      </div>
    </div>
  )
}