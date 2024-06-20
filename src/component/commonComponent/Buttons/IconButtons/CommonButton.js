import React from 'react';
import { Button } from 'antd';

const CommonButton = (props) => {
    const { icon, onClick ,className ,isDarkMode } = props;

    return (
        <div style={{textAlign: 'center'}}>
            <button
                className={`custom-button ${className} ${isDarkMode ? 'dark-mode' : ''}`}
                onClick={onClick}
            >
            <span className={`icon ${isDarkMode ? 'icon-dark-mode' : ''}`}>
                {icon}
            </span>
            </button>
        </div>
    );
};

export default CommonButton;
