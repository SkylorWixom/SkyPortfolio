// authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // env-based credentials + secret
  const adminUser = process.env.adminUsername;
  const adminPass = process.env.adminPassword;
  const jwtSecret = process.env.jwtSecret;
  

  // If missing env vars, throw an error
  if (!adminUser || !adminPass || !jwtSecret) {
    return res.status(500).json({ message: 'Server not configured with admin credentials or JWT secret' });
  }

  // Check credentials
  if (username === adminUser && password === adminPass) {
    const payload = {
      sub: adminUser,
      name: 'Admin User',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
    res.json({ token });
  } else {
    // invalid credentials
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;
