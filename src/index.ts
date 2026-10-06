import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as path from 'path';
import {join} from 'path';
import dotenv from 'dotenv';
import favicon from "express-favicon";
import {TriviaSession} from "./schemas/trivia";

const app = express();
dotenv.config();

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
if (MAINTENANCE_MODE) {
    console.log('Maintenance mode enabled!');
}

// @ts-ignore
mongoose.connect(process.env.DATABASE_URI).then(r => {
    console.log('Successfully connected to the database!');
    purgeOldTriviaSessions()
    // Check every 6 hours all the trivia sessions and delete the ones that are older than 6 hours
    setInterval(() => {
        purgeOldTriviaSessions()
    }, 6 * 60 * 60 * 1000);
}).catch(e => {
    console.log('Error connecting to the database!');
    console.log(e);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "../views"));
app.use(favicon(path.join(__dirname, '../static', 'logo.ico')));
app.use(express.static(join(__dirname, '../static')));

if(!MAINTENANCE_MODE) {
    app.use('/admin', require('./router/admin').default);
    app.use('/', require('./router/public').default);
} else {
    app.get('/', (req, res) => {
        res.send(process.env.MAINTENANCE_MESSAGE || 'Site in maintenance mode!');
    })
}

app.get('*', (req, res) => {
    res.render('notfound');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    if (process.env.ENABLE_SELF_PING === 'true') {
        setInterval(() => {
            selfPing()
        }, 30 * 1000);
    }
});

const purgeOldTriviaSessions = () => {
    console.log('Deleting old trivia sessions...')
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    TriviaSession.find({startedAt: {$lt: sixHoursAgo}}).then(sessions => {
        sessions.forEach(session => {
            if (session.finishedAt == null) TriviaSession.findByIdAndDelete(session._id).then(r => {
            });
        });
    });
}

const selfPing = () => {
    const pingUrl = process.env.APP_URL || 'http://epas-cntv.com';
    require('http').get(pingUrl, () => {});
};