import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {join} from 'path';
import dotenv from 'dotenv';
import * as path from "path";
import favicon from "express-favicon";

const app = express();
dotenv.config();

// @ts-ignore
mongoose.connect(process.env.DATABASE_URI).then(r => {
    console.log('Successfully connected to the database!');
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

app.use('/admin', require('./router/admin').default);
app.use('/', require('./router/public').default);

app.get('*', (req, res) => {
    res.render('notfound');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});