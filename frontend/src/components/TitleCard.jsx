import { useNavigate } from 'react-router-dom';

export default function TitleCard({ title, onAdvanceEpisode, onAdvanceMovie, showAdvance, poster, showRemove, onRemove }) {
  const navigate = useNavigate();
  return (
    <div className="title">
      {title.poster && (
        <div className="title-poster-box" onClick={() => navigate(`/title/byID/${title.imdbID}`)}>
          <img className="title-poster-img" src={title.poster} alt={title.title} />
        </div>
      )}

      <div className="title-info">
        {showRemove && (
          <button className="title-button remove" onClick={onRemove}>Remove</button>
        )}
        {title.imdbID.length === 36 ? (
          <h3 className="title-name" >{title.title}</h3>
        ) : (
          <h3 className="title-name" onClick={() => navigate(`/title/byID/${title.imdbID}`)}>{title.title}</h3>
        )}
        {title.type === "movie" && showAdvance && (
          <p>
            Progress: {title.progressPct}%
          </p>
        )} {title.type === "series" && showAdvance && (
          <p>
            E{title.episodesWatched} of E{title.episodesTotal}
          </p>
        )}
        {title.type === "movie" && title.progressPct < 100 && showAdvance && (
          <button className="title-button" onClick={onAdvanceMovie}>Mark watched</button>
        )}
        {title.type === "series" && title.episodesWatched < title.episodesTotal && showAdvance &&(
          <button className="title-button" onClick={onAdvanceEpisode}>Mark next watched</button>
          )}
        
      </div>
    </div>
  )
}
