
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import EventList from './components/Event-List-Component';
import EventForm from './components/Event-Form-Component';
import EventDetail from './components/Event-Details-Component';
import Layout from './components/Layout';


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/events" replace />} />
                    <Route path="events" element={<EventList />} />
                    <Route path="events/create" element={<EventForm />} />
                    <Route path="events/:id" element={<EventDetail />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;