import { db } from './db.js';
import { sendNotificationEmail } from './emailService.js';

let ioInstance = null;
let clientsMap = null;

export const initNotifyService = (io, connectedClients) => {
  ioInstance = io;
  clientsMap = connectedClients;
};

export const notifyUser = async ({ userId, title, message, type, sendEmail, emailSubject }) => {
  const notification = await db.notifications.create({
    userId,
    title,
    message,
    type
  });

  if (clientsMap && ioInstance) {
    const socketId = clientsMap.get(userId);
    if (socketId) {
      ioInstance.to(socketId).emit('notification', notification);
      console.log(`[SOCKET] Dispatched real-time alert to user ${userId}`);
    }
  }

  if (sendEmail) {
    try {
      const user = await db.users.findById(userId);
      const emailTo = user ? user.email : userId;
      const subject = emailSubject || `New Alert: ${title}`;
      const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #f97316;">Renting Carnival</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <h3>${title}</h3>
          <p>${message}</p>
          <br />
          <p style="font-size: 12px; color: #777;">This is an automated notification from your Renting Carnival account.</p>
        </div>
      `;
      await sendNotificationEmail(emailTo, subject, message, html);
    } catch (err) {
      console.error('[Notification Service] Failed to send email alert:', err.message);
    }
  }

  return notification;
};
