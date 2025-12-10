import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const { user } = useAuth();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <header className="top-bar">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        ☰
                    </button>
                    <div className="search-bar">
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="user-profile">
                        <span className="user-name">{user ? user.name : 'Guest'}</span>
                        <div className="avatar">{user ? getInitials(user.name) : 'G'}</div>
                    </div>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
