import {Router} from "express";
import {TriviaQuestion, TriviaSession} from "../schemas/trivia";

const router = Router();

router.get('/', (req, res) => {
    let user = req.query.user;
    let pass = req.query.pass;
    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS || user == null || pass == null)
        return res.status(418).json({status: 418, message: "I'm a teapot, you're not an admin"});
    res.status(200).json({status: 200, message: "You're an admin!"});
});

router.get('/trivia/leaderboard', (req, res) => {
    let user = req.query.user;
    let pass = req.query.pass;
    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS || user == null || pass == null)
        return res.status(418).json({status: 418, message: "I'm a teapot, you're not an admin"});

    const leaderboard :{
        name: string,
        score: number,
        time: string
    }[] = [];

    // get all trivia session with a valid finishedAt date, sort by score and in case of a tie, sort by time (finishedAt - startedAt)
    TriviaSession.find({finishedAt: {$ne: null}}).sort({score: -1}).then(sessions => {
        sessions.sort((a, b) => {
            if (a == null || b == null || a.finishedAt == null || b.finishedAt == null || a.startedAt == null || b.startedAt == null || a.score == null || b.score == null) return 0;
            const startedAtA = new Date(a.startedAt);
            const finishedAtA = new Date(a.finishedAt);
            const timeA = finishedAtA.getTime() - startedAtA.getTime();
            const scoreA = a.score;

            const startedAtB = new Date(b.startedAt);
            const finishedAtB = new Date(b.finishedAt);
            const timeB = finishedAtB.getTime() - startedAtB.getTime();
            const scoreB = b.score;

            if (scoreA > scoreB) return -1;
            if (scoreA < scoreB) return 1;
            return timeA - timeB;
        });

        // remove the questions from the sessions
        sessions.forEach(session => {
            if(session.finishedAt == null || session.startedAt == null || session.score == null || session.name == null) return;
            let alreadyInLeaderboard = false;
            leaderboard.forEach(leader => {
                if(leader.name === session.name) alreadyInLeaderboard = true;
            });
            if(alreadyInLeaderboard) return;
            const startedAt = new Date(session.startedAt);
            const finishedAt = new Date(session.finishedAt);
            const time = finishedAt.getTime() - startedAt.getTime();
            let timeString = '';
            const hours = Math.floor(time / 1000 / 60 / 60);
            if (hours > 0) timeString += hours + 'h ';
            const minutes = Math.floor(time / 1000 / 60 % 60);
            if (minutes > 0) timeString += minutes + 'm ';
            const seconds = Math.floor(time / 1000 % 60);
            if (seconds > 0) timeString += seconds + 's';
            leaderboard.push({name: session.name, score: session.score, time: timeString});
        });

        res.status(200).json({status: 200, leaderboard: leaderboard});
    }).catch(e => {
        res.status(500).json({status: 500, message: "Internal server error"});
    });
});

router.get('/trivia/stats', (req, res) => {
    let user = req.query.user;
    let pass = req.query.pass;
    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS || user == null || pass == null)
        return res.status(418).json({status: 418, message: "I'm a teapot, you're not an admin"});

    const stats :{
        totalSessions: number,
        sessionsFinished: number,
        totalUniqueUsers: number,
        uniqueUsers: string[]
    } = {
        totalSessions: 0,
        sessionsFinished: 0,
        totalUniqueUsers: 0,
        uniqueUsers: []
    };

    TriviaSession.find().then(sessions => {
        stats.totalSessions = sessions.length;
        stats.sessionsFinished = sessions.filter(session => session.finishedAt != null).length;
        stats.totalUniqueUsers = new Set(sessions.map(session => session.name)).size;
        // @ts-ignore
        stats.uniqueUsers = Array.from(new Set(sessions.map(session => session.name)));
        res.status(200).json({status: 200, stats: stats});
    }).catch(e => {
        res.status(500).json({status: 500, message: "Internal server error"});
    });
});

export default router;