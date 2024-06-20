import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LockOutlined } from '@ant-design/icons';
import {useHistory, useLocation} from 'react-router-dom';
import axiosInstance from "../../utils/AxiosInstance";
import { appURLs, webAPI } from "../../enums/urls";
import { FcCancel } from "react-icons/fc";
import qs from "qs";
import axios from "axios";
import Notification from "../../component/Notification/CustomNotification ";
import {NotificationPlacement, NotificationType} from "../../enums/constants";

const { Title, Text } = Typography;

// Component for Password Reset Form
const PasswordResetForm = ({ onFinish, password, setPassword, confirmPassword, setConfirmPassword, error, passwordPolicies }) => {
    const checkPolicy = (policy) => policy.regex.test(password);


    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <img src="/genovIT-2.jpeg" alt="Logo" style={{ width: '150px' }} />
                <Title style={{ marginTop: '8px' }} level={3}>Set New Password</Title>
                <Text style={{ marginTop: '8px' }}>Your identity has been verified</Text>

                <Form
                    style={{ marginTop: '20px' }}
                    name="password_reset"
                    className="reset-password-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Item>
                    {error && <Alert message={error} type="error" />}
                    <div className="password-policies">
                        <span style={{ fontWeight: '400' }}>Be following these policies:</span>
                        {passwordPolicies.map((policy, index) => (
                            <div key={index} className={checkPolicy(policy) ? 'policy valid' : 'policy invalid'}>
                                {checkPolicy(policy) ? (
                                    <CheckCircleOutlined style={{ color: 'green', marginRight: '8px' }} />
                                ) : (
                                    <CloseCircleOutlined style={{ color: 'red', marginRight: '8px' }} />
                                )}
                                {policy.message}
                            </div>
                        ))}
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="reset-password-button">
                            <span style={{ fontWeight: '500' }}>Reset Password</span>
                        </Button>
                    </Form.Item>
                </Form>
                <Button type="link" href="#">
                    Back to Sign In
                </Button>
            </div>
        </div>
    );
};

// Component for Link Expired Message
const LinkExpiredMessage = () => {
    return (
        <div className="reset-password-container">
            <div className="reset-password-card" style={{ width: '280px' }}>
                <img src="/genovIT-2.jpeg" alt="Logo" style={{ width: '150px' }} />
                <div style={{ fontSize: '80px' }}><FcCancel /></div>
                <Title style={{ marginTop: '8px', marginBottom: '14px' }} level={5}>The Link is expired!</Title>
                <Button style={{ width: '200px' }} type="primary" href="#" className="reset-password-button">
                    <span style={{ fontWeight: '500' }}>Try Again</span>
                </Button>
            </div>
        </div>
    );
};

function ForgetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [reference, setReference] = useState('');
    const [isLinkExpired, setIsLinkExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const history = useHistory();

    // Use the useLocation hook to access the current location
    const location = useLocation();

    const passwordPolicies = [
        { regex: /(?=.*[A-Z])/, message: 'Must contain at least one uppercase letter' },
        { regex: /(?=.*\d)/, message: 'Must contain at least one number' },
        { regex: /(?=.*[@$!%*?&])/, message: 'Must contain at least one special character' },
    ];

    // Function to check if the link is expired
    function checkLinkExpired(ref) {
        axiosInstance.get(`${appURLs.web}${webAPI.verificationLikeExpired}${ref}/${ref}`)
            .then((res) => {
                if (res.status === 200) {
                    setIsLinkExpired(false);
                }
            })
            .catch((error) => {
                setIsLinkExpired(true);
            })
            .finally(() => {
                setIsLoading(false); // Stop loading once the check is complete
            });
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const ref = searchParams.get('reference');

        if (ref) {
            checkLinkExpired(ref);
            setReference(ref);
        } else {
            setIsLoading(false);
        }
    }, [location]);

    const onFinish = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
            const data = qs.stringify({
                reference: reference,
                password: password,
                confirmPassword: confirmPassword
            });
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            try {
                const response = await axios.post(appURLs.web + webAPI.passwordUpdate, data, config);
                if (response.status === 200) {
                    Notification.success(NotificationType.SUCCESS, response.data.message, NotificationPlacement.TOP_CENTER);
                    history.push('/login');
                }
            } catch (error) {
                Notification.error(NotificationType.ERROR, error.response.data.message, NotificationPlacement.TOP_RIGHT);
            }
        }
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!isLinkExpired ? (
                <PasswordResetForm
                    onFinish={onFinish}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    error={error}
                    passwordPolicies={passwordPolicies}
                />
            ) : (
                <LinkExpiredMessage />
            )}
        </div>
    );
}

export default ForgetPasswordPage;
