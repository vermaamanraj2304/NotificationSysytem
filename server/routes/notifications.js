import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await db.notifications.find({ userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/read/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await db.notifications.updateMany({ userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.notifications.deleteOne(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting notification:', err.message);
    res.status(500).json({ error: 'Failed to delete notification: ' + err.message });
  }
});

export default router;
