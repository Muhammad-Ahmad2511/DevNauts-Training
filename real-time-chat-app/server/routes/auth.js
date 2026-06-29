const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/user');

function parseCredentials(body) {
  const { username, password } = body;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return { error: 'Username and password must be strings' };
  }
  const trimmedUsername = username.trim();
  if (!trimmedUsername || !password) {
    return { error: 'Username and password are required' };
  }
  return { username: trimmedUsername, password };
}

// Register
router.post('/register', async (req, res) => {
  try {
    const parsed = parseCredentials(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const { username, password } = parsed;

    // Check if user already exists
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const parsed = parseCredentials(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const { username, password } = parsed;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;