import express from 'express';
import { db, memoryDb } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.emails.getSent());
});

router.post('/clear', (req, res) => {
  memoryDb.emailsSent = [];
  res.json({ success: true });
});

export default router;
