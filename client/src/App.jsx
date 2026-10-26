import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { 
  Bell, 
  Home, 
  BookOpen, 
  Clock, 
  Package, 
  Sparkles 
} from 'lucide-react';

// Subcomponents
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import PropertyList from './components/PropertyList';
import FurnitureList from './components/FurnitureList';
import BlogSection from './components/BlogSection';
import NotificationLog from './components/NotificationLog';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '';

function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('user');

  // Core data states
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [furnitures, setFurnitures] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  
  // Socket.io connection state
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Preference Form
  const [city, setCity] = useState('Delhi');
  const [priceMax, setPriceMax] = useState(40000);
  const [propertyType, setPropertyType] = useState('2BHK');

  // UI state
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const fetchData = async () => {
    try {
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      setUsers(usersData);

      const propRes = await fetch('/api/properties');
      const propData = await propRes.json();
      setProperties(propData);

      const furnRes = await fetch('/api/furnitures');
      const furnData = await furnRes.json();
      setFurnitures(furnData);

      const blogRes = await fetch('/api/blogs');
      const blogData = await blogRes.json();
      setBlogs(blogData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const fetchNotifications = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/notifications/${userId}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();

    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing persisted user:', err);
      }
    }

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setSocketConnected(true);
    });

    newSocket.on('disconnect', () => {
      setSocketConnected(false);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications(currentUser._id);
      if (currentUser.searchPreferences) {
        setCity(currentUser.searchPreferences.city || 'Delhi');
        setPriceMax(currentUser.searchPreferences.priceMax || 40000);
        setPropertyType(currentUser.searchPreferences.propertyType || '2BHK');
      }
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit('register', currentUser._id);

      socket.off('notification');
      socket.on('notification', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
      });
    }
  }, [socket, currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
      } else {
        console.warn(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: regName, 
          email: regEmail, 
          password: regPassword, 
          role: regRole 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        setUsers(usersData);
      } else {
        console.warn(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    localStorage.removeItem('currentUser');
  };

  const handleUserChange = (e) => {
    const val = e.target.value;
    if (!val) {
      handleLogout();
      return;
    }
    const selected = users.find(u => u._id === val);
    if (selected) {
      setCurrentUser(selected);
      localStorage.setItem('currentUser', JSON.stringify(selected));
    }
  };

  const handlePropertySearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser ? currentUser._id : null,
          query: searchQuery
        })
      });
      const data = await res.json();
      setProperties(data);
      if (currentUser) {
        fetchNotifications(currentUser._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePropertyClick = async (propertyId) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/properties/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          propertyId
        })
      });
      const data = await res.json();
      if (res.ok) {
        fetchNotifications(currentUser._id);
        if (data.similarCount > 0) {
          console.log(`Recommendations email queued to send to ${currentUser.email}.`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const res = await fetch('/api/users/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          city,
          priceMax: Number(priceMax),
          propertyType
        })
      });
      const result = await res.json();
      if (result.user) {
        setCurrentUser(result.user);
        setUsers(users.map(u => u._id === result.user._id ? result.user : u));
      }
      fetchNotifications(currentUser._id);
      console.log(`Preferences Saved! Properties matched: ${result.matchedCount}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateExpiry = async (furnId) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/furnitures/subscription-end/${furnId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
      const result = await res.json();
      setFurnitures(furnitures.map(f => f._id === furnId ? result : f));
      fetchNotifications(currentUser._id);
      console.log('Subscription ended. Expiry warning notification generated!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlist = async (furnId) => {
    if (!currentUser) return;
    try {
      const wishlist = [...(currentUser.wishlistedFurniture || [])];
      if (wishlist.includes(furnId)) {
        console.warn('Already wishlisted for restock updates!');
        return;
      }

      const res = await fetch('/api/furnitures/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          furnitureId: furnId
        })
      });
      const updatedUser = await res.json();
      if (res.ok) {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
        fetchNotifications(currentUser._id);
        console.log('Subscribed to stock notifications for this item.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    if (!currentUser) return;
    try {
      await fetch(`/api/notifications/read/${currentUser._id}`, { method: 'POST' });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setNotifications(notifications.filter(n => n._id !== id));
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          console.error('Failed to delete notification:', errData.error);
        } else {
          console.error(`Failed to delete notification: Server returned status ${res.status}`);
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'property': return <Home size={14} className="text-indigo-500" />;
      case 'blog': return <BookOpen size={14} className="text-emerald-500" />;
      case 'subscription': return <Clock size={14} className="text-rose-500" />;
      case 'stock': return <Package size={14} className="text-amber-500" />;
      case 'custom': return <Sparkles size={14} className="text-purple-500" />;
      default: return <Bell size={14} />;
    }
  };

  // Auth Screen
  if (!currentUser) {
    return (
      <Auth 
        authMode={authMode}
        setAuthMode={setAuthMode}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        regName={regName}
        setRegName={setRegName}
        regEmail={regEmail}
        setRegEmail={setRegEmail}
        regPassword={regPassword}
        setRegPassword={setRegPassword}
        regRole={regRole}
        setRegRole={setRegRole}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        users={users}
        handleUserChange={handleUserChange}
      />
    );
  }

  return (
    <div className="client-container">
      {/* Navigation Header */}
      <Navbar 
        currentUser={currentUser}
        users={users}
        socketConnected={socketConnected}
        unreadCount={unreadCount}
        notifications={notifications}
        isNotifOpen={isNotifOpen}
        setIsNotifOpen={setIsNotifOpen}
        markAllRead={markAllRead}
        getNotifIcon={getNotifIcon}
        handleUserChange={handleUserChange}
        handleLogout={handleLogout}
      />

      {/* Main Grid Layout */}
      <div className="dashboard-grid">
        
        <div>
          {/* Properties Section with Search */}
          <PropertyList 
            properties={properties}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handlePropertySearchSubmit={handlePropertySearchSubmit}
            handleClearSearch={handleClearSearch}
            handlePropertyClick={handlePropertyClick}
          />

          {/* Furniture Catalog */}
          <FurnitureList 
            furnitures={furnitures}
            currentUser={currentUser}
            handleWishlist={handleWishlist}
            handleSimulateExpiry={handleSimulateExpiry}
          />

          {/* Blogs Section */}
          <BlogSection blogs={blogs} />
        </div>

        {/* Sidebar: Notification Center */}
        <div>
          {/* Notification Center Log */}
          <NotificationLog 
            notifications={notifications}
            markAllRead={markAllRead}
            getNotifIcon={getNotifIcon}
            handleDeleteNotification={handleDeleteNotification}
          />
        </div>

      </div>

    </div>
  );
}

export default App;
