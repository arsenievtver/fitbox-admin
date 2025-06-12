import React, { useState, useEffect } from 'react';
import '../IconButtons/DonutDashboard.css';

const Donut = ({ value, label, size = 100, duration = 500, color = 'var(--primary-color)' }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;

    const offset = circumference * (1 - animatedValue / 100);

    useEffect(() => {
        let start = null;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressValue = Math.min((progress / duration) * value, value);
            setAnimatedValue(progressValue);
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <div className="donut-wrapper" style={{ width: size, height: size + 30 }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="donut-svg"
            >
                <circle
                    className="donut-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="10"
                />
                <circle
                    className="donut-ring"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="donut-center">{Math.round(animatedValue)}%</div>
            <div className="donut-label">{label}</div>
        </div>
    );
};

const DonutDashboard = () => {
    return (
        <div className="donut-dashboard">
            <Donut value={75} label="Сила" size={70} color="var(--primary-color-2)"/>
            <Donut value={68} label="Энергия" size={100} color="var(--primary-color)"/>
            <Donut value={88} label="Ритм" size={70} color="var(--primary-color-3)"/>
        </div>
    );
};

export default DonutDashboard;


