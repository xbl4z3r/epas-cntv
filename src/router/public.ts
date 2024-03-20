import {Router} from "express";
import BlogPostSchema from "../schemas/blog_post";
import TeamMemberSchema from "../schemas/team_member";
import ProjectSchema from "../schemas/project";
import {TriviaQuestion, TriviaSession} from "../schemas/trivia";
import AwardSchema from "../schemas/award";
import {Flashcard} from "../schemas/flashcard";

const router = Router();

router.get('/', (req, res) => {
    res.render('public/home');
});

router.get('/alegeri', (req, res) => {
    res.render('public/alegeri');
});

router.get('/educatie', (req, res) => {
    res.render('public/educatie');
});

router.get('/despre', async (req, res) => {
    const team_members = await TeamMemberSchema.find();
    const projects = await ProjectSchema.find();
    const awards = await AwardSchema.find();
    // sort by newest first
    awards.sort((a, b) => {
        if (a == null || b == null || a.year == null || b.year == null) return 0;
        if (a.year > b.year) return -1;
        if (a.year < b.year) return 1;
        return 0;
    });
    const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
    projects.sort((a, b) => {
        if (a == null || b == null || a.date == null || b.date == null) return 0;
        // date is in format "month numericYear"
        const aParts = a.date.split(' ');
        const bParts = b.date.split(' ');
        const aMonth = months.indexOf(aParts[0]);
        const bMonth = months.indexOf(bParts[0]);
        if (aParts[1] > bParts[1]) return -1;
        if (aParts[1] < bParts[1]) return 1;
        if (aMonth > bMonth) return -1;
        if (aMonth < bMonth) return 1;
        return 0;
    });
    res.render('public/despre', {team_members, projects, awards});
});

router.get('/blog', async (req, res) => {
    const posts = await BlogPostSchema.find();
    posts.sort((a, b) => {
        if (a == null || b == null || a.date == null || b.date == null) return 0;
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
    });
    res.render('public/blog', {posts});
});

router.get('/blog/:id', async (req, res) => {
    try {
        const post = await BlogPostSchema.findById(req.params.id);
        if (post) res.render('public/post', {post});
        else res.render('notfound');
    } catch (e) {
        res.render('notfound');
    }
});

router.get('/trivia', async (req, res) => {
    const action = req.query.action;
    if (action && action === 'start') {
        const username = req.query.username;
        if (!username) return res.redirect('/educatie');
        const questions = await TriviaQuestion.find();
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        for (let i = 0; i < questions.length; i++) {
            const correctAnswer = questions[i].answers[questions[i].correctAnswerIndex || 0];
            const answers = questions[i].answers;
            for (let j = answers.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [answers[j], answers[k]] = [answers[k], answers[j]];
            }
            questions[i].answers = answers;
            questions[i].correctAnswerIndex = answers.indexOf(correctAnswer);
        }
        const session = new TriviaSession({questions, name: username, startedAt: new Date(), score: 0, progress: 0});
        await session.save();
        return res.redirect('/trivia/' + session._id);
    } else {
        res.render('notfound');
    }
});

router.get('/trivia/:id', async (req, res) => {
    try {
        const session = await TriviaSession.findById(req.params.id);
        if (session) {
            if ((session.progress || 0) >= session.questions.length) {
                res.render('public/trivia_end', {session});
                TriviaSession.findByIdAndDelete(session._id).then(r => {
                });
                return;
            }
            res.render('public/trivia', {session});
        } else {
            res.render('notfound');
        }
    } catch (e) {
        res.render('notfound');
    }
});

router.post('/trivia/:id', async (req, res) => {
    try {
        const session = await TriviaSession.findById(req.params.id);
        if (session) {
            const question = session.questions[session.progress || 0];
            const data = {
                success: false,
                correctAnswerIndex: question.correctAnswerIndex
            };
            if (question.correctAnswerIndex === req.body.answer) {
                session.score = (session.score || 0) + 1;
                data.success = true;
            }
            session.progress = (session.progress || 0) + 1;
            await session.save();
            res.json(data);
        } else {
            res.json({success: false});
        }
    } catch (e) {
        res.json({success: false});
    }
});

router.get('/flashcards', async (req, res) => {
    const flashcards = await Flashcard.find();
    res.render('public/flashcards', {flashcards});
});

// Check every 6 hours all the trivia sessions and delete the ones that are older than 6 hours
setInterval(() => {
    console.log('Deleting old trivia sessions...')
    const sixHoursAgo = new Date(new Date().getTime() - 6 * 60 * 60 * 1000);
    TriviaSession.deleteMany({startedAt: {$lt: sixHoursAgo}}).then(r => {
        console.log('Deleted ' + r.deletedCount + ' sessions!');
    });
}, 6 * 60 * 60 * 1000);

export default router;