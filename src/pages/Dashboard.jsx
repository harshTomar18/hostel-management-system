import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Total Students', value: '0', subtext: '+12% from last month', icon: '👥', color: '#3b82f6' },
        { label: 'Occupancy Rate', value: '0%', subtext: '12 rooms available', icon: '🛏️', color: '#10b981' },
        { label: 'Total Revenue', value: '$0', subtext: 'Pending: $2,400', icon: '💰', color: '#8b5cf6' },
        { label: 'Pending Issues', value: '0', subtext: '2 High Priority', icon: '⚠️', color: '#f59e0b' },
    ]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats([
                { label: 'Total Students', value: data.totalStudents || '0', subtext: '+12% from last month', icon: '👥', color: '#3b82f6' },
                { label: 'Occupancy Rate', value: (data.occupancyRate || '0') + '%', subtext: '12 rooms available', icon: '🛏️', color: '#10b981' },
                { label: 'Total Revenue', value: '$' + (data.totalRevenue || '0'), subtext: 'Pending: $2,400', icon: '💰', color: '#8b5cf6' },
                { label: 'Pending Issues', value: data.pendingIssues || '0', subtext: '2 High Priority', icon: '⚠️', color: '#f59e0b' },
            ]);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    };

    const recentActivity = [
        { id: 1, user: 'John Doe', action: 'Checked in', time: '2 hours ago', type: 'checkin' },
        { id: 2, user: 'Room 101', action: 'Maintenance request: Leaking tap', time: '4 hours ago', type: 'issue' },
        { id: 3, user: 'Jane Smith', action: 'Paid hostel fee', time: '1 day ago', type: 'payment' },
        { id: 4, user: 'Admin', action: 'Posted a notice: Holiday Schedule', time: '1 day ago', type: 'notice' },
    ];

    const staffOnDuty = [
        { id: 1, name: 'Robert Fox', role: 'Warden', shift: 'Morning', status: 'Active' },
        { id: 2, name: 'Cody Fisher', role: 'Security', shift: 'Night', status: 'Off Duty' },
        { id: 3, name: 'Esther Howard', role: 'Cleaning', shift: 'Evening', status: 'Active' },
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="page-subtitle">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <button className="report-btn">Download Report ⬇️</button>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p className="stat-label">{stat.label}</p>
                            <p className="stat-subtext">{stat.subtext}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid-layout">
                <div className="main-chart-section">
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Revenue Analytics</h2>
                            <select className="chart-filter">
                                <option>This Year</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="chart-container">
                            {/* Simulated Bar Chart */}
                            <div className="bar-chart">
                                {[65, 40, 75, 50, 85, 60, 90, 70, 80, 55, 45, 95].map((height, i) => (
                                    <div key={i} className="bar-group">
                                        <div className="bar" style={{ height: `${height}%` }}></div>
                                        <span className="bar-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="section-card">
                        <div className="section-header">
                            <h2>Recent Activity</h2>
                            <button className="view-all-btn">View All</button>
                        </div>
                        <div className="activity-list">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`activity-icon ${activity.type}`}>
                                        {activity.type === 'checkin' && '📍'}
                                        {activity.type === 'issue' && '🔧'}
                                        {activity.type === 'payment' && '💲'}
                                        {activity.type === 'notice' && '📢'}
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-text">
                                            <strong>{activity.user}</strong> {activity.action}
                                        </p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="side-panel-section">
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Occupancy</h2>
                        </div>
                        <div className="occupancy-chart-wrapper">
                            <div className="donut-chart">
                                <div className="donut-hole">
                                    <span className="donut-value">85%</span>
                                    <span className="donut-label">Occupied</span>
                                </div>
                            </div>
                            <div className="chart-legend">
                                <div className="legend-item"><span className="dot occupied"></span> Occupied (150)</div>
                                <div className="legend-item"><span className="dot available"></span> Available (12)</div>
                                <div className="legend-item"><span className="dot maintenance"></span> Maintenance (3)</div>
                            </div>
                        </div>
                    </div>

                    <div className="section-card">
                        <div className="section-header">
                            <h2>Staff On Duty</h2>
                        </div>
                        <div className="staff-list">
                            {staffOnDuty.map((staff) => (
                                <div key={staff.id} className="staff-item">
                                    <div className="staff-avatar">{staff.name.charAt(0)}</div>
                                    <div className="staff-info">
                                        <h4>{staff.name}</h4>
                                        <p>{staff.role} • {staff.shift}</p>
                                    </div>
                                    <span className={`staff-status ${staff.status.toLowerCase().replace(' ', '-')}`}>
                                        {staff.status === 'Active' ? '●' : '○'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
