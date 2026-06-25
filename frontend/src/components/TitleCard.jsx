function TitleCard({ title, onAdvance, onToggleMovie, poster }) {
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
        <p className="title-kind">{isSeries ? `Series · Season ${title.season}` : 'Movie'}</p>
        <h3 className="title-name">{title.title}</h3>

        {isSeries ? (
          <>
            <div className="title-row">
              <span className="title-meta">
                E{title.episodesWatched} of {title.episodesTotal}
              </span>
              <button
                className="title-action"
                onClick={() => onAdvance(title.id)}
                disabled={title.episodesWatched >= title.episodesTotal}
              >
                {title.episodesWatched >= title.episodesTotal ? 'Finished' : 'Mark next watched'}
              </button>
            </div>
          </>
        ) : (
          <div className="title-row">
            <div className="filmbar">
              <div className="filmbar-fill" style={{ width: `${title.progressPct}%` }} />
            </div>
            <button className="title-action" onClick={() => onToggleMovie(title.id)}>
              {isCompleted ? 'Unmark' : 'Mark watched'}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default TitleCard;