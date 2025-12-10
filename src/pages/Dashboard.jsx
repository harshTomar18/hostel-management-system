import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Total Students', value: '0', subtext: '+12% from last month', icon: '👥', color: '#3b82f6' },
        { label: 'Occupancy Rate', value: '0%', subtext: '0 rooms available', icon: '🛏️', color: '#10b981' },
        { label: 'Total Revenue', value: '$0', subtext: 'Pending: $0', icon: '💰', color: '#8b5cf6' },
        { label: 'Pending Issues', value: '0', subtext: 'Active complaints', icon: '⚠️', color: '#f59e0b' },
    ]);

    const [recentActivity, setRecentActivity] = useState([]);
    const [chartData, setChartData] = useState([65, 40, 75, 50, 85, 60, 90, 70, 80, 55, 45, 95]);
    const [staffOnDuty, setStaffOnDuty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
        // Refresh data every 30 seconds
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            // Fetch all dashboard data
            await Promise.all([
                loadStats(),
                loadActivity(),
                loadChartData(),
                loadStaff()
            ]);
            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats([
                {
                    label: 'Total Students',
                    value: data.totalStudents || '0',
                    subtext: data.revenueChange || '+12% from last month',
                    icon: '👥',
                    color: '#3b82f6'
                },
                {
                    label: 'Occupancy Rate',
                    value: (data.occupancyRate || '0') + '%',
                    subtext: `${data.availableRooms || 0} rooms available`,
                    icon: '🛏️',
                    color: '#10b981'
                },
                {
                    label: 'Total Revenue',
                    value: '$' + (data.totalRevenue || '0').toLocaleString(),
                    subtext: `Pending: $${(data.pendingPayments || 0).toLocaleString()}`,
                    icon: '💰',
                    color: '#8b5cf6'
                },
                {
                    label: 'Pending Issues',
                    value: data.pendingIssues || '0',
                    subtext: 'Active complaints',
                    icon: '⚠️',
                    color: '#f59e0b'
                },
            ]);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadActivity = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/activity`);
            const data = await response.json();

            // Format activity data
            const formattedActivity = data.map((item, index) => ({
                id: item.id || index,
                user: item.user || 'Unknown',
                action: item.action || 'Activity',
                time: item.time || 'Recently',
                type: item.type || 'notice'
            }));

            setRecentActivity(formattedActivity.slice(0, 5)); // Show only 5 recent activities
        } catch (error) {
            console.error('Error loading activity:', error);
            // Keep default activity if fetch fails
        }
    };

    const loadChartData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/chart`);
            const data = await response.json();

            // Normalize data to percentages for display
            const maxValue = Math.max(...data);
            const normalized = data.map(val => Math.round((val / maxValue) * 100));
            setChartData(normalized);
        } catch (error) {
            console.error('Error loading chart data:', error);
            // Keep default chart data if fetch fails
        }
    };

    const loadStaff = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/staff`);
            const data = await response.json();

            // Format staff data
            const formattedStaff = data.map(staff => ({
                id: staff.id,
                name: staff.name,
                role: staff.role || 'Staff',
                shift: 'On Duty', // You can add shift field to database if needed
                status: 'Active' // You can add status field to database if needed
            }));

            setStaffOnDuty(formattedStaff.slice(0, 3)); // Show only 3 staff members
        } catch (error) {
            console.error('Error loading staff:', error);
            // Set default staff if fetch fails
            setStaffOnDuty([
                { id: 1, name: 'Robert Fox', role: 'Warden', shift: 'Morning', status: 'Active' },
                { id: 2, name: 'Cody Fisher', role: 'Security', shift: 'Night', status: 'Off Duty' },
                { id: 3, name: 'Esther Howard', role: 'Cleaning', shift: 'Evening', status: 'Active' },
            ]);
        }
    };

    // Calculate occupancy stats from current data
    const occupancyStats = {
        occupied: stats[0].value !== '0' ? parseInt(stats[0].value) : 150,
        available: stats[1].subtext.match(/\d+/)?.[0] || 12,
        maintenance: 3
    };

    const totalRooms = occupancyStats.occupied + parseInt(occupancyStats.available) + occupancyStats.maintenance;
    const occupancyPercentage = Math.round((occupancyStats.occupied / totalRooms) * 100);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="page-subtitle">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <button className="report-btn">Download Report ⬇️</button>
            </div>

            {loading && <div className="loading-indicator">Loading real-time data...</div>}

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
                            {/* Real-time Bar Chart */}
                            <div className="bar-chart">
                                {chartData.map((height, i) => (
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
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
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
                                ))
                            ) : (
                                <p className="no-data">No recent activity</p>
                            )}
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
                                    <span className="donut-value">{occupancyPercentage}%</span>
                                    <span className="donut-label">Occupied</span>
                                </div>
                            </div>
                            <div className="chart-legend">
                                <div className="legend-item"><span className="dot occupied"></span> Occupied ({occupancyStats.occupied})</div>
                                <div className="legend-item"><span className="dot available"></span> Available ({occupancyStats.available})</div>
                                <div className="legend-item"><span className="dot maintenance"></span> Maintenance ({occupancyStats.maintenance})</div>
                            </div>
                        </div>
                    </div>

                    <div className="section-card">
                        <div className="section-header">
                            <h2>Staff On Duty</h2>
                        </div>
                        <div className="staff-list">
                            {staffOnDuty.length > 0 ? (
                                staffOnDuty.map((staff) => (
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
                                ))
                            ) : (
                                <p className="no-data">No staff data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
