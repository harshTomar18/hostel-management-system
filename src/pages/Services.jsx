import React from 'react';
import './Services.css';

const Services = () => {
    const services = [
        {
            title: 'Web Development',
            description: 'Custom websites built with modern technologies like React, Vue, and Node.js.',
            icon: '💻'
        },
        {
            title: 'UI/UX Design',
            description: 'User-centered design that looks great and works perfectly on all devices.',
            icon: '🎨'
        },
        {
            title: 'SEO Optimization',
            description: 'Improve your search rankings and drive more organic traffic to your site.',
            icon: '🚀'
        },
        {
            title: 'Digital Marketing',
            description: 'Strategic marketing campaigns to grow your brand and reach new customers.',
            icon: '📈'
        }
    ];

    return (
        <div className="services-container">
            <div className="services-header">
                <h1 className="services-title">Our Services</h1>
                <p className="services-subtitle">
                    We offer a comprehensive range of digital services to help your business thrive in the modern world.
                </p>
            </div>

            <div className="services-grid">
                {services.map((service, index) => (
                    <div className="service-card" key={index}>
                        <div className="service-icon">{service.icon}</div>
                        <h3 className="service-title">{service.title}</h3>
                        <p className="service-description">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
