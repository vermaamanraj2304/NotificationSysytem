import express from 'express';
import { db } from '../db.js';
import { notifyUser } from '../notifyService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    const existing = await db.users.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const user = await db.users.create({
      name,
      email,
      password,
      role: role || 'user',
      searchPreferences: {},
      wishlistedFurniture: []
    });
    
    await notifyUser({
      userId: user._id.toString(),
      title: 'Welcome to Renting Carnival!',
      message: `Hey ${name}, thank you for registering. Explore properties and furniture items today!`,
      type: 'system',
      sendEmail: true,
      emailSubject: 'Welcome to Renting Carnival'
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await db.users.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await db.users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  const { name, email, password, role, searchPreferences, wishlistedFurniture } = req.body;
  try {
    const user = await db.users.create({
      name,
      email,
      password: password || 'password',
      role: role || 'user',
      searchPreferences: searchPreferences || {},
      wishlistedFurniture: wishlistedFurniture || []
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users/preferences', async (req, res) => {
  const { userId, city, priceMax, propertyType } = req.body;
  try {
    const updatedUser = await db.users.findByIdAndUpdate(userId, {
      searchPreferences: { city, priceMax, propertyType }
    });

    const properties = await db.properties.find();
    const matched = properties.filter(p => 
      p.city.toLowerCase() === city.toLowerCase() && 
      p.price <= priceMax && 
      p.type.toLowerCase() === propertyType.toLowerCase()
    );

    if (matched.length > 0) {
      await notifyUser({
        userId,
        title: 'Properties Matching Your Search Found!',
        message: `We found ${matched.length} properties matching your preferences in ${city} under ₹${priceMax}.`,
        type: 'property',
        sendEmail: true,
        emailSubject: 'Matching Properties Available!'
      });
    }

    res.json({ user: updatedUser, matchedCount: matched.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
