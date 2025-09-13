import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Sidebar from './Sidebar';
import './hemantpage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const HemantPage = ({ onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState({
    home: false,
    conferences: false,
    journals: true,
    profile: true,
    department: false,
    year: false,
    work: false,
    publications: false,
    access: false
  });

  const [currentPage, setCurrentPage] = useState('journals');
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAppClick = () => {
    alert('App functionality - Navigate to applications');
  };

  const handleMessagesClick = () => {
    alert('Messages functionality - Open messaging system');
  };

  const handleSettingsClick = () => {
    alert('Settings functionality - Open settings panel');
  };

  const journalsData = [
    { author: 'SHRUTI JALAPUR', title: 'An integrated', department: 'CSE', publisher: 'Springer Nature', contact: '', email: '', country: 'India', status: 'Active' },
    { author: 'Floyd Miles', title: 'Yahoo', department: '—', publisher: '—', contact: '(205) 555-0100', email: 'floyd@yahoo.com', country: 'India', status: 'Inactive' },
    { author: 'Ronald Richards', title: 'Adobe', department: '—', publisher: '—', contact: '(202) 555-0107', email: 'ronald@adobe.com', country: 'India', status: 'Inactive' },
    { author: 'Marvin McKinney', title: 'Tesla', department: '—', publisher: '—', contact: '(252) 555-0126', email: 'marvin@tesla.com', country: 'India', status: 'Active' },
    { author: 'Jerome Bell', title: 'Google', department: '—', publisher: '—', contact: '(262) 555-0199', email: 'jerome@google.com', country: 'India', status: 'Active' },
    { author: 'Kathryn Murphy', title: 'Microsoft', department: '—', publisher: '—', contact: '(406) 555-0120', email: 'kathryn@microsoft.com', country: 'India', status: 'Active' },
    { author: 'Jacob Jones', title: 'Yahoo', department: '—', publisher: '—', contact: '(208) 555-0112', email: 'jacob@yahoo.com', country: 'India', status: 'Inactive' },
    { author: 'Kristin Watson', title: 'Facebook', department: '—', publisher: '—', contact: '(704) 555-0127', email: 'kristin@facebook.com', country: 'India', status: 'Inactive' }
  ];

  // Chart data - static to prevent infinite re-rendering
  const barChartData = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [{
      data: [30, 60, 50, 40],
      backgroundColor: 'rgba(61,110,247,0.9)',
      borderRadius: 6,
      barThickness: 22
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true },
      x: { grid: { display: false } }
    }
  };

  const doughnutChartData = {
    labels: ['Nature', 'The Lancet', 'Science', 'Cell', 'PLOS ONE', 'IEEE'],
    datasets: [{
      data: [12, 22, 12, 9, 7, 7],
      backgroundColor: ['#35c1a9', '#ff8a65', '#8e67ff', '#ffcf4d', '#7ad0ff', '#ffd1e8']
    }]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };

  const filteredJournals = journalsData.filter(journal =>
    journal.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    journal.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="main-title">Research Journals & Publications</h1>
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search journals..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="content-container">
          <div className="content-header">
            <div className="user-section">
              <div className="user-pic">
                <img src="dr-deepak.jpg" alt="Dr. Deepak" />
              </div>
              <div className="user-details">
                <h3>Dr. John Doe</h3>
                <p>(Mathematics)</p>
              </div>
            </div>
            <div className="action-buttons">
              <button className="header-btn primary" onClick={handleAppClick}>App</button>
              <button className="header-btn secondary" onClick={handleMessagesClick}>Messages</button>
              <button className="header-btn secondary" onClick={handleSettingsClick}>Settings</button>
            </div>
          </div>

          <div className="events-container">
            <div className="section-header">
              <h2 className="section-title">Journals Dashboard</h2>
            </div>

            {/* Stats Cards */}
            <section className="stats-cards">
              <div className="stat-card">
                <div className="stat-number">95</div>
                <div className="stat-label">Total Authors</div>
                <small className="stat-positive">↑ 19% this month</small>
              </div>
              <div className="stat-card">
                <div className="stat-number">39</div>
                <div className="stat-label">Publishers</div>
                <small className="stat-negative">↓ 11% this month</small>
              </div>
              <div className="stat-card">
                <div className="stat-number">49</div>
                <div className="stat-label">Active Now</div>
              </div>
            </section>

            {/* Charts Section */}
            <section className="charts-section">
              <div className="chart-card">
                <h4>Journals Each Year</h4>
                <div className="chart-wrapper">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>
              <div className="chart-card">
                <h4>Journal Impact Factor</h4>
                <div className="chart-wrapper">
                  <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                </div>
              </div>
            </section>

            {/* Table Section */}
            <section className="table-section">
              <div className="table-header">
                <h4>Journals List</h4>
                <div className="table-subtitle">Active Members</div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Author</th>
                      <th>Title</th>
                      <th>Department</th>
                      <th>Publisher</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Country</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJournals.map((journal, index) => (
                      <tr key={index}>
                        <td>{journal.author}</td>
                        <td>{journal.title}</td>
                        <td>{journal.department}</td>
                        <td>{journal.publisher}</td>
                        <td>{journal.contact}</td>
                        <td>{journal.email}</td>
                        <td>{journal.country}</td>
                        <td>
                          <span className={`status-badge ${journal.status.toLowerCase()}`}>
                            {journal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <span>Prev</span>
                <span className="current">1</span>
                <span>2</span>
                <span>Next</span>
              </div>
            </section>

            {filteredJournals.length === 0 && searchQuery && (
              <div className="no-results">
                <p>No journals found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HemantPage;