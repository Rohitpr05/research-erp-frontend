import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import FormsFormat from '../forms/formformat';
import authService from '../login/authService'; // Import your auth service
import './rohitpage.css';

const RohitPage = ({ onNavigate, onLogout }) => {
  const [expandedItems, setExpandedItems] = useState({
    home: false,
    conferences: true,
    profile: true,
    department: false,
    year: false,
    work: false,
    publications: false,
    access: false
  });

  const [currentPage, setCurrentPage] = useState('conferences');
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    participants: '',
    date: '',
    icon: '💻'
  });
  const [conferences, setConferences] = useState([
    {
      id: 1,
      icon: "💻",
      name: "ResNet for X-ray Detection",
      description: "A deep learning model applied to X-ray classification for disease detection.",
      people: 40,
      date: "01.03.23",
      participants: "Participants",
      dueDate: "Event date",
      tags: ["🔴", "🟡", "🔵", "🟢"]
    },
    {
      id: 2,
      icon: "🧠",
      name: "AI in Medical Imaging",
      description: "Symposium on AI-based image recognition at international level.",
      people: 60,
      date: "05.05.23",
      participants: "Participants",
      dueDate: "Event date",
      tags: ["🟢", "🔵", "🟡", "🔴"]
    },
    {
      id: 3,
      icon: "📡",
      name: "IoT-Based Smart Irrigation",
      description: "Presented a smart agricultural monitoring system using IoT sensors.",
      people: 30,
      date: "08.02.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🔴", "🟡", "🔵"]
    },
    {
      id: 4,
      icon: "⚡",
      name: "Deep Learning for Text Mining",
      description: "Discussed predictive analytics in text mining using CNN and RNN.",
      people: 35,
      date: "22.02.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🟢", "🔴", "🟡", "🔵"]
    },
    {
      id: 5,
      icon: "🌾",
      name: "AI in Crop Prediction",
      description: "Machine learning techniques for improving agricultural planning accuracy.",
      people: 25,
      date: "10.01.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🟢", "🔵", "🟡", "🔴"]
    },
    {
      id: 6,
      icon: "⚙️",
      name: "Edge AI for Maintenance",
      description: "Leveraging Edge AI for machinery failure prediction in industry.",
      people: 55,
      date: "18.03.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🟢", "🔴", "🔵", "🟡"]
    }
  ]);

  // Team members data
  const teamMembers = [
    { name: "Rohit pr", regNo: "2360450" },
    { name: "Elna Benny", regNo: "2360366" },
    { name: "Jefferson N", regNo: "2360383" },
    { name: "Hemanth Reddy", regNo: "2360373" }
  ];

  // Load current user on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const toggleExpanded = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleSubItemClick = (subItemLabel) => {
    setActiveSubItem(subItemLabel);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNewEventClick = () => {
    setShowNewEventModal(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (newEvent.name && newEvent.description && newEvent.participants && newEvent.date) {
      const newEventData = {
        id: conferences.length + 1,
        icon: newEvent.icon,
        name: newEvent.name,
        description: newEvent.description,
        people: parseInt(newEvent.participants),
        date: new Date(newEvent.date).toLocaleDateString('en-GB').replace(/\//g, '.'),
        participants: "Participants",
        dueDate: "Event date",
        tags: ["🟢", "🔵", "🟡", "🔴"]
      };
      
      setConferences([...conferences, newEventData]);
      setShowNewEventModal(false);
      setNewEvent({ name: '', description: '', participants: '', date: '', icon: '💻' });
    }
  };

  const handleFormsClick = () => {
    setShowForms(true);
  };

  const handleBackFromForms = () => {
    setShowForms(false);
  };

  const handleAppClick = () => {
    alert('App functionality - Navigate to applications');
  };

  const handleMessagesClick = () => {
    alert('Messages functionality - Open messaging system');
  };

  const handleSettingsClick = () => {
    alert('Settings functionality - Open settings panel');
  };

  const handleTeamClick = () => {
    setShowTeamModal(true);
  };

  // Logout functionality
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    authService.logout();
    setShowLogoutConfirm(false);
    // Call the parent component's logout handler
    if (onLogout) {
      onLogout();
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const filteredConferences = conferences.filter(conference =>
    conference.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conference.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If Forms is active, render FormsFormat component
  if (showForms) {
    return (
      <div className="forms-container">
        <div className="forms-header">
          <button className="back-btn" onClick={handleBackFromForms}>
            ← Back to Dashboard
          </button>
        </div>
        <FormsFormat />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
        currentPage={currentPage}
        handleNavigation={handleNavigation}
        activeSubItem={activeSubItem}
        setActiveSubItem={handleSubItemClick}
        onNavigate={onNavigate}
      />

      <div className="main-content">
        <div className="blue-header">
          <h1 className="main-title">Research Conferences & Publications</h1>
          <div className="header-right">
            <div className="search-container">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search anything here..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="logout-btn" onClick={handleLogoutClick} title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="content-container">
          <div className="content-header">
            <div className="user-section">
              <div className="user-pic">
                <img src="dr-deepak.jpg" alt="Dr. Deepak" />
              </div>
              <div className="user-details">
                <h3>{currentUser?.fullName || 'Dr. Deepak'}</h3>
                <p>({currentUser?.department || 'Doctor of Research'})</p>
              </div>
            </div>
            <div className="action-buttons">
              <button className="header-btn secondary" onClick={handleFormsClick}>Forms</button>
              <button className="header-btn primary" onClick={handleAppClick}>App</button>
              <button className="header-btn secondary" onClick={handleMessagesClick}>Messages</button>
              <button className="header-btn secondary" onClick={handleSettingsClick}>Settings</button>
            </div>
          </div>

          <div className="events-container">
            <div className="section-header">
              <h2 className="section-title">Upcoming Academic Events</h2>
            </div>

            <div className="cards-grid">
              {filteredConferences.map((conference) => (
                <div key={conference.id} className="event-card">
                  <button className="card-menu" onClick={() => alert(`Options for ${conference.name}`)}>⋮</button>
                  <div className="card-top">
                    <div className="card-icon">{conference.icon}</div>
                    <div className="card-info">
                      <div className="card-title">{conference.name}</div>
                      <div className="card-tags">
                        {conference.tags.map((tag, index) => (
                          <span key={index} className="status-dot">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="card-description">{conference.description}</div>
                  <div className="card-footer">
                    <div className="card-stat">
                      <strong>{conference.people}</strong>
                      <span>{conference.participants}</span>
                    </div>
                    <div className="card-stat">
                      <strong>{conference.date}</strong>
                      <span>{conference.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredConferences.length === 0 && searchQuery && (
              <div className="no-results">
                <p>No events found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="floating-btn" onClick={handleNewEventClick}>
        New Event
      </button>

      {/* Animated Team Button */}
      <button className="team-btn" onClick={handleTeamClick} title="View Team">
        <div className="team-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <span className="team-text">Team</span>
      </button>

      {/* Team Modal */}
      {showTeamModal && (
        <div className="modal-overlay" onClick={() => setShowTeamModal(false)}>
          <div className="modal-content team-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project Team</h2>
              <button className="close-btn" onClick={() => setShowTeamModal(false)}>✕</button>
            </div>
            <div className="team-modal-body">
              <div className="team-grid">
                {teamMembers.map((member, index) => (
                  <div key={index} className="team-member-card">
                    <div className="member-avatar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>Reg: {member.regNo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="modal-overlay" onClick={() => setShowNewEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Academic Event</h2>
              <button className="close-btn" onClick={() => setShowNewEventModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateEvent} className="event-form">
              <div className="form-group">
                <label>Event Icon</label>
                <select 
                  value={newEvent.icon} 
                  onChange={(e) => setNewEvent({...newEvent, icon: e.target.value})}
                >
                  <option value="💻">💻 Computer</option>
                  <option value="🧠">🧠 AI/Brain</option>
                  <option value="📡">📡 IoT</option>
                  <option value="⚡">⚡ Energy</option>
                  <option value="🌾">🌾 Agriculture</option>
                  <option value="⚙️">⚙️ Engineering</option>
                  <option value="🔬">🔬 Research</option>
                  <option value="📊">📊 Data</option>
                </select>
              </div>
              <div className="form-group">
                <label>Event Name *</label>
                <input 
                  type="text" 
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                  required
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expected Participants *</label>
                  <input 
                    type="number" 
                    value={newEvent.participants}
                    onChange={(e) => setNewEvent({...newEvent, participants: e.target.value})}
                    placeholder="0"
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Event Date *</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowNewEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal-content logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Logout</h2>
              <button className="close-btn" onClick={cancelLogout}>✕</button>
            </div>
            <div className="logout-modal-body">
              <div className="logout-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <p>Are you sure you want to logout?</p>
              <p className="logout-subtitle">You will be redirected to the login page.</p>
              <div className="logout-actions">
                <button type="button" className="cancel-btn" onClick={cancelLogout}>
                  Cancel
                </button>
                <button type="button" className="logout-confirm-btn" onClick={confirmLogout}>
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RohitPage;