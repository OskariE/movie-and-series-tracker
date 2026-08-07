import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Stat from '../components/Stat.jsx'
import TitleCard from '../components/TitleCard.jsx'
import localTitlesService from '../services/localTitles.js'
import Header from '../components/Header.jsx'

export default function Dashboard() {
    const [titles, setTitles] = useState([])
    const watching = titles.filter((t) => t.status === "watching")
    const planned = titles.filter((t) => t.status === "plan")
    const completed = titles.filter((t) => t.status === "completed")

    function getHours() {
        const minutes = titles.reduce((sum, t) => {
          if (titles.length === 0) return 0
          if (t.type === "series" && t.runTime !== "N/A") return (sum + Number(t.episodesWatched * Number(t.runTime.split(" ")[0])))
          if (t.runTime !== "N/A" && t.status === "completed") return (sum + Number(t.runTime.split(" ")[0]))
          return sum
        }, 0)

      return Math.round(minutes/60)
    }
  

    const navigate = useNavigate()

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

    async function advanceMovie(titleId) {
      const foundTitle = titles.find((t) => t.id === titleId)

      const updated = {...foundTitle, status: "completed"}
      const savedTitle = await localTitlesService.update(titleId, updated)
      setTitles((prev) => prev.map((t) => t.id === titleId ? savedTitle : t))
    }

    async function statusToWatching(titleId) {
      const foundTitle = titles.find((t) => t.id === titleId)
      const updated = {...foundTitle, status: "watching"}

      const savedTitle = await localTitlesService.update(titleId, updated)
      setTitles((prev) => prev.map((t) => (t.id === titleId ? savedTitle : t)))
    }

    return (
      <div className="base">
        <Header headerTitle="Dashboard"/>

        <div className="stat-grid">
          <Stat label="Watching" value={watching.length}/>
          <Stat label="Completed" value={completed.length}/>
          <Stat label="Planned"  value={planned.length}/>
          <Stat label="Hours Watched" value={getHours()}/>
        </div>

        <div className="title-grid">
          {watching.map(t => 
            <TitleCard key={t.id} title={t} poster={t.poster} onAdvanceEpisode={() => advanceEpisode(t.id)} onAdvanceMovie={() => advanceMovie(t.id)} showAdvance={true}/>
          )}
        </div>
      
        <div className="list-split">
          {planned.length != 0 ? (
            <ul className="planned-list">
              <h2 className="list-header">Planned titles</h2>
              {planned.slice(-5, planned.length).reverse().map(t => (
                t.imdbID.length === 36 ? (
                  <li key={t.id} className="planned-listitem"><div className="listitem-name" >{t.title}</div> <button className="list-button" onClick={() => statusToWatching(t.id)}>Start watching</button></li>
                ) : (
                  <li key={t.id} className="planned-listitem"><div className="listitem-name" onClick={() => navigate(`/title/byID/${t.imdbID}`)}>{t.title}</div> <button className="list-button" onClick={() => statusToWatching(t.id)}>Start watching</button></li>
                )
              )
            )}
          </ul>
         ) : (
          <ul className="planned-list">
          <h2 className="list-header">No planned titles</h2>
          </ul> )}
          

          {completed.length != 0 ? (
            <ul className="watched-list">
              <h2 className="list-header">Recently finished</h2>
              {completed.slice(-5, completed.length).reverse().map(t => (
                t.imdbID.length === 36 ? (
                  <li key={t.id} className="watched-listitem"><div className="listitem-name" >{t.title}</div></li>
                ) : (
                  <li key={t.id} className="watched-listitem"><div className="listitem-name" onClick={() => navigate(`/title/byID/${t.imdbID}`)}>{t.title}</div></li>
                )
              )
            )}
              
            </ul>
          ) : (
            <ul className="planned-list">
            <h2 className="list-header">No finished titles</h2>
            </ul>
          )}
        </div>
      </div>
    )
}