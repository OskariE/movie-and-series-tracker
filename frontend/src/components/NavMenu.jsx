import { NavLink } from 'react-router-dom';

export default function NavMenu() {
    return (
        <div>
        <nav className="navmenu">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                Dashboard
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
                Search
            </NavLink>
            <NavLink to="/my-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                My List
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
                History
            </NavLink>
        </nav>
        </div>
    )
}
