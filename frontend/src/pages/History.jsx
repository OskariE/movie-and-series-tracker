import { useState, useEffect } from 'react'
import Stat from '../components/Stat.jsx'
import TitleCard from '../components/TitleCard.jsx'
import localTitlesService from '../services/localTitles.js'

export default function History() {
    const [titles, setTitles] = useState([])
    const completed = titles.filter((t) => t.status === 'completed')

    useEffect(() => {
        localTitlesService.getAll().then(t =>
            setTitles(t)
        )
    }, [])

    async function removeTitle(id) {
        const t = titles.find((t) => t.id === id)
        if (!t) return
        await localTitlesService.remove(id)
        setTitles((prev) => prev.filter((t) => t.id !== id))
      }

    return (
        <div className="base">
            <header className="header">
                <div className="header-row">
                    <h1 className="header-title">History</h1>
                </div>
            </header>
            <div className="title-grid">
                {completed.map((t) => (
                    <TitleCard key={t.id} title={t} poster={t.poster} showRemove={true} onRemove={removeTitle} />
                ))}
            </div>
        </div>
    )
}