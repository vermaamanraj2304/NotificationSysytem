import express from 'express';
import { db } from '../db.js';
import { notifyUser } from '../notifyService.js';
import { sendNotificationEmail } from '../emailService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const props = await db.properties.find();
    res.json(props);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, city, price, type, image } = req.body;
  try {
    const newProperty = await db.properties.create({ title, city, price, type, image });

    const allUsers = await db.users.find();
    for (let user of allUsers) {
      const prefs = user.searchPreferences;
      let isMatch = false;
      let matchReason = '';

      if (prefs) {
        if (prefs.city && prefs.priceMax && prefs.propertyType) {
          if (
            city.toLowerCase() === prefs.city.toLowerCase() &&
            price <= prefs.priceMax &&
            type.toLowerCase() === prefs.propertyType.toLowerCase()
          ) {
            isMatch = true;
            matchReason = 'your saved preferences';
          }
        }
        
        if (!isMatch && prefs.lastSearchQuery) {
          const ls = prefs.lastSearchQuery.toLowerCase();
          if (
            title.toLowerCase().includes(ls) ||
            city.toLowerCase().includes(ls) ||
            type.toLowerCase().includes(ls)
          ) {
            isMatch = true;
            matchReason = `your search for "${prefs.lastSearchQuery}"`;
          }
        }
      }

      if (isMatch) {
        await notifyUser({
          userId: user._id.toString(),
          title: 'New Matching Property Listed!',
          message: `A new property matching ${matchReason} just became available: "${title}" in ${city} for ₹${price}/mo.`,
          type: 'property',
          sendEmail: true,
          emailSubject: `Renting Carnival Alert: New property matching your interest`
        });
      }
    }

    res.status(201).json(newProperty);
  } catch (err) {
    console.error('Error creating property listing:', err.message);
    res.status(500).json({ error: 'Failed to list property: ' + err.message });
  }
});

router.post('/search', async (req, res) => {
  const { userId, query } = req.body;
  try {
    const properties = await db.properties.find();
    let matched = properties;
    
    if (query) {
      const q = query.toLowerCase();
      matched = properties.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.city.toLowerCase().includes(q) || 
        p.type.toLowerCase().includes(q)
      );
    }

    if (userId && query) {
      const user = await db.users.findById(userId);
      if (user) {
        const prefs = user.searchPreferences || {};
        prefs.lastSearchQuery = query;
        await db.users.findByIdAndUpdate(userId, { searchPreferences: prefs });
      }
    }

    if (userId && query && matched.length > 0) {
      const featured = matched[Math.floor(Math.random() * matched.length)];
      setTimeout(async () => {
        try {
          await notifyUser({
            userId,
            title: 'Interested in this property?',
            message: `We noticed you searched for "${query}". Are you interested in "${featured.title}" in ${featured.city} listed for ₹${featured.price}/mo?`,
            type: 'property',
            sendEmail: true,
            emailSubject: `Interested in ${featured.title}?`
          });
          console.log(`[DELAYED NOTIFICATION] Dispatched automated search matching alert for user ${userId} after 1 min.`);
        } catch (err) {
          console.error('Error delivering delayed search notification:', err.message);
        }
      }, 60000);
    }

    res.json(matched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/click', async (req, res) => {
  const { userId, propertyId } = req.body;
  if (!userId || !propertyId) {
    return res.status(400).json({ error: 'userId and propertyId are required' });
  }

  try {
    const user = await db.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const properties = await db.properties.find();
    const clickedProp = properties.find(p => p._id.toString() === propertyId.toString());
    if (!clickedProp) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const similar = properties.filter(p => 
      p._id.toString() !== propertyId.toString() && 
      (p.city.toLowerCase() === clickedProp.city.toLowerCase() || 
       p.type.toLowerCase() === clickedProp.type.toLowerCase())
    );

    if (similar.length > 0) {
      const listHtml = similar.map(p => `
        <li style="margin-bottom: 12px; list-style-type: none; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fafafa;">
          <strong>${p.title}</strong> - ${p.type} in ${p.city} (₹${p.price}/mo)
        </li>
      `).join('');

      const subject = `Renting Carnival: Similar Properties to ${clickedProp.title}`;
      const emailHtml = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #f97316; border-radius: 12px;">
          <h2 style="color: #f97316; margin-top: 0;">Recommendations for you</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We saw you looking at <strong>${clickedProp.title}</strong> in ${clickedProp.city}. Here are similar listings that might interest you:</p>
          <ul style="padding: 0;">
            ${listHtml}
          </ul>
          <br/>
          <p style="font-size: 11px; color: #777;">This email was sent via SMTP because you clicked a property on Renting Carnival.</p>
        </div>
      `;

      setTimeout(async () => {
        try {
          await sendNotificationEmail(user.email, subject, `Similar properties recommendations: ${similar.map(s => s.title).join(', ')}`, emailHtml);

          await notifyUser({
            userId,
            title: 'Interested in this property?',
            message: `We noticed you looked at "${clickedProp.title}" in ${clickedProp.city} listed for ₹${clickedProp.price}/mo. Let us know if you would like to apply or schedule a viewing!`,
            type: 'property',
            sendEmail: false
          });
          console.log(`[DELAYED NOTIFICATION] Dispatched property recommendations to ${user.email} after 1 min delay.`);
        } catch (err) {
          console.error('Error delivering delayed property click notification:', err.message);
        }
      }, 60000);
    }

    res.json({ success: true, message: 'Interest registered. Recommendations email and notification scheduled to dispatch in 1 minute.', similarCount: similar.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
