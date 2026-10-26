import React, { useState, useEffect } from 'react';

// Subcomponents
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import PropertyConsole from './components/PropertyConsole';
import FurnitureConsole from './components/FurnitureConsole';
import Broadcasters from './components/Broadcasters';
import BlogPublisher from './components/BlogPublisher';
import AccountTerminator from './components/AccountTerminator';
import EmailLogger from './components/EmailLogger';

function App() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [furnitures, setFurnitures] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [emails, setEmails] = useState([]);
  
  // Property Form states
  const [propTitle, setPropTitle] = useState('');
  const [propCity, setPropCity] = useState('Delhi');
  const [propPrice, setPropPrice] = useState(30000);
  const [propType, setPropType] = useState('2BHK');
  const [propImage, setPropImage] = useState('');

  // Furniture Form states (Add New)
  const [furnName, setFurnName] = useState('');
  const [furnCategory, setFurnCategory] = useState('Living Room');
  const [furnPrice, setFurnPrice] = useState(1000);
  const [furnInStock, setFurnInStock] = useState(true);
  const [furnImage, setFurnImage] = useState('');

  // Furniture Edit states
  const [editingFurnId, setEditingFurnId] = useState('');
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editInStock, setEditInStock] = useState(true);
  const [editImage, setEditImage] = useState('');

  // Blog states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  
  // Custom Notification states
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customRecipient, setCustomRecipient] = useState('');

  // Marketing Notification states
  const [mktTitle, setMktTitle] = useState('');
  const [mktMessage, setMktMessage] = useState('');

  // Termination states
  const [termRecipient, setTermRecipient] = useState('');
  const [termReason, setTermReason] = useState('Violation of platform guidelines regarding payment dues.');

  const [selectedEmailBody, setSelectedEmailBody] = useState(null);

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

      fetchEmails();
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const fetchEmails = async () => {
    try {
      const emailsRes = await fetch('/api/emails');
      const emailsData = await emailsRes.json();
      setEmails(emailsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: propTitle,
          city: propCity,
          price: Number(propPrice),
          type: propType,
          image: propImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'
        })
      });
      if (res.ok) {
        setPropTitle('');
        setPropImage('');
        console.log('New Property Created! Automated search matching alerts triggered for interested clients.');
        fetchData();
      } else {
        const errData = await res.json();
        console.error(errData.error || 'Failed to list property');
      }
    } catch (err) {
      console.error('Error creating property:', err);
    }
  };

  const handleCreateFurniture = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/furnitures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: furnName,
          category: furnCategory,
          priceMonthly: Number(furnPrice),
          inStock: furnInStock,
          image: furnImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'
        })
      });
      if (res.ok) {
        setFurnName('');
        setFurnImage('');
        console.log('New Furniture Product Listed successfully!');
        fetchData();
      } else {
        const errData = await res.json();
        console.error(errData.error || 'Failed to list furniture');
      }
    } catch (err) {
      console.error('Error creating furniture:', err);
    }
  };

  const handleSelectEditFurniture = (item) => {
    setEditingFurnId(item._id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditPrice(item.priceMonthly);
    setEditInStock(item.inStock);
    setEditImage(item.image);
  };

  const handleUpdateFurnitureInventory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/furnitures/${editingFurnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          category: editCategory,
          priceMonthly: Number(editPrice),
          inStock: editInStock,
          image: editImage
        })
      });
      if (res.ok) {
        setEditingFurnId('');
        console.log('Furniture Inventory & Stock updated successfully! Restock alerts sent if stock status changed.');
        fetchData();
      } else {
        const errData = await res.json();
        console.error(errData.error || 'Failed to update inventory details');
      }
    } catch (err) {
      console.error('Error updating furniture:', err);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogTitle,
          content: blogContent,
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80'
        })
      });
      setBlogTitle('');
      setBlogContent('');
      console.log('Blog Published! standard clients notified.');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendCustomNotification = async (e) => {
    e.preventDefault();
    if (!customRecipient) {
      console.warn('Select a recipient');
      return;
    }
    try {
      await fetch('/api/admin/custom-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customRecipient,
          title: customTitle,
          message: customMessage
        })
      });
      setCustomTitle('');
      setCustomMessage('');
      console.log('Custom Notification sent in-app!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMarketingNotification = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/marketing-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mktTitle,
          message: mktMessage
        })
      });
      const result = await res.json();
      setMktTitle('');
      setMktMessage('');
      console.log(`Marketing alert broadcasted! standard users notified in-app & via Email: ${result.notifiedCount}`);
      fetchEmails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTerminateAccount = async (e) => {
    e.preventDefault();
    if (!termRecipient) {
      console.warn('Select a user account');
      return;
    }
    try {
      await fetch('/api/admin/terminate-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: termRecipient,
          reason: termReason
        })
      });
      console.log(`Account termination email dispatched to user's registered inbox!`);
      fetchEmails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestockFurniture = async (id) => {
    try {
      const res = await fetch(`/api/furnitures/restock/${id}`, { method: 'POST' });
      const result = await res.json();
      
      setFurnitures(furnitures.map(f => f._id === id ? { ...f, inStock: true } : f));
      console.log(`Furniture restocked! Wishlisted users notified: ${result.notifiedUsers.join(', ') || 'None'}`);
      fetchEmails();
    } catch (err) {
      console.error(err);
    }
  };



  const handleClearEmails = async () => {
    try {
      await fetch('/api/emails/clear', { method: 'POST' });
      setEmails([]);
      setSelectedEmailBody(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      {/* Navbar Header */}
      <Navbar fetchData={fetchData} />

      <div className="grid-cols-3">
        <div>
          {/* User List Console */}
          <UserList users={users} />

          {/* Properties Console */}
          <PropertyConsole 
            properties={properties}
            propTitle={propTitle}
            setPropTitle={setPropTitle}
            propCity={propCity}
            setPropCity={setPropCity}
            propPrice={propPrice}
            setPropPrice={setPropPrice}
            propType={propType}
            setPropType={setPropType}
            propImage={propImage}
            setPropImage={setPropImage}
            handleCreateProperty={handleCreateProperty}
          />

          {/* Furniture Console */}
          <FurnitureConsole 
            furnitures={furnitures}
            furnName={furnName}
            setFurnName={setFurnName}
            furnCategory={furnCategory}
            setFurnCategory={setFurnCategory}
            furnPrice={furnPrice}
            setFurnPrice={setFurnPrice}
            furnInStock={furnInStock}
            setFurnInStock={setFurnInStock}
            furnImage={furnImage}
            setFurnImage={setFurnImage}
            editingFurnId={editingFurnId}
            setEditingFurnId={setEditingFurnId}
            editName={editName}
            setEditName={setEditName}
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            editPrice={editPrice}
            setEditPrice={setEditPrice}
            editInStock={editInStock}
            setEditInStock={setEditInStock}
            editImage={editImage}
            setEditImage={setEditImage}
            handleCreateFurniture={handleCreateFurniture}
            handleSelectEditFurniture={handleSelectEditFurniture}
            handleUpdateFurnitureInventory={handleUpdateFurnitureInventory}
            handleRestockFurniture={handleRestockFurniture}
          />

          {/* Targeted & Marketing Broadcasters */}
          <Broadcasters 
            users={users}
            customRecipient={customRecipient}
            setCustomRecipient={setCustomRecipient}
            customTitle={customTitle}
            setCustomTitle={setCustomTitle}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
            mktTitle={mktTitle}
            setMktTitle={setMktTitle}
            mktMessage={mktMessage}
            setMktMessage={setMktMessage}
            handleSendCustomNotification={handleSendCustomNotification}
            handleSendMarketingNotification={handleSendMarketingNotification}
          />

          {/* Blog Publishing */}
          <BlogPublisher 
            blogs={blogs}
            blogTitle={blogTitle}
            setBlogTitle={setBlogTitle}
            blogContent={blogContent}
            setBlogContent={setBlogContent}
            handleCreateBlog={handleCreateBlog}
          />

          {/* Account Termination */}
          <AccountTerminator 
            users={users}
            termRecipient={termRecipient}
            setTermRecipient={setTermRecipient}
            termReason={termReason}
            setTermReason={setTermReason}
            handleTerminateAccount={handleTerminateAccount}
          />
        </div>

        {/* Email Logs Inspector */}
        <div>
          <EmailLogger 
            emails={emails}
            selectedEmailBody={selectedEmailBody}
            setSelectedEmailBody={setSelectedEmailBody}
            handleClearEmails={handleClearEmails}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
