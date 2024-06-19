const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let sessions = {};

const isValidStreamURL = (streamer, url) => {
    return url === `https://www.twitch.tv/${streamer}`;
};

app.post('/start-session', (req, res) => {
    const { streamer, streamURL } = req.body;
    if (streamer && streamURL && isValidStreamURL(streamer, streamURL)) {
        sessions[streamer] = { streamURL, startTime: Date.now(), watchTime: 0 };
        console.log(`Session started for ${streamer}`);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.post('/update-watch-time', (req, res) => {
    const { streamer, watchTime, streamURL } = req.body;
    if (sessions[streamer]) {
        if (isValidStreamURL(streamer, streamURL)) {
            sessions[streamer].watchTime = watchTime;
            res.sendStatus(200);
        } else {
            console.log(`Stream URL changed for ${streamer}, ending session.`);
            const { startTime, watchTime: currentWatchTime } = sessions[streamer];
            sessions[streamer].watchTime = currentWatchTime + Math.floor((Date.now() - startTime) / 1000);
            delete sessions[streamer];
            res.status(400).send('Stream URL changed');
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/end-session', (req, res) => {
    const { streamer, watchTime } = req.body;
    if (sessions[streamer]) {
        const { startTime, watchTime: currentWatchTime } = sessions[streamer];
        sessions[streamer].watchTime = currentWatchTime + watchTime + Math.floor((Date.now() - startTime) / 1000);
        delete sessions[streamer];
        console.log(`Session ended for ${streamer}`);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.get('/session/:streamer', (req, res) => {
    const { streamer } = req.params;
    if (sessions[streamer]) {
        res.json(sessions[streamer]);
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
