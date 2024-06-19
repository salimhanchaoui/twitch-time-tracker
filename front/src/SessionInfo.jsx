import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SessionInfo = () => {
    const { streamer } = useParams();
    const [watchTime, setWatchTime] = useState(0);
    const [streamURL, setStreamURL] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const sessionResponse = await fetch(`http://localhost:3000/session/${streamer}`);
                if (sessionResponse.ok) {
                    const sessionData = await sessionResponse.json();
                    const elapsed = Math.floor((Date.now() - sessionData.startTime) / 1000);
                    setWatchTime(elapsed + sessionData.watchTime);
                    setStreamURL(sessionData.streamURL);
                    setIsSessionActive(true);
                    setErrorMessage('');

                    // Check if the current stream URL matches
                    if (sessionData.streamURL !== `https://www.twitch.tv/${streamer}`) {
                        setIsSessionActive(false);
                    }
                } else {
                    setIsSessionActive(false);
                    setErrorMessage(`Failed to fetch session data: ${sessionResponse.status} ${sessionResponse.statusText}`);
                    console.error('Failed to fetch session data:', sessionResponse.status, sessionResponse.statusText);
                }
            } catch (error) {
                setIsSessionActive(false);
                setErrorMessage(`Error fetching session data: ${error.message}`);
                console.error('Error fetching session data:', error);
            }
        };

        fetchSessionData();
        
        // Cleanup function to clear interval or other resources if needed
        return () => {};
    }, [streamer]);

    return (
        <div>
            <h2>Session Info</h2>
            <p>Streamer: {streamer}</p>
            <p>Stream URL: {streamURL}</p>
            {errorMessage ? (
                <p>{errorMessage}</p>
            ) : (
                isSessionActive ? (
                    <p>Watch Time: {watchTime} seconds</p>
                ) : (
                    <p>Session has ended or the stream URL has changed.</p>
                )
            )}
        </div>
    );
};

export default SessionInfo;
