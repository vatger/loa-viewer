import ConditionsTable from 'components/ConditionsTable';
import Footer from 'components/Footer';
import Map from 'components/Map';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/conditions" element={<ConditionsTable />} />
                    <Route path="/" element={<ConditionsTable />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
            </Router>
        </>
    );
}

export default App;
