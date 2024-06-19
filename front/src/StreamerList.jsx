import React from 'react';
import { Link } from 'react-router-dom';

const streamers = ['kawaknighttv', 'frydasolebh', 'babymobbie']; // Replace with your list of streamers

const StreamerList = () => {
    return (
        <div>
            <h1>Streamer List</h1>
            <ul>
                {streamers.map((streamer) => (
                    <li key={streamer}>
                        <Link to={`/watch/${streamer}`}>{streamer}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StreamerList;
