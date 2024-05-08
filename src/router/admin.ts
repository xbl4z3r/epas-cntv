import {Router} from "express";
import {TriviaSession} from "../schemas/trivia";

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

    // get all trivia session with a valid finishedAt date, sort by score and in case of a tie, sort by time (finishedAt - startedAt)
    TriviaSession.find({finishedAt: {$ne: null}}).sort({score: -1, finishedAt: 1}).then(sessions => {
        res.status(200).json(sessions);
    }).catch(e => {
        res.status(500).json({status: 500, message: "Internal server error"});
    });
});

export default router;