import { useEffect, useState } from 'react';
import searchTitles from '../services/searchTitles.js';
import localTitlesService from '../services/localTitles.js';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState([]);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchTitles.search(query);
        console.log('Search response:', res);
        setResults(res);
        console.log(results)
      } catch (err) {
        console.error('Search failed', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

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
        poster: result.Poster
      }

      console.log('Adding title with data:', titleData);
      const res = await localTitlesService.create(titleData);
      if (res) {
        setAddedIds((prev) => [...prev, result.imdbID]);
      }
    } catch (err) {
      console.error('Add failed', err);
    }
    }


  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-row">
          <h1 className="header-title">Search</h1>
        </div>
      </header>

      <input
        className="search-bar"
        type="text"
        placeholder="Search for a movie or series…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="empty-row compact">Searching…</p>}

      {!loading && query && !results.imdbID && (
        <p className="empty-row compact">No matches for "{query}".</p>
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