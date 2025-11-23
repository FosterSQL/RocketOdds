const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const User = require('../models/User');
const auth = require('../middleware/auth'); // <-- your JWT middleware

function getColor(number) {
  if (number === 0) return 'green';
  const redNumbers = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  return redNumbers.has(number) ? 'red' : 'black';
}

// POST /api/spin (with betting)
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;  // from JWT
    const { amount, betType, betValue } = req.body;

    if (!amount || amount <= 0) {
      return res.json({ ok: false, error: "Invalid bet amount" });
    }

    if (!betType || !betValue) {
      return res.json({ ok: false, error: "Missing bet data" });
    }

    // Load user
    const user = await User.findById(userId);
    if (!user) return res.json({ ok: false, error: "User not found" });

    // Check balance
    if (user.balance < amount) {
      return res.json({ ok: false, error: "Insufficient balance" });
    }

    // Deduct bet immediately
    user.balance -= amount;

    // Spin the wheel
    const number = Math.floor(Math.random() * 37);
    const color = getColor(number);

    // Save the spin result as usual
    const result = new Result({ number, color });
    await result.save();

    let win = false;
    let winnings = 0;

    // Determine win based on type
    if (betType === "color") {
      if (color === betValue) {
        win = true;
        winnings = amount * 2;   // 1:1 payout
      }
    }

    if (betType === "number") {
      if (Number(betValue) === number) {
        win = true;
        winnings = amount * 36;  // 35:1 payout
      }
    }

    // If user won, add winnings
    if (win) user.balance += winnings;

    // Save user balance update
    await user.save();

    // Final response
    res.json({
      ok: true,
      result,
      win,
      winnings,
      newBalance: user.balance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
