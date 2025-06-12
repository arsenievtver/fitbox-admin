import React from 'react';
import './energybar.css';

const EnergyBar = ({ start_bar = 0, end_bar = 800, count_bar = 500 }) => {
    const percentage = Math.min(100, Math.max(0, ((count_bar - start_bar) / (end_bar - start_bar)) * 100));

    return (
        <div className="energybar-wrapper">
            <p className="energybar-title">Твой прогресс</p>
            <div className="energybar-bar">
                <div
                    className="energybar-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="energybar-scale">
                <span>{start_bar}</span>
                <span>{end_bar}</span>
            </div>
        </div>
    );
};

export default EnergyBar;


