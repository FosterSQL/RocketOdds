const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ ok: false, error: 'User already exists' });

    const user = new User({ username, email, password });
    await user.save();
    const out = user.toObject();
    delete out.password;
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '7d' });
    res.status(201).json({ ok: true, user: out, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    const out = user.toObject();
    delete out.password;
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ ok: true, user: out, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

  } catch (err) {
    res.status(500).json({ ok: false, error: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
};

exports.updateBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    if (typeof amount !== 'number') return res.status(400).json({ ok: false, error: 'Invalid amount' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ ok: false, error: 'Not found' });
    user.balance = amount;
    await user.save();
    const out = user.toObject();
    delete out.password;
    res.json({ ok: true, user: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
};
