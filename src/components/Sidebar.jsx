import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { RxDashboard } from "react-icons/rx";
import { MdMeetingRoom } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { GoAlertFill } from "react-icons/go";
import { PiSpeakerHighFill } from "react-icons/pi";
import { MdLogout, MdClose } from "react-icons/md";
const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <RxDashboard /> },
        { path: '/rooms', label: 'Rooms', icon: <MdMeetingRoom /> },
        { path: '/students', label: 'Students', icon: <PiStudentBold /> },
        { path: '/complaints', label: 'Complaints', icon: <GoAlertFill /> },
        { path: '/notices', label: 'Notices', icon: <PiSpeakerHighFill /> },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                {isOpen ? <h2>Hostel Managnent</h2> : <h2>HM</h2>}
                <button className="close-sidebar-btn" onClick={toggleSidebar}>
                    <MdClose />
                </button>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                        <Link to={item.path} className="sidebar-link" title={!isOpen ? item.label : ''}>
                            <span className="sidebar-icon">{item.icon}</span>
                            {isOpen && <span className="sidebar-label">{item.label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <Link to="/" className="sidebar-link logout" title={!isOpen ? 'Logout' : ''}>
                    <span className="sidebar-icon"><MdLogout /></span>
                    {isOpen && <span className="sidebar-label">Logout</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
