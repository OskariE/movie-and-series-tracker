import { useEffect, useState } from 'react';
import searchTitles from '../services/searchTitles.js';
import localTitlesService from '../services/localTitles.js';
import SearchBar from '../components/SearchBar.jsx'

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
      localTitlesService.getAll().then(a => 
      setAddedIds(a.map(t => t.imdbID)))
    }, [])

  useEffect(() => {
    console.log(addedIds)
    }, [addedIds])

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchTitles.search(query);
        setResults(res);
      } catch (err) {
        console.error('Search failed', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [query]);

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

      const res = await localTitlesService.create(titleData);
      if (res) {
        setAddedIds((prev) => [...prev, result.imdbID]);
      }
    } catch (err) {
      console.error('Add failed', err);
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

      {loading && <p className="empty-row-compact">Searching…</p>}

      {!loading && query && !results.imdbID && (
        <p className="empty-row-compact">No matches for "{query}".</p>
      )}
      {results.imdbID && (
      <ul className="search-results">
          <li key={`${results.imdbID}`} className="search-result" >
            <div className="search-result-info">
              <img src={results.Poster} alt={results.Title} className="search-result-poster-img" />
              <p className="search-result-title">{results.Title}</p>
              <p className="search-result-meta">
                {results.Type === 'series' ? 'Series' : 'Movie'}
                {results.Released ? ` · ${results.Released.slice(7, 11)}` : ''}
              </p>
            </div>
            <button
              className="button"
              onClick={() => addTitle(results)}
              disabled={addedIds.includes(results.imdbID)}
            >
              {addedIds.includes(results.imdbID) ? 'Added' : 'Add to list'}
            </button>
          </li>
      </ul> )}
    </div>
  );
}