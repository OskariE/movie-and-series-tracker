function TitleCard({ title, onAdvance, onToggleMovie, poster, showBar, showRemove }) {
  const isSeries = title.type === 'series'
  const isCompleted = title.status === 'completed'

  return (
    <article className={`title ${isCompleted ? 'is-completed' : ''}`}>
      <div
        className="title-poster"
        style={{ background: `linear-gradient(160deg, hsl(${title.hue} 55% 38%), hsl(${title.hue} 55% 18%))` }}
      >
        <img src={poster} alt={title.title} className="title-poster-img" />
      </div>
      <div className="title-info">
        <p className="title-kind">{isSeries ? 'Series' : 'Movie'}</p>
        <h3 className="title-name">{title.title}</h3>

        {isSeries ? (
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
              {showBar && (
                <div className="filmbar">
                  <div className="filmbar-fill" style={{ width: `${title.progressPct}%` }} />
                </div>
              )}
            </div>
            <div className="title-row">
              {isCompleted ? (
                  <div className="title-meta">
                  </div>
                ) : (
                  <button className="title-action" onClick={() => onToggleMovie(title.id)}>
                    Mark watched
                  </button>
                )}
                {showRemove && (
                  <button className="title-action">
                    Remove
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </article>
  )
}

export default TitleCard