import {Router} from "express";
import BlogPostSchema from "../schemas/blog_post";
import TeamMemberSchema from "../schemas/team_member";
import ProjectSchema from "../schemas/project";

const router = Router();

router.get('/', (req, res) => {
    res.render('public/home');
});

router.get('/despre', async (req, res) => {
    const team_members = await TeamMemberSchema.find();
    const projects = await ProjectSchema.find();
    res.render('public/despre', {team_members, projects});
});

router.get('/alegeri', (req, res) => {
    res.render('public/alegeri');
});

router.get('/blog', async (req, res) => {
    const posts = await BlogPostSchema.find();
    // sort by date
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

export default router;