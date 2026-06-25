import { NavLink } from 'react-router-dom';

const NavMenu = () => {
    return (
        <div>
        <nav className="navmenu">
            <NavLink to="/" className='menu-item'>
                Dashboard
            </NavLink>
            <NavLink to="/search" className='menu-item'>
                Search
            </NavLink>
            <NavLink to="/my-list" className='menu-item'>
                My List
            </NavLink>
            <NavLink to="/history" className='menu-item'>
                History
            </NavLink>
        </nav>
        </div>
    )
}

export default NavMenu;