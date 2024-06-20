// ReusableCard.js

import React, { useState } from 'react';
import { Card } from 'antd';
import { ArrowRightOutlined, DatabaseFilled } from '@ant-design/icons';
import {useHistory} from 'react-router-dom';

const { Meta } = Card;

function MenuCard({ title, description, icon, onCardClick, link, isDarkMode  }) {
    const [isHovered, setIsHovered] = useState(false);
    const history = useHistory();

    const handleCardClick = () => {
        setIsHovered(false); // Reset hover state when clicked
        // window.location.pathname = link
        history.push(link)
        onCardClick && onCardClick(title);
    };

    return (
      
        <Card
            hoverable
            style={{
                width: '100%',
                float: 'left',
                backgroundColor: isHovered ? 'var(--card-color)' : isDarkMode ? '#ffffff14' : 'white',
                transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            <span style={{ color: isHovered ? 'black' : 'var(--theam-color)', fontSize: '25px' }}>{icon}</span>
            <span style={{ fontWeight: '500', color: 'var(--theam-color)' }}>

                <Meta
                    title={<span >{title}</span>}
                    style={{ marginBottom: '30px', marginTop: '20px' }}
                    description={<span >{description}</span>}
                />


                <span style={{ color: isHovered ? 'black' : 'var(--theam-color)' }}>
                    Explore <ArrowRightOutlined style={{ fontSize: '15px', marginLeft: '5px' }} />
                </span>
            </span>
        </Card>
    );
}

export default MenuCard;
