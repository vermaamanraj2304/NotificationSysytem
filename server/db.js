import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import Blog from './models/Blog.js';
import Furniture from './models/Furniture.js';
import Notification from './models/Notification.js';

// Fallback in-memory database
export const memoryDb = {
  users: [
    {
      _id: 'admin_1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
      searchPreferences: {},
      wishlistedFurniture: [],
      createdAt: new Date()
    }
  ],
  properties: [],
  blogs: [],
  furnitures: [],
  notifications: [],
  emailsSent: []
};

const seedDB = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany([
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password',
          role: 'admin',
          searchPreferences: {},
          wishlistedFurniture: []
        }
      ]);
      console.log('>>> Seeded initial Administrator user.');
    }
  } catch (err) {
    console.error('>>> Seeding failed:', err.message);
  }
};

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notification-db';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log('>>> Connected to MongoDB successfully.');
    await seedDB();
  } catch (error) {
    isMongoConnected = false;
    console.log('>>> MongoDB Connection failed. Falling back to IN-MEMORY DATABASE.');
  }
};

export const db = {
  isMongo: () => isMongoConnected,

  users: {
    find: async (query = {}) => {
      if (isMongoConnected) return await User.find(query);
      return memoryDb.users.filter(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findOne: async (query = {}) => {
      if (isMongoConnected) return await User.findOne(query);
      return memoryDb.users.find(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },
    findById: async (id) => {
      if (isMongoConnected) return await User.findById(id);
      return memoryDb.users.find(u => u._id === id) || null;
    },
    create: async (data) => {
      if (isMongoConnected) return await User.create(data);
      const newUser = { _id: 'user_' + Date.now(), ...data, createdAt: new Date() };
      memoryDb.users.push(newUser);
      return newUser;
    },
    findByIdAndUpdate: async (id, update) => {
      if (isMongoConnected) return await User.findByIdAndUpdate(id, update, { new: true });
      const index = memoryDb.users.findIndex(u => u._id === id);
      if (index !== -1) {
        memoryDb.users[index] = { ...memoryDb.users[index], ...update };
        return memoryDb.users[index];
      }
      return null;
    }
  },

  properties: {
    find: async (query = {}) => {
      if (isMongoConnected) return await Property.find(query);
      return memoryDb.properties;
    },
    create: async (data) => {
      if (isMongoConnected) return await Property.create(data);
      const newProp = { _id: 'prop_' + Date.now(), ...data, createdAt: new Date() };
      memoryDb.properties.push(newProp);
      return newProp;
    }
  },

  blogs: {
    find: async () => {
      if (isMongoConnected) return await Blog.find().sort({ updatedAt: -1 });
      return [...memoryDb.blogs].sort((a, b) => b.updatedAt - a.updatedAt);
    },
    create: async (data) => {
      if (isMongoConnected) return await Blog.create(data);
      const newBlog = { _id: 'blog_' + Date.now(), ...data, updatedAt: new Date() };
      memoryDb.blogs.push(newBlog);
      return newBlog;
    },
    findByIdAndUpdate: async (id, update) => {
      if (isMongoConnected) return await Blog.findByIdAndUpdate(id, update, { new: true });
      const index = memoryDb.blogs.findIndex(b => b._id === id);
      if (index !== -1) {
        memoryDb.blogs[index] = { ...memoryDb.blogs[index], ...update, updatedAt: new Date() };
        return memoryDb.blogs[index];
      }
      return null;
    }
  },

  furnitures: {
    find: async (query = {}) => {
      if (isMongoConnected) return await Furniture.find(query);
      return memoryDb.furnitures.filter(f => {
        if (query.inStock !== undefined && f.inStock !== query.inStock) return false;
        return true;
      });
    },
    findById: async (id) => {
      if (isMongoConnected) return await Furniture.findById(id);
      return memoryDb.furnitures.find(f => f._id === id) || null;
    },
    create: async (data) => {
      if (isMongoConnected) return await Furniture.create(data);
      const newFurn = { _id: 'furn_' + Date.now(), ...data };
      memoryDb.furnitures.push(newFurn);
      return newFurn;
    },
    findByIdAndUpdate: async (id, update) => {
      if (isMongoConnected) return await Furniture.findByIdAndUpdate(id, update, { new: true });
      const index = memoryDb.furnitures.findIndex(f => f._id === id);
      if (index !== -1) {
        memoryDb.furnitures[index] = { ...memoryDb.furnitures[index], ...update };
        return memoryDb.furnitures[index];
      }
      return null;
    }
  },

  notifications: {
    find: async (query = {}) => {
      if (isMongoConnected) return await Notification.find(query).sort({ createdAt: -1 });
      return memoryDb.notifications
        .filter(n => n.userId === query.userId)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    create: async (data) => {
      if (isMongoConnected) return await Notification.create(data);
      const newNotif = { _id: 'notif_' + Date.now(), ...data, read: false, createdAt: new Date() };
      memoryDb.notifications.push(newNotif);
      return newNotif;
    },
    updateMany: async (query = {}, update = {}) => {
      if (isMongoConnected) return await Notification.updateMany(query, update);
      memoryDb.notifications.forEach(n => {
        if (n.userId === query.userId) {
          if (update.read !== undefined) n.read = update.read;
        }
      });
      return { modifiedCount: memoryDb.notifications.length };
    },
    deleteOne: async (id) => {
      if (isMongoConnected) {
        try {
          return await Notification.findByIdAndDelete(id);
        } catch (err) {
          return await Notification.deleteOne({ _id: id });
        }
      }
      const index = memoryDb.notifications.findIndex(n => n._id === id);
      if (index !== -1) {
        memoryDb.notifications.splice(index, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    }
  },

  emails: {
    sendMock: (to, subject, html) => {
      const emailRecord = {
        id: 'email_' + Date.now(),
        to,
        subject,
        html,
        sentAt: new Date()
      };
      memoryDb.emailsSent.unshift(emailRecord);
      console.log(`[EMAIL SIMULATOR] Sent email to: ${to} | Subject: ${subject}`);
      return emailRecord;
    },
    getSent: () => {
      return memoryDb.emailsSent;
    }
  }
};
