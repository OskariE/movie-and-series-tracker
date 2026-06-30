import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavMenu from './components/NavMenu.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Search from './pages/Search.jsx';
import MyList from './pages/MyList.jsx';
import History from './pages/History.jsx'

const App = () => {
    return (
    <BrowserRouter>
        <NavMenu />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/my-list" element={<MyList />} />
                <Route path="/history" element={<History />} /> 
            </Routes>
    </BrowserRouter>
    )
}

export default App;