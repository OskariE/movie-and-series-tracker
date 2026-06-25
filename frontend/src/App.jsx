import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavMenu from './components/NavMenu.jsx';
import Frontpage from './pages/Frontpage.jsx';
import SearchPage from './pages/SearchPage.jsx';

const App = () => {
    return (
    <BrowserRouter>
        <NavMenu />
            <Routes>
                <Route path="/" element={<Frontpage />} />
                <Route path="/search" element={<SearchPage />} />
                {/* will make these pages later
                <Route path="/my-list" element={<MyListPage />} />
                <Route path="/history" element={<HistoryPage />} /> 
                */}
            </Routes>
    </BrowserRouter>
    )
}

export default App;