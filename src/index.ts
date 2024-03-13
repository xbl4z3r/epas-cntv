import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {join} from 'path';
import dotenv from 'dotenv';

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
app.set("views", join(__dirname, "views").replace("src", "dist").replace("dist/", '').replace("dist\\", ''));

app.use(express.static(join(__dirname, "static").replace("src", "dist").replace("dist/", '').replace("dist\\", '')));

app.use('/admin', require('./routers/admin').default);
app.use('/', require('./routers/public').default);

app.get('*', (req, res) => {
    res.render('notfound');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});