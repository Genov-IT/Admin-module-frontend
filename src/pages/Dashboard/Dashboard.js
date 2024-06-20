import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col } from 'antd';

import AppHeader from '../../component/Hedder/Header';
import { AppstoreOutlined, BankFilled, DatabaseOutlined, AppstoreFilled, FilePdfOutlined, TeamOutlined } from '@ant-design/icons';
import MenuCard from '../../component/commonComponent/Cards/MenuCard';
import { authService } from '../../services/AuthService';
import { NavData } from '../../component/NavigationalData/NavData';

const { Meta } = Card;
const { Content } = Layout;
function Dashboard({ isDarkMode }) {
  
   
    const currentRoute = window.location.pathname;



    return (
        <Layout>
            <Content style={{ padding: '50px', marginTop: '20px' }}>
                <Row gutter={[24, 24]} justify="start">
                    {NavData().map((data, index) => (
                        currentRoute !== data.link && (
                            <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
                                <MenuCard
                                    title={data.label}
                                    description={data.description}
                                    icon={data.icon}
                                    
                                    link={data.link ? data.link : data.defLink}
                                    isDarkMode={isDarkMode}
                                />
                            </Col>
                        )
                    ))}
                </Row>
            </Content>
        </Layout>

    );
}

export default Dashboard;