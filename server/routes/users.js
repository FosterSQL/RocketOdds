const express = require('express');
const router = express.Router();
const users = require('../controllers/usersController');
const auth = require('../middleware/auth');

router.get('/me', auth, users.getMyProfile);
router.get('/:id', users.getProfile);

router.post('/register', users.register);
router.post('/login', users.login);

router.patch('/:id/balance', auth, async (req, res, next) => {
  const { id } = req.params;
  if (!req.user || req.user.id !== id)
    return res.status(403).json({ ok: false, error: 'Forbidden' });

  return users.updateBalance(req, res, next);
});

module.exports = router;
