import { useState, useEffect } from 'react'
import Stat from '../components/Stat.jsx'
import TitleCard from '../components/TitleCard.jsx'
import localTitlesService from '../services/localTitles.js'
import Header from '../components/Header.jsx'

export default function Dashboard() {
    const [titles, setTitles] = useState([])
    const watching = titles.filter((t) => t.status === "watching")

    useEffect(() => {
      localTitlesService.getAll().then(t => 
        setTitles(t)
      )
    }, [])

    async function advanceEpisode(titleId) {
      const foundTitle = titles.find((t) => t.id === titleId)
      const next = (foundTitle.episodesWatched + 1)
      const updated = {...foundTitle, episodesWatched: next, status: next === foundTitle.episodesTotal ? 'completed' : 'watching'}

      const savedTitle = await localTitlesService.update(titleId, updated)
      setTitles((prev) => prev.map ((t) => (t.id === titleId ? savedTitle : t)))
    }

    return (
      <div className="base">
        <Header headerTitle="Dashboard"/>

        <section className="stat-grid">
          <Stat label="Watching" value={watching.length}/>
          <Stat label="Completed" />
          <Stat label="Planned" />
          <Stat label="Hours Logged" />
        </section>

        <section className="title-grid">
          {watching.map(t => 
            <TitleCard key={t.id} title={t} poster={t.poster} showAdvance={true} onAdvance={advanceEpisode}/>
          )}
        </section>

        <div></div>
      </div>
    )
}