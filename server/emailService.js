import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { db } from './db.js';

// Load environment variables immediately
dotenv.config();

let transporter = null;

const initTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('>>> SMTP Transporter configured from .env variables.');
    
    transporter.verify((error, success) => {
      if (error) {
        console.error('>>> SMTP Connection Verification FAILED:', error.message);
      } else {
        console.log('>>> SMTP Server is fully verified and ready to deliver real messages.');
      }
    });
  } else {
    try {
      console.log('>>> No SMTP configuration found in .env. Creating dynamic SMTP test account via Ethereal Email...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`>>> Ethereal SMTP Configured successfully!`);
      console.log(`    SMTP User: ${testAccount.user}`);
      console.log(`    SMTP Pass: ${testAccount.pass}`);
    } catch (err) {
      console.error('>>> Failed to initialize dynamic SMTP test account:', err.message);
    }
  }
};

initTransporter();

export const sendNotificationEmail = async (to, subject, text, htmlContent) => {
  // Save to local simulator log
  const mockEmail = db.emails.sendMock(to, subject, htmlContent || text);

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Renting Carnival Notifications" <notifications@rentingcarnival.com>',
        to,
        subject,
        text,
        html: htmlContent
      });
      console.log(`[SMTP] Email successfully sent to ${to}`);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[SMTP Preview Link] View sent email here: ${previewUrl}`);
        if (mockEmail) {
          mockEmail.previewUrl = previewUrl;
        }
      }
    } catch (err) {
      console.error('[SMTP Error] Could not send email via transporter:', err.message);
    }
  } else {
    console.log(`[Email Service] Mock email log generated for ${to} (Transporter not ready)`);
  }
};
