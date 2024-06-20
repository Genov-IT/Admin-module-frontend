import React, {useState} from 'react';
import {Form, Input, Button, Card, Row, Col, Typography, message, Modal} from 'antd';
import logoimgwording from '../images/Coloration.png'
import genovit from '../images/genovIT-2.jpeg'
import childrensImg from '../images/2.jpeg'
import {useHistory} from 'react-router-dom';
import {authService} from '../services/AuthService';
import {PhoneOutlined} from '@ant-design/icons';
import {companyDetails} from '../enums/constants';

const {Text} = Typography;


// Import your vector image or use a placeholder image
// import VectorImage from './path/to/vector_image.svg'; // Update with the correct path
const {Title, Paragraph} = Typography;
const {Item} = Form;

function Login() {

    const [errorMsg, setErrorMessage] = useState('');
    const screenWidth = window.innerWidth;
    const history = useHistory();

    const onFinish = async (values) => {
        try {
            await authService.login(values.username, values.password).then(
                (res) => {
                    console.log(res);
                    if (res.status == 200) {
                        history.push('/dashboard');
                    } else {
                        message.error(res.data.message);
                        setErrorMessage(res.data.message)
                    }
                },
                (error) => {
                    const errorMsg = error.response?.data?.message;
                    console.log(errorMsg);
                    message.error(errorMsg);
                    setErrorMessage(errorMsg)
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleForgetPasswordClick = () => {
        Modal.info({
            title: 'Forget Password',
            content: (
                <div>
                    <p>Contact admin for password recovery assistance.</p>
                    <Text><PhoneOutlined/> Phone: {companyDetails.PHONE_NUMBER}</Text>
                </div>
            ),
            onOk() {
            },
        });
    };


    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden'
        }}>
            <Row style={{width: '100%', height: '100%'}}>
                <Col xs={24} lg={12}
                     style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'}}>
                    <div style={{width: '100%', maxWidth: '500px'}}>
                        <img src={logoimgwording} alt="logo" style={{width: '50%'}}/>
                        <img src={genovit} alt="logo" style={{width: '50%'}}/>
                        <Typography style={{marginBottom: '20px', textAlign: 'left'}}>
                            <Title level={2} style={{
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: 'black'
                            }}>Login to <span style={{color: '#fa8c16'}}>Colouration colombo</span></Title>
                            <Paragraph style={{fontWeight: '500', color: 'gray'}}>Everything that you can see in the
                                world around you presents itself to your eyes only as an arrangement of patches of
                                different colors.</Paragraph>
                        </Typography>
                        <Form
                            name="login-form"
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            layout='vertical'
                            style={{width: '100%'}}
                        >
                            <Item
                                label={"Username"}
                                name="username"
                                rules={[{required: true, message: 'Please input your username!'}]}
                                style={{marginBottom: '16px', fontWeight: '500'}}
                            >
                                <Input placeholder="your-email@gmail.com" style={{padding: '10px'}}/>
                            </Item>
                            <Item
                                label={"Password"}
                                name="password"
                                rules={[{required: true, message: 'Please input your password!'}]}
                                style={{marginBottom: '16px', fontWeight: '500'}}
                            >
                                <Input.Password placeholder="Your Password" style={{padding: '10px'}}/>
                            </Item>
                            <Row justify="space-between" align="middle" style={{marginBottom: '16px'}}>
                                <Item name="remember" valuePropName="checked" noStyle>

                                </Item>
                                <a onClick={handleForgetPasswordClick}>Forgot Password?</a>
                            </Row>
                            <Item>
                                <Button type="primary" htmlType="submit"
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#fa8c16',
                                            borderColor: '#fa8c16',
                                            height: "40px"

                                        }}>
                                    <span style={{fontWeight: '600'}}>Log In</span>
                                </Button>
                            </Item>
                        </Form>
                    </div>
                </Col>
                <Col xs={24} lg={12}
                     style={{overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img src={childrensImg} alt="Decorative"
                         style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
