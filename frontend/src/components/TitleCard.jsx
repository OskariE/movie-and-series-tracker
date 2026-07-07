import { useNavigate } from 'react-router-dom';

export default function TitleCard({ title, onAdvance, onToggleMovie, showAdvance, poster, showBar, showRemove, onRemove , onAdd, isAdded, showAdd }) {
  const isSeries = title.type === 'series'
  const isCompleted = title.status === 'completed'
  const hasPoster = poster && poster !== 'N/A'

  const navigate = useNavigate();

  return (
    <article className={`title ${isCompleted ? 'is-completed' : ''}`}>
      <div
        className="title-poster"
        style={{ background: `linear-gradient(160deg, hsl(${title.hue} 55% 38%), hsl(${title.hue} 55% 18%))` }}
        onClick={() => navigate(`/title/byID/${title.imdbID}`)}
      >
        {hasPoster && <img src={poster} alt={title.title} className="title-poster-img" />}
      </div>
      <div className="title-info">
        <p className="title-kind">{isSeries ? 'Series' : 'Movie'}</p>
        <h3 className="title-name" onClick={() => navigate(`/title/byID/${title.imdbID}`)}>
          {title.title}
        </h3>

        {isSeries && showAdvance ? (
          <>
            <div className="title-row">
              <span className="title-meta">
                E{title.episodesWatched} of {title.episodesTotal}
              </span>
            </div>
            <div className="title-row">
              <button
                className="title-action"
                onClick={() => onAdvance(title.id)}
                disabled={title.episodesWatched >= title.episodesTotal}
              >
                {title.episodesWatched >= title.episodesTotal ? 'Finished' : 'Mark next watched'}
              </button>
              {showRemove && (
                  <button className="title-action">
                    Remove
                  </button>
                )}
            </div>
          </>
        ) : (
          <>
            <div className="title-row">
              {showBar && showAdvance && (
                <div className="filmbar">
                  <div className="filmbar-fill" style={{ width: `${title.progressPct}%` }} />
                </div>
              )}
            </div>
            <div className="title-row">
              {showAdvance && (
                  <button className="title-action" onClick={() => onToggleMovie(title.id)}>
                    Mark watched
                  </button>
                )}
                {showRemove && (
                  <button className="title-action remove" onClick={() => onRemove(title.id)}>
                    Remove
                  </button>
                )}
                {showAdd && (
                  <button className="title-action" onClick={() => onAdd(title.id)} disabled={isAdded}>
                    {isAdded ? 'Added' : 'Add to list'}
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </article>
  )
}
