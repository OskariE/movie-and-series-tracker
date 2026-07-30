import { useState } from 'react'
import localTitlesService from '../services/localTitles.js'

export default function Form() {
    const [type, setType] = useState("movie")
    const [title, setTitle] = useState("")
    const [runtime, setRuntime] = useState("")
    const [episodes, setEpisodes] = useState()
    const [success, setSuccess] = useState(false)

    const handleChange = (event) => {
        event.preventDefault()
        setType(event.target.value)
    }

    async function addTitle(result) {
        event.preventDefault()
        try {
          const titleData = {
            title: title,
            type: type,
            status: 'plan',
            episodesTotal: episodes,
            episodesWatched: type === 'series' ? 0 : undefined,
            progressPct: type === 'movie' ? 0 : undefined,
            runTime: runtime + " min",
            imdbID: crypto.randomUUID()
          }
          console.log(titleData)
          const res = await localTitlesService.create(titleData)
          if (res) {
            setSuccess(true)

            await setTimeout(() => {
              setSuccess(false)
            }, 3000)
          }
        } catch (err) {
          console.error('Add failed', err)
        }
      }

    return (
        <div className="form-container">
          <form className="form" onSubmit={addTitle}>
            <label className="form-label">OR</label>
            <label className="form-label">Add your own title:</label>
              <div className="form-row">
                <label className="form-label small">Choose type:</label>
                <select name="type" className="form-input" value={type} onChange={handleChange}>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                </select>
              </div>
              <div className="form-row">
                <label className="form-label small">Title:</label>
                <input type="text" className="form-input" required={true} minLength="1" maxLength="50" onChange={({target}) => setTitle(target.value)}/>
              </div>
              <div className="form-row">
                <label className="form-label small">Runtime (minutes):</label>
                <input type="number" className="form-input" required={true} min="1" max="1000" onChange={({target}) => setRuntime(target.value)}/>
              </div>
                {type === "series" && (
                  <div className="form-row">
                    <label className="form-label small">Total episodes:</label>
                    <input type="number" required={true} className="form-input" min="1" max="1000" onChange={({target}) => setEpisodes(target.value)}/>
                  </div>
                )}
                <button type="submit" className="form-submit">Add</button>
                {success && (
                  <p className="success">Title added to list</p>
                )}
          </form>
        </div>
    )
}