import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Stat from '../components/Stat.jsx'
import searchTitles from '../services/searchTitles.js'

export default function Title() {
    const [title, setTitle] = useState([])
    const { imdbID } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        searchTitles.getByImdbID(imdbID).then(t => {
            setTitle(t)
        }).catch(err => {
            console.error('Failed to fetch title:', err)
        })
    }, [imdbID])

    const hasPoster = title.Poster && title.Poster !== 'N/A'
    const ratings = title.Ratings || []
    const imdbRating = title.imdbRating !== 'N/A' ? title.imdbRating : null
    const genres = title.Genre ? title.Genre.split(',').map(g => g.trim()) : []
    const year = title.Year || ''
    const runtime = title.Runtime !== 'N/A' ? title.Runtime : null
    const plot = title.Plot !== 'N/A' ? title.Plot : null
    const director = title.Director !== 'N/A' ? title.Director : null
    const cast = title.Actors !== 'N/A' ? title.Actors : null
    const totalSeasons = title.totalSeasons !== 'N/A' ? title.totalSeasons : null
    const writers = title.Writer !== 'N/A' ? title.Writer : null

    return (
        <div className="base">
            <header className="header">
                <div className="header-row">
                    <div className="button-container">
                        <button className="button" onClick={() => navigate(-1)}>
                            Back
                        </button>
                    </div>
                    <h1 className="header-title singleview">{title.Title}</h1>
                </div>
            </header>
            <article className="title singleview">
                <div
                    className="title-poster-singleview"
                    onClick={() => navigate(`/title/byID/${title.imdbID}`)}
                >
                    {hasPoster && <img src={title.Poster} alt={title.Title} className="title-poster-img-singleview" />}
                </div>
                <div className="title-details">
                    <div className="title-info">
                        <p><strong>Year:</strong> {year}</p>
                        {runtime && <p><strong>Runtime:</strong> {runtime}</p>}
                        {totalSeasons && <p><strong>Total Seasons:</strong> {totalSeasons}</p>}
                        {genres.length > 0 && <p><strong>Genres:</strong> {genres.join(', ')}</p>}
                        {imdbRating && <p><strong>IMDb Rating:</strong> {imdbRating}</p>}
                        {director && <p><strong>Director:</strong> {director}</p>}
                        {writers && <p><strong>Writers:</strong> {writers}</p>}
                        {cast && <p><strong>Cast:</strong> {cast}</p>}
                        {plot && <p><strong>Plot:</strong> {plot}</p>}
                        {ratings.length > 0 && (
                            <div className="title-ratings">
                                <strong>Ratings:</strong>
                                {ratings.map((rating, index) => (
                                    <p key={index}>
                                        <strong>{rating.Source}:</strong> {rating.Value}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </div>
    )
}