import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [studentData, setStudentData] = useState(null);
    const [roomData, setRoomData] = useState(null);
    const [myComplaints, setMyComplaints] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [newComplaint, setNewComplaint] = useState({
        issue: '',
        priority: 'Medium'
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        loadStudentData();
        // Refresh data every 30 seconds
        const interval = setInterval(loadStudentData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadStudentData = async () => {
        try {
            await Promise.all([
                fetchStudentInfo(),
                fetchMyComplaints(),
                fetchNotices()
            ]);
            setLoading(false);
        } catch (error) {
            console.error('Error loading student data:', error);
            setLoading(false);
        }
    };

    const fetchStudentInfo = async () => {
        try {
            // Get student ID from localStorage (set during login)
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const studentId = user.studentId || 1; // Default to 1 for demo

            // Fetch student details
            const studentsRes = await fetch(`${API_URL}/api/students`);
            const students = await studentsRes.json();
            const student = students.find(s => s.id === studentId) || students[0];

            setStudentData(student);

            // Fetch room details if student has a room
            if (student && student.room) {
                const roomsRes = await fetch(`${API_URL}/api/rooms`);
                const rooms = await roomsRes.json();
                const room = rooms.find(r => r.id === student.room);
                setRoomData(room);
            }
        } catch (error) {
            console.error('Error fetching student info:', error);
        }
    };

    const fetchMyComplaints = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const studentName = user.name || 'Student';

            const res = await fetch(`${API_URL}/api/complaints`);
            const allComplaints = await res.json();

            // Filter complaints for this student
            const myComplaints = allComplaints.filter(c =>
                c.student === studentName || c.student.includes(studentName)
            );

            setMyComplaints(myComplaints.slice(0, 5)); // Show latest 5
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const fetchNotices = async () => {
        try {
            const res = await fetch(`${API_URL}/api/notices`);
            const allNotices = await res.json();
            setNotices(allNotices.slice(0, 4)); // Show latest 4 notices
        } catch (error) {
            console.error('Error fetching notices:', error);
        }
    };

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const complaintData = {
                student: user.name || 'Student',
                room: studentData?.room || 'N/A',
                issue: newComplaint.issue,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                priority: newComplaint.priority
            };

            const res = await fetch(`${API_URL}/api/complaints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complaintData)
            });

            if (res.ok) {
                setNewComplaint({ issue: '', priority: 'Medium' });
                setShowComplaintForm(false);
                fetchMyComplaints(); // Refresh complaints
                alert('Complaint submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return '#10b981';
            case 'In Progress': return '#f59e0b';
            case 'Pending': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#ef4444';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return (
            <div className="student-dashboard">
                <div className="loading-spinner">Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div className="student-dashboard">
            {/* Header */}
            <div className="student-header">
                <div>
                    <h1 className="welcome-title">Welcome back, {studentData?.name || 'Student'}! 👋</h1>
                    <p className="welcome-subtitle">Here's your hostel information and updates</p>
                </div>
                <button className="profile-btn">
                    <span className="profile-avatar">{studentData?.name?.charAt(0) || 'S'}</span>
                    Profile
                </button>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-box">
                    <div className="stat-icon" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>🏠</div>
                    <div className="stat-content">
                        <h3>Room {studentData?.room || 'N/A'}</h3>
                        <p>{roomData?.type || 'Not Assigned'}</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>📚</div>
                    <div className="stat-content">
                        <h3>{studentData?.course || 'N/A'}</h3>
                        <p>Year {studentData?.year || 'N/A'}</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>⚠️</div>
                    <div className="stat-content">
                        <h3>{myComplaints.filter(c => c.status === 'Pending').length}</h3>
                        <p>Pending Complaints</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon" style={{ backgroundColor: '#8b5cf620', color: '#8b5cf6' }}>📢</div>
                    <div className="stat-content">
                        <h3>{notices.length}</h3>
                        <p>New Notices</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="left-column">
                    {/* Personal Info Card */}
                    <div className="info-card">
                        <div className="card-header">
                            <h2>📋 Personal Information</h2>
                            <button className="edit-btn">Edit</button>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{studentData?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{studentData?.email || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Contact</span>
                                <span className="info-value">{studentData?.contact || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className="status-badge active">{studentData?.status || 'Active'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Room Details Card */}
                    <div className="info-card">
                        <div className="card-header">
                            <h2>🏠 Room Details</h2>
                        </div>
                        {roomData ? (
                            <div className="room-details">
                                <div className="room-info-grid">
                                    <div className="room-info-item">
                                        <span className="room-label">Room Number</span>
                                        <span className="room-value">{studentData?.room}</span>
                                    </div>
                                    <div className="room-info-item">
                                        <span className="room-label">Type</span>
                                        <span className="room-value">{roomData.type}</span>
                                    </div>
                                    <div className="room-info-item">
                                        <span className="room-label">Floor</span>
                                        <span className="room-value">{roomData.floor}</span>
                                    </div>
                                    <div className="room-info-item">
                                        <span className="room-label">Occupancy</span>
                                        <span className="room-value">{roomData.occupied}/{roomData.capacity}</span>
                                    </div>
                                </div>
                                <div className="room-status">
                                    <span className={`status-indicator ${roomData.status.toLowerCase()}`}>
                                        {roomData.status}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="no-data">No room assigned yet</p>
                        )}
                    </div>

                    {/* My Complaints */}
                    <div className="info-card">
                        <div className="card-header">
                            <h2>🔧 My Complaints</h2>
                            <button
                                className="add-btn"
                                onClick={() => setShowComplaintForm(!showComplaintForm)}
                            >
                                + New
                            </button>
                        </div>

                        {showComplaintForm && (
                            <form className="complaint-form" onSubmit={handleSubmitComplaint}>
                                <textarea
                                    placeholder="Describe your issue..."
                                    value={newComplaint.issue}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                                    required
                                />
                                <div className="form-actions">
                                    <select
                                        value={newComplaint.priority}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                                    >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                    <div className="button-group">
                                        <button type="button" onClick={() => setShowComplaintForm(false)}>Cancel</button>
                                        <button type="submit" className="submit-btn">Submit</button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="complaints-list">
                            {myComplaints.length > 0 ? (
                                myComplaints.map((complaint) => (
                                    <div key={complaint.id} className="complaint-item">
                                        <div className="complaint-header">
                                            <span
                                                className="priority-badge"
                                                style={{ backgroundColor: getPriorityColor(complaint.priority) }}
                                            >
                                                {complaint.priority}
                                            </span>
                                            <span
                                                className="status-tag"
                                                style={{ color: getStatusColor(complaint.status) }}
                                            >
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <p className="complaint-text">{complaint.issue}</p>
                                        <span className="complaint-date">{complaint.date}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">No complaints submitted</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    {/* Notices Board */}
                    <div className="info-card notices-card">
                        <div className="card-header">
                            <h2>📢 Notice Board</h2>
                            <button className="view-all-btn">View All</button>
                        </div>
                        <div className="notices-list">
                            {notices.length > 0 ? (
                                notices.map((notice) => (
                                    <div key={notice.id} className="notice-item">
                                        <div className="notice-icon">📌</div>
                                        <div className="notice-content">
                                            <h4>{notice.title}</h4>
                                            <p>{notice.content}</p>
                                            <div className="notice-footer">
                                                <span className="notice-author">By {notice.author || 'Admin'}</span>
                                                <span className="notice-date">{notice.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">No notices available</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="info-card">
                        <div className="card-header">
                            <h2>⚡ Quick Actions</h2>
                        </div>
                        <div className="quick-actions">
                            <button className="action-btn">
                                <span className="action-icon">💳</span>
                                <span>Pay Fees</span>
                            </button>
                            <button className="action-btn">
                                <span className="action-icon">📅</span>
                                <span>Book Facility</span>
                            </button>
                            <button className="action-btn">
                                <span className="action-icon">🍽️</span>
                                <span>Mess Menu</span>
                            </button>
                            <button className="action-btn">
                                <span className="action-icon">📞</span>
                                <span>Contact Warden</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
