import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Modal, Button } from 'antd';
import AppFooter from '../component/Footer/Footer';
import AppHeader from '../component/Hedder/Header';
import { ArrowRightOutlined, BankOutlined, DatabaseOutlined, AppstoreOutlined, UnlockOutlined } from '@ant-design/icons';
import MenuCard from '../component/commonComponent/Cards/MenuCard';
import { authService } from '../services/AuthService'

const { Meta } = Card;
const { Content } = Layout;
function LandingPage() {
    const screenWidth = window.innerWidth;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
    const currentUser = authService.getCurrentUser();
    const screenHeight = window.innerHeight - 180;

    const menuTittleList = [
        {
            title: 'QMS',
            description: 'QMS',
            icon: <DatabaseOutlined />,
            link: "/allQmsCirculars"
        },
        {
            title: 'Dashboard',
            description: 'Dashboard',
            icon: <AppstoreOutlined />,
            link: "/dashboard"
        },
        {
            title: 'Circulars',
            description: 'Circulars',
            icon: <AppstoreOutlined />,
            link: "/allCirculars"
        }
    ];

    const handleCardClick = (cardTitle) => {

        // if (/* logic to check if password change is required */) {
        //     // Show the password change modal
        //     setShowPasswordChangeModal(true);
        // } else {
        //     // Handle other card clicks
        // }
    };

    useEffect(() => {
        // Automatically close the modal after 5 seconds
        const timer = setTimeout(() => {
            setShowPasswordChangeModal(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [showPasswordChangeModal]);

    const handleModalClose = () => {
        setShowPasswordChangeModal(false);
    };

    const handleRedirectToUserProfile = () => {
        window.location.pathname = "/userProfile"
    };


    useEffect(() => {
        const loggedUser = authService.getCurrentUser();

        if (loggedUser.passwordstatus === 'false') {
            setShowPasswordChangeModal(true)

        }

    }, []);

    return (
        <Layout>
            <AppHeader />
            <div style={{
                margin: '5px 16px',
                minHeight: screenHeight
            }}>
                <Content style={{ padding: '40px', marginTop: '80px' }}>
                    <Row gutter={[80, 32]} justify="center">
                        {currentUser?.qmsAccess === 'true' &&
                            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                                <MenuCard
                                    title={menuTittleList[0].title}
                                    description={menuTittleList[0].description}
                                    icon={menuTittleList[0].icon}
                                    onCardClick={handleCardClick}
                                    link={menuTittleList[0].link}

                                />

                            </Col>}

                        {(currentUser?.position === 'admin' || currentUser?.position === 'editor' || currentUser?.position === 'user') &&
                            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                                <MenuCard
                                    title={menuTittleList[1].title}
                                    description={menuTittleList[1].description}
                                    icon={menuTittleList[1].icon}
                                    onCardClick={handleCardClick}
                                    link={menuTittleList[1].link}

                                />
                            </Col>}

                        {currentUser?.circularsAccess === 'true' &&
                            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                                <MenuCard
                                    title={menuTittleList[2].title}
                                    description={menuTittleList[2].description}
                                    icon={menuTittleList[2].icon}
                                    onCardClick={handleCardClick}
                                    link={menuTittleList[2].link}

                                />

                            </Col>}
                    </Row>
                </Content>
            </div>
            <AppFooter />
            <Modal
                open={showPasswordChangeModal}
                title={
                    <span>
                        <UnlockOutlined /> Change Your Password
                    </span>
                }
                onCancel={handleModalClose}
                footer={[
                    <Button key="redirect" type="primary" onClick={handleRedirectToUserProfile}>
                        Redirect to User Profile
                    </Button>,
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {/* Add your message here */}
                <p>Please change your password for security reasons.</p>
            </Modal>
        </Layout>
    );
}

export default LandingPage;
