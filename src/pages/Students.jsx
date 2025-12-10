import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, getRooms } from '../services/api';
import Modal from '../components/Modal';
import './Students.css';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        room: '',
        course: '',
        year: '',
        contact: '',
        status: 'Active',
        email: ''
    });

    useEffect(() => {
        loadStudents();
    }, []);
    const getRandomColor = () => {
        const colors = [
            "#A3CEF1", // Soft Blue
            "#FFB5A7", // Peach
            "#B8E0D2", // Mint Green
            "#FFD6A5", // Light Orange
            "#E2C2FF", // Lavender
            "#C9F4AA", // Pastel Green
            "#F8AFA6", // Soft Coral
            "#B5E2FA", // Powder Blue
            "#FFC6FF", // Pink Lavender
            "#D7E3FC"  // Baby Blue
        ];

        return colors[Math.floor(Math.random() * colors.length)];
    };

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        loadStudents();
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

    const loadStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddClick = () => {
        setEditingStudent(null);
        setFormData({
            name: '',
            room: '',
            course: '',
            year: '',
            contact: '',
            status: 'Active',
            email: ''
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setFormData({
            name: student.name,
            room: student.room,
            course: student.course,
            year: student.year,
            contact: student.contact,
            status: student.status,
            email: student.email || ''
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                // await studentsService.delete(id);
                // loadStudents();
                alert('Delete functionality not implemented in backend yet');
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await updateStudent(editingStudent.id, formData);
            } else {
                await createStudent(formData);
            }
            setIsModalOpen(false);
            loadStudents();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save student');
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.room.includes(searchTerm)
    );

    if (loading) return <div className="loading">Loading students...</div>;

    return (
        <div className="students-container">
            <div className="page-header">
                <h1>Student Management</h1>
                <button className="add-btn" onClick={handleAddClick}>+ Add Student</button>
            </div>

            <div className="table-controls">
                <div className="search-input">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name or room..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-dropdown">
                    <select>
                        <option value="all">All Courses</option>
                        <option value="btech">B.Tech</option>
                        <option value="mba">MBA</option>
                        <option value="bsc">B.Sc</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Room</th>
                            <th>Course</th>
                            <th>Year</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>
                                    <div
                                        className="student-avatar"
                                        style={{ backgroundColor: getRandomColor() }}
                                    >
                                        {student.name.charAt(0)}
                                    </div>
                                </td>
                                <td>{student.name}</td>
                                <td>{student.room}</td>
                                <td>{student.course}</td>
                                <td>{student.year}</td>
                                <td>{student.contact}</td>
                                <td>
                                    <span className={`status-pill ${student.status.toLowerCase()}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="icon-btn edit"
                                            title="Edit"
                                            onClick={() => handleEditClick(student)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            title="Delete"
                                            onClick={() => handleDeleteClick(student.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStudent ? "Edit Student" : "Add New Student"}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Room Number</label>
                        <select
                            name="room"
                            value={formData.room}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Room</option>
                            {rooms.map(room => {
                                const isFull = room.occupied >= room.capacity;
                                const isMaintenance = room.status === 'Maintenance';
                                const isDisabled = isFull || isMaintenance;

                                // If editing, allow keeping the current room even if full (since they are already in it)
                                // But wait, if we are editing, we might be changing rooms.
                                // If we are just updating name, we keep the same room.
                                // Ideally we should check if room.id === formData.room (current selected)
                                const isCurrentRoom = formData.room == room.id;

                                return (
                                    <option
                                        key={room.id}
                                        value={room.id}
                                        disabled={!isCurrentRoom && isDisabled}
                                    >
                                        Room {room.id} ({room.type}) - {room.occupied}/{room.capacity} {isMaintenance ? '(Maintenance)' : ''} {isFull ? '(Full)' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Course</label>
                        <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Year</label>
                        <select name="year" value={formData.year} onChange={handleInputChange} required>
                            <option value="">Select Year</option>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                            <option value="4th">4th Year</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} required>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="submit-btn">{editingStudent ? "Update Student" : "Add Student"}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Students;
