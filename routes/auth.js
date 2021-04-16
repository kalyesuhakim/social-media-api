const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user');
//register
router.post("/register", async (req, res) => {
    
    try {
        //new hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        
        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        //find user in database
        const user = await User.findOne({ email:req.body.email });
        !user && res.status(404).send("user not found")

        //compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Wrong password")

        //if all true
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})







module.exports = router;