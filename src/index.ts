import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {join} from 'path';
import dotenv from 'dotenv';
import BlogPostSchema from "./schemas/blog_post";

const app = express();
dotenv.config();

// @ts-ignore
mongoose.connect(process.env.DATABASE_URI).then(r => {
    console.log('Connected to mongodb');
}).catch(e => {
    console.log('Error connecting to mongodb');
    console.log(e);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set("views", join(__dirname, "views").replace("src/", "dist/").replace("dist/", ''));

app.use(express.static(join(__dirname, "public").replace("src/", "dist/").replace("dist/", '')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/despre', (req, res) => {
    res.render('despre');
});

app.get('/alegeri', (req, res) => {
    res.render('alegeri');
});

app.get('/blog', async (req, res) => {
    const posts = await BlogPostSchema.find();
    // sort by date
    posts.sort((a, b) => {
        if(a == null || b == null || a.date == null || b.date == null) return 0;
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
    });
    res.render('blog', {posts});
});

app.get('/blog/:id', async (req, res) => {
    try {
        const post = await BlogPostSchema.findById(req.params.id);
        if (!post) res.render('notfound');
        else res.render('post', {post});
    } catch (e) {
        res.render('notfound');
    }
});

app.get('/trivia/:id', (req, res) => {
    res.render('trivia', {id: req.params.id});
});

app.get('/api/trivia/:id', (req, res) => {
    res.json({id: req.params.id});
});

app.get('*', (req, res) => {
    res.render('notfound');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});