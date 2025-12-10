import React, { useState, useEffect } from 'react';
import { getComplaints, createComplaint, updateComplaintStatus, getRooms } from '../services/api';
import Modal from '../components/Modal';
import './Complaints.css';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingComplaint, setViewingComplaint] = useState(null);
    const [newComplaint, setNewComplaint] = useState({
        student: '',
        room: '',
        issue: '',
        priority: 'Medium'
    });

    useEffect(() => {
        loadComplaints();
    }, []);

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        loadComplaints();
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (error) {
            console.error('Error loading rooms:', error);
        }
    };

    const loadComplaints = async () => {
        try {
            const data = await getComplaints();
            setComplaints(data);
        } catch (error) {
            console.error('Error loading complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComplaint(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddClick = () => {
        setViewingComplaint(null);
        setNewComplaint({
            student: '',
            room: '',
            issue: '',
            priority: 'Medium'
        });
        setIsModalOpen(true);
    };

    const handleViewDetails = (complaint) => {
        setViewingComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateComplaintStatus(id, status);
            loadComplaints();
        } catch (error) {
            console.error('Error updating complaint status:', error);
            alert('Failed to update status');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createComplaint(newComplaint);
            setIsModalOpen(false);
            setNewComplaint({
                student: '',
                room: '',
                issue: '',
                priority: 'Medium'
            });
            loadComplaints();
        } catch (error) {
            console.error('Error creating complaint:', error);
            alert('Failed to create complaint');
        }
    };

    const filteredComplaints = activeTab === 'all'
        ? complaints
        : complaints.filter(c => c.status.toLowerCase().replace(' ', '') === activeTab.replace(' ', ''));

    if (loading) return <div className="loading">Loading complaints...</div>;

    return (
        <div className="complaints-container">
            <div className="page-header">
                <h1>Complaints & Requests</h1>
                <button className="add-btn" onClick={handleAddClick}>+ New Complaint</button>
            </div>

            <div className="status-tabs">
                <button
                    className={`status-tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending
                </button>
                <button
                    className={`status-tab ${activeTab === 'inprogress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inprogress')}
                >
                    In Progress
                </button>
                <button
                    className={`status-tab ${activeTab === 'resolved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resolved')}
                >
                    Resolved
                </button>
                <button
                    className={`status-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All History
                </button>
            </div>

            <div className="complaints-list">
                {filteredComplaints.map((complaint) => (
                    <div key={complaint.id} className="complaint-card">
                        <div className="complaint-header">
                            <div className="complaint-info">
                                <h3>{complaint.issue}</h3>
                                <span className="complaint-meta">
                                    Room {complaint.room} • {complaint.student} • {complaint.date}
                                </span>
                            </div>
                            <div className={`priority-badge ${complaint.priority.toLowerCase()}`}>
                                {complaint.priority} Priority
                            </div>
                        </div>
                        <div className="complaint-footer">
                            <span className={`status-badge ${complaint.status.toLowerCase().replace(' ', '')}`}>
                                {complaint.status}
                            </span>
                            <div className="action-buttons">
                                {complaint.status === 'Pending' && (
                                    <button
                                        className="action-link"
                                        onClick={() => handleUpdateStatus(complaint.id, 'In Progress')}
                                        style={{ color: '#f59e0b' }}
                                    >
                                        Mark In Progress
                                    </button>
                                )}
                                {complaint.status !== 'Resolved' && (
                                    <button
                                        className="action-link"
                                        onClick={() => handleUpdateStatus(complaint.id, 'Resolved')}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                                <button
                                    className="action-link"
                                    onClick={() => handleViewDetails(complaint)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={viewingComplaint ? "Complaint Details" : "New Complaint"}
            >
                {viewingComplaint ? (
                    <div className="complaint-view-details">
                        <p><strong>Issue:</strong> {viewingComplaint.issue}</p>
                        <p><strong>Student:</strong> {viewingComplaint.student}</p>
                        <p><strong>Room:</strong> {viewingComplaint.room}</p>
                        <p><strong>Date:</strong> {viewingComplaint.date}</p>
                        <p><strong>Priority:</strong> {viewingComplaint.priority}</p>
                        <p><strong>Status:</strong> {viewingComplaint.status}</p>
                        <div className="form-actions">
                            <button className="submit-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Student Name</label>
                            <input
                                type="text"
                                name="student"
                                value={newComplaint.student}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Room Number</label>
                            <select
                                name="room"
                                value={newComplaint.room}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Room</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.id} ({room.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Issue Description</label>
                            <textarea
                                name="issue"
                                value={newComplaint.issue}
                                onChange={handleInputChange}
                                required
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select name="priority" value={newComplaint.priority} onChange={handleInputChange} required>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="submit-btn">Submit Complaint</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Complaints;
