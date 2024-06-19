import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TwitchRedirect = () => {
    const { streamer } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        startSession(streamer)
            .then(() => {
                const twitchURL = `https://www.twitch.tv/${streamer}`;
                const newTab = window.open(twitchURL, '_blank');
                console.log("nn",newTab)
                const checkTabClosed = setInterval(() => {
                    if (newTab && newTab.closed) {
                        clearInterval(checkTabClosed);
                        endSession(streamer);
                        navigate(`/session/${streamer}`);
                    }
                }, 1000);

                return () => clearInterval(checkTabClosed);
            })
            .catch(error => {
                console.error('Error starting session:', error);
                // Handle error or display message to user
            });
    }, [streamer, navigate]);

    const startSession = async (streamer) => {
        try {
            const response = await fetch('http://localhost:3000/start-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ streamer, streamURL: `https://www.twitch.tv/${streamer}` }),
            });

            if (response.ok) {
                console.log('Session started successfully');
            } else {
                console.error('Failed to start session:', response.status, response.statusText);
                // Handle failure to start session
            }
        } catch (error) {
            console.error('Error starting session:', error);
            // Handle error or display message to user
        }
    };

    const endSession = async (streamer) => {
        try {
            const response = await fetch(`http://localhost:3000/session/${streamer}`);
            if (response.ok) {
                const sessionData = await response.json();
                const elapsed = Math.floor((Date.now() - sessionData.startTime) / 1000);
                await fetch('http://localhost:3000/end-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ streamer, watchTime: elapsed }),
                });
            } else {
                console.error('Failed to fetch session data:', response.status, response.statusText);
                // Handle failure to fetch session data
            }
        } catch (error) {
            console.error('Error ending session:', error);
            // Handle error or display message to user
        }
    };

    return (
        <div>
            <h2>Redirecting to {streamer}'s stream...</h2>
        </div>
    );
};


export default TwitchRedirect;
