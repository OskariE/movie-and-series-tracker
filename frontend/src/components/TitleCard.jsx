import { useNavigate } from 'react-router-dom';

export default function TitleCard({ title, onAdvanceEpisode, onAdvanceMovie, showAdvance, poster, showRemove, onRemove }) {
  const navigate = useNavigate();
  console.log(title)
  return (
    <div className="title">
      <div className="title-poster-box">
        <img className="title-poster-img" src={title.poster} onClick={() => navigate(`/title/byID/${title.imdbID}`)}/>
      </div>
      <div className="title-info">
          <h3 className="title-name" onClick={() => navigate(`/title/byID/${title.imdbID}`)}>{title.title}</h3>
        {title.type === "movie" ? (
          <p>
            Progress: {title.progressPct}%
          </p>
        ) : (
          <p>
            E{title.episodesWatched} of E{title.episodesTotal}
          </p>
        )}
        {title.type === "movie" && title.progressPct < 100 && (
          <button className="title-button" onClick={onAdvanceMovie}>Mark watched</button>
        )}
        {title.type === "series" && title.episodesWatched < title.episodesTotal && (
          <button className="title-button" onClick={onAdvanceEpisode}>Mark next watched</button>
          )}
      </div>
    </div>
  )
}
