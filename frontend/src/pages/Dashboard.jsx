import { useState, useEffect } from 'react'
import Stat from '../components/Stat.jsx'
import TitleCard from '../components/TitleCard.jsx'
import localTitlesService from '../services/localTitles.js'
import Header from '../components/Header.jsx'

export default function Dashboard() {
    const [titles, setTitles] = useState([])
    const watching = titles.filter((t) => t.status === "watching")
    const planned = titles.filter((t) => t.status === "plan")
    const completed = titles.filter((t) => t.status === "completed")

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

    async function statusToWatching(titleId) {
      const foundTitle = titles.find((t) => t.id === titleId)
      const updated = {...foundTitle, status: "watching"}
      console.log(updated)
      const savedTitle = await localTitlesService.update(titleId, updated)
      setTitles((prev) => prev.map((t) => (t.id === titleId ? savedTitle : t)))
    }

    return (
      <div className="base">
        <Header headerTitle="Dashboard"/>

        <div className="stat-grid">
          <Stat label="Watching" value={watching.length}/>
          <Stat label="Completed" />
          <Stat label="Planned"  value={planned.length}/>
          <Stat label="Hours Logged" />
        </div>

        <div className="title-grid">
          {watching.map(t => 
            <TitleCard key={t.id} title={t} poster={t.poster} onAdvanceEpisode={() => advanceEpisode(t.id)}/>
          )}
        </div>
      
        <div className="list-split">
          {planned.length != 0 ? (
            <ul className="planned-list">
              {planned.map(t => 
                <li key={t.id} className="planned-listitem">{t.title} <button className="list-button" onClick={() => statusToWatching(t.id)}>Start watching</button></li>
            )}
          </ul>
         ) : (
          <p>No planned titles</p> )}

          {completed.length != 0 ? (
            <ul className="watched-list">
              {completed.map(t => 
                <li key={t.id} className="watched-listitem">{t.title}</li>
              )}
            </ul>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    )
}