const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user_models");

const SECRET = process.env.JWT_SECRET || "dev_secret_key";

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.getOneByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET, { expiresIn: "2h" });
        res.status(200).json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashed });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { login, signup };
