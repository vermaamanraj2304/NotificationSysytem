import express from 'express';
import { db } from '../db.js';
import { notifyUser } from '../notifyService.js';
import { sendNotificationEmail } from '../emailService.js';

const router = express.Router();

router.post('/terminate-account', async (req, res) => {
  const { userId, reason } = req.body;
  try {
    const user = await db.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subject = 'URGENT: Your Renting Carnival Account Has Been Terminated';
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 25px; border: 2px solid #ef4444; border-radius: 8px; max-width: 600px; margin: auto;">
        <h2 style="color: #ef4444; margin-top: 0;">Account Termination Notice</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>We regret to inform you that your Renting Carnival account associated with the email <strong>${user.email}</strong> has been terminated by the administrator, effective immediately.</p>
        <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <strong>Reason for termination:</strong><br/>
          ${reason || 'Violation of Platform Policy & Terms of Service.'}
        </div>
        <p>If you believe this is a mistake, contact our dispute resolution desk.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 11px; color: #999;">Security Notice: This account status is final. Please return any outstanding active rented items immediately.</p>
      </div>
    `;

    await sendNotificationEmail(user.email, subject, `Your account has been terminated due to: ${reason}`, htmlContent);
    res.json({ message: 'Termination email dispatched successfully.', userEmail: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/custom-notification', async (req, res) => {
  const { userId, title, message } = req.body;
  try {
    const user = await db.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = await notifyUser({
      userId,
      title,
      message,
      type: 'custom',
      sendEmail: false
    });

    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/marketing-notification', async (req, res) => {
  const { title, message } = req.body;
  try {
    const allUsers = await db.users.find();
    const list = [];

    const emailSubject = `Renting Carnival Promo: ${title || 'Special Promotion'}`;
    const emailText = message || 'Discover hot deals on properties and furniture this week only.';
    const emailHtml = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 25px; border: 2px solid #3b82f6; border-radius: 12px; margin: auto;">
        <h2 style="color: #3b82f6; margin-top: 0;">${title || 'Exclusive Marketing Offer!'}</h2>
        <p>Hi,</p>
        <p>${emailText}</p>
        <br/>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
        <p style="font-size: 11px; color: #777;">This is a promotional broadcast message from Renting Carnival.</p>
      </div>
    `;

    for (let user of allUsers) {
      if (user.role !== 'admin' && user.email) {
        try {
          await sendNotificationEmail(user.email, emailSubject, emailText, emailHtml);
          list.push(user.name);
        } catch (err) {
          console.error(`Failed to send marketing email to ${user.email}:`, err.message);
        }
      }
    }
    res.json({ success: true, notifiedCount: list.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
