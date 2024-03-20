import {Router} from "express";

const router = Router();

router.get('/', (req, res) => {
    let user = req.query.user;
    let pass = req.query.pass;
    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS || user == null || pass == null)
        return res.status(418).json({status: 418, message: "I'm a teapot, you're not an admin"});
    res.status(200).json({status: 200, message: "You're an admin!"});
});

export default router;