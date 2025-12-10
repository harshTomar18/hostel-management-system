import React, { useState, useEffect } from 'react';
import { createRoom, getRooms, getStudents, updateRoom } from '../services/api';
import Modal from '../components/Modal';
import './Rooms.css';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingRoom, setViewingRoom] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomStudents, setRoomStudents] = useState([]);
    const [newRoom, setNewRoom] = useState({
        type: 'Single',
        capacity: 1,
        occupied: 0,
        status: 'Available',
        floor: 1
    });

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (error) {
            console.error('Error loading rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddClick = () => {
        setViewingRoom(null);
        setEditingRoom(null);
        setRoomStudents([]);
        setNewRoom({
            type: 'Single',
            capacity: 1,
            occupied: 0,
            status: 'Available',
            floor: 1
        });
        setIsModalOpen(true);
    };

    const handleViewDetails = async (room) => {
        setViewingRoom(room);
        try {
            // Fetch all students and filter by room number
            // Note: In a real API, we would likely have an endpoint like /rooms/:id/students
            const allStudents = await getStudents();
            const studentsInRoom = allStudents.filter(s => s.room === room.id.toString());
            setRoomStudents(studentsInRoom);
        } catch (error) {
            console.error('Error loading room students:', error);
            setRoomStudents([]);
        }
        setIsModalOpen(true);
    };

    const handleEditClick = (room) => {
        setEditingRoom(room);
        setNewRoom({
            type: room.type,
            capacity: room.capacity,
            occupied: room.occupied,
            status: room.status,
            floor: room.floor
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (editingRoom) {
                result = await updateRoom(editingRoom.id, newRoom);
            } else {
                result = await createRoom(newRoom);
            }

            if (result.status === 'success') {
                setIsModalOpen(false);
                setNewRoom({
                    type: 'Single',
                    capacity: 1,
                    occupied: 0,
                    status: 'Available',
                    floor: 1
                });
                setEditingRoom(null);
                loadRooms();
                alert(editingRoom ? 'Room updated successfully!' : 'Room added successfully!');
            } else {
                alert('Failed to save room: ' + result.message);
            }
        } catch (error) {
            console.error('Error saving room:', error);
            alert('Failed to save room');
        }
    };

    const filteredRooms = filter === 'all'
        ? rooms
        : rooms.filter(room => room.status.toLowerCase() === filter);

    if (loading) return <div className="loading">Loading rooms...</div>;

    return (
        <div className="rooms-container">
            <div className="page-header">
                <h1>Room Management</h1>
                <button className="add-btn" onClick={handleAddClick}>+ Add Room</button>
            </div>

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Rooms
                </button>
                <button
                    className={`filter-tab ${filter === 'available' ? 'active' : ''}`}
                    onClick={() => setFilter('available')}
                >
                    Available
                </button>
                <button
                    className={`filter-tab ${filter === 'occupied' ? 'active' : ''}`}
                    onClick={() => setFilter('occupied')}
                >
                    Occupied
                </button>
                <button
                    className={`filter-tab ${filter === 'maintenance' ? 'active' : ''}`}
                    onClick={() => setFilter('maintenance')}
                >
                    Maintenance
                </button>
            </div>

            <div className="rooms-grid">
                {filteredRooms.map((room) => (
                    <div key={room.id} className={`room-card ${room.status.toLowerCase()}`}>
                        <div className="room-header">
                            <h3>Room {room.id}</h3>
                            <span className={`status-badge ${room.status.toLowerCase()}`}>{room.status}</span>
                        </div>
                        <div className="room-details">
                            <p><strong>Type:</strong> {room.type}</p>
                            <p><strong>Floor:</strong> {room.floor}</p>
                            <p><strong>Capacity:</strong> {room.occupied}/{room.capacity}</p>
                        </div>
                        <div className="room-progress">
                            <div
                                className="progress-bar"
                                style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                            ></div>
                        </div>
                        <div className="room-actions">
                            <button className="action-btn" onClick={() => handleViewDetails(room)}>View Details</button>
                            <button className="action-btn edit" onClick={() => handleEditClick(room)} style={{ marginLeft: '5px', backgroundColor: '#f59e0b' }}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={viewingRoom ? `Room ${viewingRoom.id} Details` : (editingRoom ? "Edit Room" : "Add New Room")}
            >
                {viewingRoom ? (
                    <div className="room-view-details">
                        <div className="detail-section">
                            <h4>Room Information</h4>
                            <p><strong>Room Number:</strong> {viewingRoom.id}</p>
                            <p><strong>Type:</strong> {viewingRoom.type}</p>
                            <p><strong>Floor:</strong> {viewingRoom.floor}</p>
                            <p><strong>Status:</strong> {viewingRoom.status}</p>
                            <p><strong>Capacity:</strong> {viewingRoom.capacity}</p>
                            <p><strong>Occupied:</strong> {viewingRoom.occupied}</p>
                        </div>

                        <div className="detail-section">
                            <h4>Residents</h4>
                            {roomStudents.length > 0 ? (
                                <ul className="residents-list">
                                    {roomStudents.map(student => (
                                        <li key={student.id} className="resident-item">
                                            <span className="resident-name">{student.name}</span>
                                            <span className="resident-contact">📞 {student.contact}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-residents">No students assigned to this room.</p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button className="submit-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Room Type</label>
                            <select name="type" value={newRoom.type} onChange={handleInputChange} required>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Triple">Triple</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Floor</label>
                            <input
                                type="number"
                                name="floor"
                                value={newRoom.floor}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={newRoom.capacity}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={newRoom.status} onChange={handleInputChange} required>
                                <option value="Available">Available</option>
                                <option value="Occupied">Occupied</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="submit-btn">{editingRoom ? "Update Room" : "Add Room"}</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Rooms;
