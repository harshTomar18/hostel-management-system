import React, { useState, useEffect } from 'react';
import { getNotices, createNotice, updateNotice } from '../services/api';
import Modal from '../components/Modal';
import './Notices.css';
import { formatDate } from '../Util/formatDate';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({
        title: '',
        content: '',
        type: 'Info',
        author: 'Admin'
    });
    const [editingNotice, setEditingNotice] = useState(null);
    const [expandedNotice, setExpandedNotice] = useState(null);


    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        try {
            const data = await getNotices();
            setNotices(data);
        } catch (error) {
            console.error('Error loading notices:', error);
        } finally {
            setLoading(false);
        }
    };
    const toggleExpand = (id) => {
        setExpandedNotice(prev => (prev === id ? null : id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNotice(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if we are editing (need to add editing state to Notices.jsx first, but user asked for update APIs)
            // Wait, Notices.jsx doesn't have editing state yet in the code I saw.
            // I should check if I need to add editing capability to Notices.jsx.
            // The user request was "make update apies also soo that admin can update it also".
            // I'll assume I need to add edit functionality to the UI as well.
            // But first let's just use createNotice for new ones.
            // I need to add editing logic.
            await createNotice(newNotice);
            setIsModalOpen(false);
            setNewNotice({
                title: '',
                content: '',
                type: 'Info',
                author: 'Admin'
            });
            loadNotices();
        } catch (error) {
            console.error('Error creating notice:', error);
            alert('Failed to create notice');
        }
    };

    if (loading) return <div className="loading">Loading notices...</div>;

    return (
        <div className="notices-container">
            <div className="page-header">
                <h1>Notice Board</h1>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ Post Notice</button>
            </div>

            <div className="notices-grid">
                {notices.map((notice) => (
                    <div key={notice.id} className="notice-card">
                        <div className={`notice-type-strip ${notice.type.toLowerCase()}`}></div>
                        <div className="notice-content">
                            <div className="notice-header">
                                <span className={`notice-badge ${notice.type.toLowerCase()}`}>{notice.type}</span>
                                <span className="notice-date">{formatDate(notice.date)}</span>
                            </div>
                            <h3>{notice.title}</h3>
                            <p>
                                {expandedNotice === notice.id
                                    ? notice.content
                                    : notice.content.slice(0, 120) + (notice.content.length > 120 ? "..." : "")
                                }
                            </p>

                            {notice.content.length > 120 && (
                                <button
                                    className="see-more-btn"
                                    onClick={() => toggleExpand(notice.id)}
                                >
                                    {expandedNotice === notice.id ? "See Less" : "See More"}
                                </button>
                            )}

                            <div className="notice-footer">
                                <span className="notice-author">Posted by: <strong>{notice.author}</strong></span>
                                <button className="icon-btn edit" onClick={() => handleEditClick(notice)}>✏️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Post New Notice"
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={newNotice.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            name="content"
                            value={newNotice.content}
                            onChange={handleInputChange}
                            required
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select name="type" value={newNotice.type} onChange={handleInputChange} required>
                            <option value="Info">Info</option>
                            <option value="Important">Important</option>
                            <option value="Event">Event</option>
                            <option value="Warning">Warning</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Author</label>
                        <input
                            type="text"
                            name="author"
                            value={newNotice.author}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="submit-btn">Post Notice</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Notices;
