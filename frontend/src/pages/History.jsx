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

    return (
        <div className="base">
            <header className="header">
                <div className="header-row">
                    <h1 className="header-title">History</h1>
                </div>
            </header>
            <div className="title-grid">
                {completed.map((t) => (
                    <TitleCard key={t.id} title={t} poster={t.poster} />
                ))}
            </div>
        </div>
    )
}