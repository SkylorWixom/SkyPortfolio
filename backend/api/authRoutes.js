// File: backend/api/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req, res) => {
  console.log('=== AUTH DEBUG START ===');
  console.log('adminUsername from env:', process.env.adminUsername);
  console.log('adminPassword from env:', process.env.adminPassword);
  console.log('jwtSecret from env:', process.env.jwtSecret);

  const { username, password } = req.body;
  console.log('Incoming credentials from client:', username, password);

  const adminUser = process.env.adminUsername;
  const adminPass = process.env.adminPassword;
  const jwtSecret = process.env.jwtSecret;

  if (!adminUser || !adminPass || !jwtSecret) {
    console.log('Env vars missing. Returning 500...');
    return res.status(500).json({
      message: 'Server not configured with admin credentials or JWT secret'
    });
  }

  if (username === adminUser && password === adminPass) {
    console.log('Credentials match. Signing token...');
    const payload = {
      sub: adminUser,
      name: 'Admin User',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    };
    const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
    console.log('=== AUTH DEBUG END: success ===');
    return res.json({ token });
  } else {
    console.log('=== AUTH DEBUG END: Invalid ===');
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});


export default router;
