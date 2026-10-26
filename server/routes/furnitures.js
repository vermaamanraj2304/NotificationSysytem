import express from 'express';
import { db } from '../db.js';
import { notifyUser } from '../notifyService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await db.furnitures.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, category, inStock, priceMonthly, image, subscriptionEnd } = req.body;
  const inStockBool = inStock === true || inStock === 'true' || inStock === 'yes' || inStock === 1;
  
  try {
    const newFurn = await db.furnitures.create({
      name,
      category,
      inStock: inStockBool,
      priceMonthly: Number(priceMonthly),
      image: image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      subscriptionEnd: subscriptionEnd ? new Date(subscriptionEnd) : new Date(Date.now() + 86400000 * 30)
    });
    res.status(201).json(newFurn);
  } catch (err) {
    console.error('Error creating furniture product:', err.message);
    res.status(500).json({ error: 'Failed to list furniture: ' + err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, inStock, priceMonthly, image, subscriptionEnd } = req.body;
  
  try {
    const furniture = await db.furnitures.findById(id);
    if (!furniture) {
      return res.status(404).json({ error: 'Furniture item not found' });
    }

    const inStockBool = inStock === true || inStock === 'true' || inStock === 'yes' || inStock === 1;
    const wasOut = !furniture.inStock;
    const isNowIn = inStockBool;

    const updatedFurn = await db.furnitures.findByIdAndUpdate(id, {
      name,
      category,
      inStock: inStockBool,
      priceMonthly: Number(priceMonthly),
      image,
      subscriptionEnd: subscriptionEnd ? new Date(subscriptionEnd) : furniture.subscriptionEnd
    });

    if (wasOut && isNowIn) {
      const allUsers = await db.users.find();
      for (let user of allUsers) {
        if (user.wishlistedFurniture && user.wishlistedFurniture.includes(id)) {
          await notifyUser({
            userId: user._id.toString(),
            title: 'Item Restocked & Back in Stock!',
            message: `Great news! "${name}" is now back in stock and ready to rent at ₹${priceMonthly}/mo.`,
            type: 'stock',
            sendEmail: true,
            emailSubject: `Back In Stock: ${name} is available now!`
          });
        }
      }
    }

    res.json(updatedFurn);
  } catch (err) {
    console.error('Error updating furniture inventory:', err.message);
    res.status(500).json({ error: 'Failed to update inventory details: ' + err.message });
  }
});

router.post('/wishlist', async (req, res) => {
  const { userId, furnitureId } = req.body;
  if (!userId || !furnitureId) {
    return res.status(400).json({ error: 'userId and furnitureId are required' });
  }
  try {
    const user = await db.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = [...(user.wishlistedFurniture || [])];
    if (!wishlist.includes(furnitureId)) {
      wishlist.push(furnitureId);
      const updatedUser = await db.users.findByIdAndUpdate(userId, { wishlistedFurniture: wishlist });
      
      await notifyUser({
        userId,
        title: 'Stock Alert Subscribed',
        message: 'We will notify you immediately when this item is back in stock!',
        type: 'stock',
        sendEmail: false
      });

      return res.json(updatedUser);
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/restock/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const furniture = await db.furnitures.findById(id);
    if (!furniture) {
      return res.status(404).json({ error: 'Furniture item not found' });
    }

    const updatedFurn = await db.furnitures.findByIdAndUpdate(id, { inStock: true });

    const allUsers = await db.users.find();
    const alertCount = [];

    for (let user of allUsers) {
      if (user.wishlistedFurniture && user.wishlistedFurniture.includes(id)) {
        await notifyUser({
          userId: user._id.toString(),
          title: 'Item Restocked & Back in Stock!',
          message: `Great news! "${furniture.name}" is now back in stock and ready to rent at ₹${furniture.priceMonthly}/mo. Grab it before it runs out again!`,
          type: 'stock',
          sendEmail: true,
          emailSubject: `Back In Stock: ${furniture.name} is available now!`
        });
        alertCount.push(user.name);
      }
    }

    res.json({ furniture: updatedFurn, notifiedUsers: alertCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscription-end/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const furniture = await db.furnitures.findById(id);
    if (!furniture) {
      return res.status(404).json({ error: 'Furniture item not found' });
    }

    const updatedFurn = await db.furnitures.findByIdAndUpdate(id, {
      subscriptionEnd: new Date(Date.now() - 3600000)
    });

    const message = `Your subscription for the rented furniture item "${furniture.name}" has expired today. Renew now to avoid auto-collection.`;
    await notifyUser({
      userId,
      title: 'Furniture Rental Subscription Ended',
      message,
      type: 'subscription',
      sendEmail: true,
      emailSubject: `Action Required: Subscription Expired - ${furniture.name}`
    });

    res.json(updatedFurn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
