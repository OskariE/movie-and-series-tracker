import { useState } from 'react'
import localTitlesService from '../services/localTitles.js'

export default function Form() {
    const [type, setType] = useState("movie")
    const [title, setTitle] = useState("")
    const [runtime, setRuntime] = useState("")
    const [episodes, setEpisodes] = useState()

    const handleChange = (event) => {
        setType(event.target.value)
    }

    async function addTitle(result) {
        try {
          const titleData = {
            title: title,
            type: type,
            status: 'plan',
            episodesTotal: episodes,
            episodesWatched: type === 'series' ? 0 : undefined,
            progressPct: type === 'movie' ? 0 : undefined,
            runTime: runtime,
            imdbID: crypto.randomUUID()
          }
    
          const res = await localTitlesService.create(titleData)
          if (res) {
            setAddedIds((prev) => [...prev, result.imdbID])
          }
        } catch (err) {
          console.error('Add failed', err)
        }
      }

    return (
        <div className="form-container">
          <form className="form" onSubmit={addTitle}>
            <label className="form-label">Add your own movie or series:</label>
                <select name="type" className="form-input" value={type} onChange={handleChange}>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                </select>
                <input type="text" placeholder="Title" className="form-input" onChange={({target}) => setTitle(target.value)}/>
                <input type="text" placeholder="Runtime" className="form-input" onChange={({target}) => setRuntime(target.value)}/>
                {type === "series" && (
                    <input type="number" placeholder="Total Episodes" className="form-input" onChange={({target}) => setEpisodes(target.value)}/>
                )}
                <button type="submit" className="form-submit">Add</button>
          </form>
        </div>
    )
}