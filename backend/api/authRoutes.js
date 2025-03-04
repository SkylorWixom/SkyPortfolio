// File: backend/api/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  // Log out what the server sees for debugging
  console.log('Render env adminUsername =', process.env.adminUsername);
  console.log('Render env adminPassword =', process.env.adminPassword);
  console.log('Render env jwtSecret    =', process.env.jwtSecret);

  const { username, password } = req.body;

  // env-based credentials + secret
  const adminUser = process.env.adminUsername;
  const adminPass = process.env.adminPassword;
  const jwtSecret = process.env.jwtSecret;

  // If missing env vars, throw an error
  if (!adminUser || !adminPass || !jwtSecret) {
    return res
      .status(500)
      .json({ message: 'Server not configured with admin credentials or JWT secret' });
  }

  // Check credentials
  if (username === adminUser && password === adminPass) {
    // Sign a real JWT
    const payload = {
      sub: adminUser,
      name: 'Admin User',
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours from now
    };

    const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
    return res.json({ token });
  } else {
    // invalid credentials
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;
