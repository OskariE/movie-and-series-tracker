import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import searchTitles from '../services/searchTitles.js'
import localTitlesService from '../services/localTitles.js'
import SearchBar from '../components/SearchBar.jsx'
import TitleCard from '../components/TitleCard.jsx'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [addedIds, setAddedIds] = useState([])
  const navigate = useNavigate()

  const hasPoster = results.Poster && results.Poster !== 'N/A'

  useEffect(() => {
    localTitlesService.getAll().then(a =>
      setAddedIds(a.map(t => t.imdbID)))
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchTitles.search(query)

        setResults(res)
      } catch (err) {
        console.error('Search failed', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  async function addTitle(result) {
    try {
      const titleData = {
        title: result.Title,
        type: result.Type === 'series' ? 'series' : 'movie',
        status: 'plan',
        episodesTotal: result.Type === 'series' ? parseInt(result.totalSeasons) * 10 : undefined,
        episodesWatched: result.Type === 'series' ? 0 : undefined,
        progressPct: result.Type === 'movie' ? 0 : undefined,
        runTime: result.Runtime,
        poster: result.Poster,
        imdbID: result.imdbID
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
    <div className="base">
      <header className="header">
        <div className="header-row">
          <h1 className="header-title">Search</h1>
        </div>
      </header>
      <SearchBar
        query={query}
        setQuery={setQuery}
      />

      {loading && <p className="empty-row-compact search">Searching…</p>}

      {!loading && query && !results.imdbID && (
        <p className="empty-row-compact search">No matches for "{query}".</p>
      )}
      {results.imdbID && (
        <div className="search-results">
          <article className="title">
            {hasPoster && <img src={results.Poster} alt={results.Title} className="title-poster-img" onClick={() => navigate(`/title/byID/${results.imdbID}`)} />}
            <div className="title-details">
              <div className="title-info">
                <h3 className="title-name" onClick={() => navigate(`/title/byID/${results.imdbID}`)}>
                  {results.Title}
                </h3>
                <p><strong>Year:</strong> {results.Year}</p>
                {results.Runtime && <p><strong>Runtime:</strong> {results.Runtime}</p>}
                {results.Genre && <p><strong>Genres:</strong> {results.Genre}</p>}
                {results.imdbRating && <p><strong>IMDb Rating:</strong> {results.imdbRating}</p>}
                <div className="title-row bottom">
                  <button className="title-action search" onClick={() => addTitle(results)} disabled={addedIds.includes(results.imdbID)}>
                    {addedIds.includes(results.imdbID) ? 'Added' : 'Add to My List'}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>)}
    </div>
  )
}