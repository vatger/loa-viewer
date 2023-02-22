import ConditionsTable from 'components/ConditionsTable';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/conditions" element={<ConditionsTable />} />
                    <Route path="/" element={<ConditionsTable />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
