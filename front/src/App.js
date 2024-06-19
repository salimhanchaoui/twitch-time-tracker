import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StreamerList from './StreamerList';
import TwitchRedirect from './TwitchRedirect';
import SessionInfo from './SessionInfo';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StreamerList />} />
                <Route path="/watch/:streamer" element={<TwitchRedirect />} />
                <Route path="/session/:streamer" element={<SessionInfo />} />
                {/* Other routes */}
            </Routes>
        </Router>
    );
};

export default App;
