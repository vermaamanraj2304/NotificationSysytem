import express from 'express';
import { db } from '../db.js';
import { notifyUser } from '../notifyService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id, title, content, image } = req.body;
  try {
    const blog = await db.blogs.create({ id, title, content, image });

    // Send notifications to all standard users in-app
    const allUsers = await db.users.find();
    const titleText = 'New Insight Published!';
    const messageText = `Check out our latest article: "${title}".`;

    for (let user of allUsers) {
      if (user.role !== 'admin') {
        await notifyUser({
          userId: user._id.toString(),
          title: titleText,
          message: messageText,
          type: 'blog',
          sendEmail: false
        });
      }
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const blogs = await db.blogs.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
