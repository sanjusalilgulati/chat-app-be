const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { encrypt, decrypt } = require('../config/utils');

/**
 *  User Registration API 
 *  name || email || password Required to hit this API
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ error: "All Fields are Mandatory" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });

    } catch (err) {

        res.status(500).json({ error: err.message });
    }
});

/**
 *  With this API user Login With email and password
 */

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and Password required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Using JWT for generate a token to Authorise the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' }); // You can set a time when you want expire a token

       res.status(200).json({message : "Login Success", token : token, user});

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
});

module.exports = router;
