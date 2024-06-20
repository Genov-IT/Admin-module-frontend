import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, FacebookOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';
import {companyDetails} from '../../enums/constants';
const { Footer } = Layout;
const { Text, Link } = Typography;

function AppFooter(props) {
    return (
        <Footer style={{ textAlign: 'center', padding: '20px 20px', marginTop: '20px' }}>

            <div style={{ marginTop: '20px' }}>
                {/*<Row justify="center">*/}
                {/*    <Text><PhoneOutlined /> Phone: {companyDetails.PHONE_NUMBER}</Text>*/}
                {/*</Row>*/}
                <Row justify="center">
                    <Text><span style={{fontWeight:'500'}}>GenovIT ©2024 All Rights Reserved</span></Text>
                </Row>


            </div>
        </Footer>
    );
}

export default AppFooter;
