import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    Layout,
    Divider,
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Upload,
    message as AntMessage,
    Table,
    Tabs,
    Card,
    Grid, Switch
} from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    SettingOutlined,
    LaptopOutlined,
    AlertOutlined,
    LinkOutlined
} from '@ant-design/icons';
import axios from "axios";
import Swal from 'sweetalert2';
import moment from 'moment';
import {appURLs, webAPI} from '../enums/urls';
import Loader from '../component/commonComponent/Loader';
import {authService} from '../services/AuthService';
import Notification from "../component/Notification/CustomNotification ";
import {NotificationPlacement, NotificationType} from "../enums/constants";
import AxiosInstance from "../utils/AxiosInstance";
import axiosInstance from "../utils/AxiosInstance";
import {EnumConverter} from "../utils/EnumConverter";

const {Item} = Form;
const {Option} = Select;
const {Header, Content} = Layout;
const {Dragger} = Upload;
const {TabPane} = Tabs;
const {useBreakpoint} = Grid;

function UserProfile({isDarkMode}) {
    const [form] = Form.useForm();
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [user, setUser] = useState({});
    const [genderRef, setGenderRef] = useState([]);
    const [nationalityLov, setNationalityLov] = useState([]);
    const [languageLov, setLanguageLov] = useState([]);
    const [designationLov, setDesignationLov] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [savedStaff, setSavedStaff] = useState({});
    const screens = useBreakpoint();

    const onFinish = (values) => {
        console.log(values)

        const reqBody = {
            "id": savedStaff ? savedStaff.id : null,
            "isSystemUser": false,
            "isSystemUserVerified": false,
            "userVerificationEmail": null,
            "isSuperUser": null,
            "user": {
                "id": null,
                "username": null,
                "password": null
            },
            "isActive": isActive,
            "salutation": values.salutation,
            "firstName": values.firstName,
            "lastName": values.lastName,
            "otherName": null,
            "fullName": values.firstName + ' ' + values.lastName,
            "nationalityId": values.nationality,
            "languageId": values.preferredLanguage,
            "employeeNumber": values.employeeNumber,
            "lineManagerId": null,
            "profilePhotoPath": null,
            "signaturePhotoPath": null,
            "gender": values.gender,
            "isContactVerified": false,
            "dateOfBirth": values.dateOfBirth,
            "employmentType": null,
            "startDate": values.startDate,
            "endDate": null,
            "departmentId": null,
            "designationId": values.designation,
            "staffPrimaryEmail": null,
            "staffPrimaryMobileNumber": null,
            "staffPrimaryLandLineNumber": null,
            "identifications": [],
            "staffContacts": [],
            "physicalAddresses": [],
            "assignedDevices": [],
            "emergencyDetails": []
        };

        setLoaderStatus(true);
        axiosInstance.post(appURLs.web + webAPI.staffCreate, reqBody)
            .then((res) => {
                setLoaderStatus(false);
                if (res.status === 200) {
                    getUserDetailsById(res.data.id)
                    Notification.success(NotificationType.SUCCESS, "Successfully created !", NotificationPlacement.TOP_RIGHT);
                }
            })
            .catch((error) => {
                setLoaderStatus(false);
                Notification.error(NotificationType.ERROR, error?.response?.data.message, NotificationPlacement.TOP_RIGHT);
                console.error("Error", error);
            });
    };

    const handleClear = () => {
        form.resetFields(); // Reset form fields
    };

    const getUserDetailsById = (id) => {
        axiosInstance.get(`${appURLs.web}${webAPI.getStaffById}${id}`)
            .then((res) => {
                setLoaderStatus(false);
                if (res.status === 200) {
                    setSavedStaff(res.data);

                }
            })
            .catch((error) => {
                setLoaderStatus(false);
                Notification.error(NotificationType.ERROR, error?.response?.data.message, NotificationPlacement.TOP_RIGHT);
                console.error("Error", error);
            });
    };

    const getGenderReference = async (type) => {
        try {
            const res = await axiosInstance.get(`${appURLs.web}${webAPI.enum}?type=${type}`);
            if (res.status === 200) {
                setGenderRef(EnumConverter.convertToWords(res.data));
                console.log('Gender data:', res.data); // Added logging
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("Error in getGenderReference:", error);
        } finally {
            setLoaderStatus(false);
        }
    };

    const getReferenceData = async (syrnationality) => {
        const requestBody = {
            select: ["id", "name"],
            from: syrnationality,
            logic: [{where: "id", condition: "nequal", value: 0}],
            orderBy: ["id:DESC"],
            resultType: "M"
        };

        try {
            const res = await axiosInstance.post(`${appURLs.web}${webAPI.advanceSearch}`, requestBody);
            if (res.status === 200) {
                return res.data.result;
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("Error in getReferenceData:", error);
            throw error;
        }
    };

    const getUserReferenceData = async () => {
        setLoaderStatus(true);
        try {
            await getGenderReference("Gender");
            const nationalityData = await getReferenceData('syrnationality');
            const languageData = await getReferenceData('syrlanguage');
            const designationData = await getReferenceData('syrdesignation');
            setNationalityLov(EnumConverter.convertToLov(nationalityData));
            setLanguageLov(EnumConverter.convertToLov(languageData));
            setDesignationLov(EnumConverter.convertToLov(designationData));
        } catch (error) {
            console.error('Error in getUserReferenceData:', error);
        } finally {
            setLoaderStatus(false);
        }
    };

    useEffect(() => {
        getUserReferenceData();
    }, []);

    return (
        <div className="content">
            <div style={{margin: '10px 0', display: 'flex', justifyContent: 'space-between'}}>
                <Breadcrumb sstyle={{margin: '10px 0'}}>
                    <Breadcrumb.Item>User Management</Breadcrumb.Item>
                    <Breadcrumb.Item>User Profile</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={24}>
                    <Card
                        className="common-content-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                            paddingLeft: '10px', paddingRight: '10px',
                            marginTop: '10px'
                        }}
                    >
                        <Form
                            form={form}
                            name="userProfileForm"
                            onFinish={onFinish}
                            layout='vertical'
                        >
                            <Tabs defaultActiveKey="1" type={screens.xs ? "line" : "card"}>
                                <TabPane tab={<span style={{
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    margin: '0px 20px 0px 20px'
                                }}><UserOutlined/> Basic Details</span>} key="1">

                                    <Row gutter={16} style={{marginTop: "20px"}}>
                                        <Col lg={8} xs={24}>
                                            <Item label="Salutation" name="salutation" rules={[{required: true}]}>
                                                <Select>
                                                    <Option value="Mr">Mr</Option>
                                                    <Option value="Ms">Ms</Option>
                                                    <Option value="Miss">Miss</Option>
                                                    <Option value="Mrs">Mrs</Option>
                                                </Select>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="First Name" name="firstName" rules={[{required: true}]}>
                                                <Input/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Last Name" name="lastName" rules={[{required: true}]}>
                                                <Input/>
                                            </Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col lg={8} xs={24}>
                                            <Item label="Gender" name="gender" rules={[{required: true}]}>
                                                <Select
                                                    options={genderRef}
                                                />
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Date of Birth" name="dateOfBirth" rules={[{required: true}]}>
                                                <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Nationality" name="nationality">
                                                <Select
                                                    options={nationalityLov}
                                                />

                                            </Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col lg={8} xs={24}>
                                            <Item label="Joining Date" name="startDate" rules={[{required: true}]}>
                                                <DatePicker format="YYYY-MM-DD" style={{width: "100%"}}/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Preferred Language" name="preferredLanguage"
                                                  rules={[{required: true}]}>
                                                <Select
                                                    options={languageLov}
                                                />
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Designation" name="designation"
                                                  rules={[{required: true}]}>
                                                <Select
                                                    options={designationLov}
                                                />
                                            </Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col lg={8} xs={24}>
                                            <Item label="Employee Number" name="employeeNumber" rules={[{ required: true }]}>
                                                <Input />
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <div style={{ display: 'flex', alignItems: 'center',marginTop:'30px' }}>
                                                <Item  name="isActive" style={{ marginBottom: 0 }}>
                                                    <Switch
                                                        checkedChildren="True"
                                                        unCheckedChildren="False"
                                                        style={{
                                                            backgroundColor: isActive ? 'var( --theam-color)' : 'gray',
                                                            marginRight: '8px',
                                                        }}
                                                        checked={isActive}
                                                        onChange={(checked) => setIsActive(checked)}
                                                    />
                                                </Item>
                                                <span style={{fontWeight:'500'}}>{isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>

                                {/*................................................................................................................................*/}

                                <TabPane tab={<span style={{
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    margin: '0px 20px 0px 20px'
                                }}><PhoneOutlined/> Contact Details</span>} key="2">

                                    <Row gutter={16} style={{marginTop: "20px"}}>
                                        <Col lg={8} xs={24}>
                                            <Item label="Primary Email" name="staffPrimaryEmail"
                                                  rules={[{required: true, type: 'email'}]}>
                                                <Input/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Primary Mobile Number" name="staffPrimaryMobileNumber"
                                                  rules={[{required: true}]}>
                                                <Input/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Primary Land Line Number" name="staffPrimaryLandLineNumber">
                                                <Input/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab={<span style={{
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    margin: '0px 20px 0px 20px'
                                }}><SettingOutlined/> System Details</span>} key="3">

                                    <Row gutter={16} style={{marginTop: "20px"}}>
                                        <Col lg={8} xs={24}>
                                            <Item label="User Name" name="user.username" rules={[{required: true}]}>
                                                <Input/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="New Password" name="newPassword" rules={[
                                                ({getFieldValue}) => ({
                                                    validator(_, value) {
                                                        if (!value || value.length >= 6) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('Password must be at least 6 characters!');
                                                    },
                                                }),
                                            ]}>
                                                <Input.Password/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab={<span style={{
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    margin: '0px 20px 0px 20px'
                                }}><LaptopOutlined/> Assigned Devices</span>} key="4">

                                    <Table style={{marginTop: "20px"}} dataSource={user.assignedDevices} columns={[
                                        {title: 'Device Type', dataIndex: 'deviceTypes', key: 'deviceTypes'},
                                        {title: 'Make/Model', dataIndex: 'makeOrModel', key: 'makeOrModel'},
                                        {title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber'},
                                        {
                                            title: 'Assigned Date',
                                            dataIndex: 'assignedDate',
                                            key: 'assignedDate',
                                            render: text => moment(text).format('YYYY-MM-DD')
                                        },
                                        {
                                            title: 'Handover Date',
                                            dataIndex: 'handoverDate',
                                            key: 'handoverDate',
                                            render: text => moment(text).format('YYYY-MM-DD')
                                        },
                                    ]} rowKey="id"/>
                                </TabPane>
                                <TabPane tab={<span style={{
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    margin: '0px 20px 0px 20px'
                                }}><AlertOutlined/> Emergency Details</span>} key="5">

                                    <Table style={{marginTop: "20px"}} dataSource={user.emergencyDetails} columns={[
                                        {title: 'Name', dataIndex: 'name', key: 'name'},
                                        {title: 'Relationship', dataIndex: 'relationshipType', key: 'relationshipType'},
                                        {title: 'Address', dataIndex: 'address', key: 'address'},
                                        {title: 'Contact Number', dataIndex: 'contactNumber', key: 'contactNumber'},
                                        {title: 'Email', dataIndex: 'email', key: 'email'},
                                    ]} rowKey="id"/>
                                </TabPane>
                                <TabPane tab={<span style={{
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    margin: '0px 20px 0px 20px'
                                }}><LinkOutlined/> Preferences</span>} key="6">
                                    <Row gutter={16} style={{marginTop: "20px"}}>
                                        <Col lg={8} xs={24}>
                                            <Item label="Preferred Name" name="preferredName">
                                                <Input/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                            <Row style={{marginTop: "20px", marginBottom: '20px'}}>
                                <Col span={24} style={{textAlign: 'right'}}>
                                    <Button type="default" onClick={handleClear} style={{
                                        marginRight: '8px',
                                        backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                        color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                                    }}>
                                        <span style={{fontWeight: '700'}}>RESET</span>
                                    </Button>
                                    <Button type="primary" htmlType="submit"
                                            className="common-save-btn common-btn-color">
                                        <span style={{fontWeight: '600'}}>SAVE</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default UserProfile;
