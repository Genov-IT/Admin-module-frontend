import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    Layout,
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Upload,
    Table,
    Tabs,
    Card,
    Grid,
    Switch,
    Checkbox,
    Collapse,
    Avatar,
    Tag,
    Modal,
    Spin,
    Typography
} from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    SettingOutlined,
    LaptopOutlined,
    AlertOutlined,
    LinkOutlined,
    LoadingOutlined,
    PlusOutlined,
    FileTextOutlined,
    EditOutlined,
    DeleteOutlined,
    MailOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    FileProtectOutlined,
    DownloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {appURLs, webAPI} from '../../enums/urls';
import Notification from "../../component/Notification/CustomNotification ";
import {NotificationPlacement, NotificationType} from "../../enums/constants";
import axiosInstance from "../../utils/AxiosInstance";
import {EnumConverter} from "../../utils/EnumConverter";
import {useHistory, useParams} from "react-router-dom";
import dayjs from 'dayjs';
import Loader from "../../component/commonComponent/Loader";
import CommonButton from "../../component/commonComponent/Buttons/IconButtons/CommonButton";
import generateError from "../../utils/ErrorHandler";


const {Text} = Typography;
const {Panel} = Collapse;
const {Item} = Form;
const {Option} = Select;
const {TabPane} = Tabs;
const {useBreakpoint} = Grid;

function UserProfileCreate({isDarkMode}) {

    const [form] = Form.useForm();
    const [userContactForm] = Form.useForm();
    const [userIdentificationForm] = Form.useForm();
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [user, setUser] = useState({});
    const [genderRef, setGenderRef] = useState([]);
    const [contactRef, setContactRef] = useState([]);
    const [nationalityLov, setNationalityLov] = useState([]);
    const [languageLov, setLanguageLov] = useState([]);
    const [designationLov, setDesignationLov] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [savedStaff, setSavedStaff] = useState({});
    const screens = useBreakpoint();
    const history = useHistory();
    const [contacts, setContacts] = useState([]);
    const [identifications, setIdentifications] = useState([]);
    const [locations, setLocations] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [contactType, setContactType] = useState('');
    const [isContactModalVisible, setIsContactModalVisible] = useState(false);
    const [verifyingEmail, setVerifyingEmail] = useState('');
    const [emailLoader, setEmailLoader] = useState(false);
    const [isOtpInsertModalVisible, setIsOtpInsertModalVisible] = useState(false);
    const [otpRefData, setOtpRefData] = useState({});
    const [identificationType, setIdentificationType] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [editingIdentification, setEditingIdentification] = useState(null);
    const [uploadedFileData, setUploadedFileData] = useState({});
    const [uploadImgViewModal, setUploadImgViewModal] = useState(false);
    const [staffId, setStaffId] = useState(0);


    const handleTypeChange = (value) => {
        setContactType(value);
    };

    const emailRules = [{type: 'email', message: 'Please enter a valid email!'}];
    const numberRules = [{pattern: /^\d+$/, message: 'Please enter a valid number!'}, {
        max: 15, message: 'Number too long!'
    }];
    const commonRules = [{required: true, message: 'This field is required!'}];

    const handleAddIdentification = (values) => {
        console.log("ssss", values)
        if (editingIdentification) {
            let index;
            if (editingIdentification.id) {
                index = identifications.findIndex((identifications) => identifications.id === editingIdentification.id && identifications.identificationType === editingIdentification.identificationType);
            } else {
                index = identifications.findIndex((identifications) => identifications.key === editingIdentification.key);
            }
            if (index !== -1) {
                const updatedIdentifications = {
                    ...values,
                    key: editingIdentification.key,
                    documentPath: editingIdentification?.documentPath ? editingIdentification?.documentPath : uploadedFileData?.url
                };
                const updatedIndicationId = {
                    ...values,
                    id: editingIdentification?.id,
                    documentPath: editingIdentification?.documentPath ? editingIdentification?.documentPath : uploadedFileData?.url
                };
                // Create a new array with the updated contact
                const updatedIdentification = [...identifications.slice(0, index), editingIdentification?.id ? updatedIndicationId : updatedIdentifications, ...identifications.slice(index + 1)];
                // Update the state with the new contacts array
                setIdentifications(updatedIdentification);
            }
        } else {
            // Add a new contact
            const tempId = values.key || Date.now();
            const newIdentifications = {
                ...values,
                key: tempId,
                isDeleted: false,
                documentPath: uploadedFileData?.url
            };

            setIdentifications([...identifications, newIdentifications]);
        }
        // Reset the editing state and form
        setEditingIdentification(null);
        setUploadedFileData({});
        userIdentificationForm.resetFields();
    }

    const handleAddContact = (values) => {
        console.log("edit", editingContact)
        if (editingContact) {
            let index;
            if (editingContact.id) {
                index = contacts.findIndex((contact) => contact.id === editingContact.id && contact.contactMedium === editingContact.contactMedium);
            } else {
                index = contacts.findIndex((contact) => contact.key === editingContact.key);
            }
            if (index !== -1) {
                const updatedContact = {
                    ...values, key: editingContact.key

                };
                const updatedContactId = {
                    ...values, id: editingContact?.id, isVerified: false,
                };
                // Create a new array with the updated contact
                const updatedContacts = [...contacts.slice(0, index), editingContact?.id ? updatedContactId : updatedContact, ...contacts.slice(index + 1)];
                // Update the state with the new contacts array
                setContacts(updatedContacts);
            }
        } else {
            // Add a new contact
            const tempId = values.key || Date.now();
            const newContact = {
                ...values, key: tempId, isVerified: false, isDeleted: false
            };

            setContacts([...contacts, newContact]);
        }
        // Reset the editing state and form
        setEditingContact(null);
        userContactForm.resetFields();
    };


    const handleAddLocation = (values) => {
        setLocations([...locations, values]);
    };

    const onFinish = (values) => {
        console.log(values)
        console.log('cont', contacts)

        const reqBody = {
            "id": staffId !== 0 ? savedStaff.id : null,
            "isSystemUser": false,
            "isSystemUserVerified": false,
            "userVerificationEmail": null,
            "isSuperUser": null,
            "user": {
                "id": null, "username": null, "password": null
            },
            "isActive": isActive,
            "salutation": values.salutation,
            "firstName": values.firstName,
            "lastName": values.lastName,
            "otherName": null,
            "fullName": values.firstName + ' ' + values.lastName,
            "nationalityId": values.nationalityId,
            "languageId": values.languageId,
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
            "designationId": values.designationId,
            "staffPrimaryEmail": null,
            "staffPrimaryMobileNumber": null,
            "staffPrimaryLandLineNumber": null,
            "identifications": identifications ? identifications : [],
            "staffContacts": contacts ? contacts : [],
            "physicalAddresses": [],
            "assignedDevices": [],
            "emergencyDetails": []
        };


        if (savedStaff?.id) {
            setLoaderStatus(true);
            axiosInstance.put(appURLs.web + webAPI.staffUpdate + `${savedStaff?.id}`, reqBody)
                .then((res) => {
                    setLoaderStatus(false);
                    if (res.status === 200) {
                        getUserDetailsById(res.data.id)
                        Notification.success(NotificationType.SUCCESS, "Successfully updated !", NotificationPlacement.TOP_RIGHT);
                    }
                })
                .catch((error) => {
                    setLoaderStatus(false);
                    generateError(error);
                    console.error("Error", error);
                });
        } else {
            setLoaderStatus(true);
            axiosInstance.post(appURLs.web + webAPI.staffCreate, reqBody)
                .then((res) => {
                    setLoaderStatus(false);
                    if (res.status === 200) {
                        setStaffId(res.data.id)
                        //getUserDetailsById(res.data.id)
                        Notification.success(NotificationType.SUCCESS, "Successfully created !", NotificationPlacement.TOP_RIGHT);
                    }
                })
                .catch((error) => {
                    setLoaderStatus(false);
                    generateError(error);
                    console.error("Error", error);
                });
        }

    };

    const handleClear = () => {
        setStaffId(0);
        form.resetFields(); // Reset form fields
        userContactForm.resetFields();
        userIdentificationForm.resetFields();
        setEditingIdentification(null);
        setEditingContact(null);
        setUploadedFileData({});
    };

    const getUserDetailsById = (id) => {
        axiosInstance.get(`${appURLs.web}${webAPI.getStaffById}${id}`)
            .then((res) => {
                setLoaderStatus(false);
                if (res.status === 200) {
                    setSavedStaff(res.data);
                    setContacts(res.data?.staffContacts);
                    setIdentifications(res.data?.identifications);
                    const staffData = res.data;
                    staffData.dateOfBirth = moment(res.data?.dateOfBirth);
                    staffData.startDate = moment(res.data?.startDate);
                    setIsActive(staffData.isActive)
                    form.setFieldsValue(staffData);
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
                return res.data;
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
            const gender = await getGenderReference("Gender");
            setGenderRef(EnumConverter.convertToWords(gender));
            const contactType = await getGenderReference("ContactMedium");
            setContactRef(EnumConverter.convertToWords(contactType));
            const identificationType = await getGenderReference("IdentificationType");
            setIdentificationType(EnumConverter.convertToWords(identificationType))
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

    const handleDeleteContact = (key, type) => {
        let updatedContacts = [];
        if (type === 'key') {
            // Remove the contact with the specified key
            updatedContacts = contacts.filter((contact) => contact.key !== key.key);
        } else if (type === 'id') {
            // Find the contact with the specified id and mark it as deleted
            updatedContacts = contacts.map((contact) => contact.id === key.id && key.contactMedium === contact.contactMedium ? {
                ...contact, isDeleted: true
            } : contact);
        }
        setContacts(updatedContacts);
    };

    async function getFilePublicId(url) {
        const requestBody = {
            select: ["publicId", "filename", "url"],
            from: "dmsentity",
            logic: [{where: "url", condition: "equal", value: url}],
            orderBy: ["id:DESC"],
            resultType: "M"
        };

        try {
            const res = await axiosInstance.post(`${appURLs.web}${webAPI.advanceSearch}`, requestBody);
            if (res.status === 200) {
                const data = {
                    public_id: res.data.result[0]?.publicId,
                    fileName: res.data.result[0]?.filename,
                    url: res.data.result[0]?.url
                }
                setUploadedFileData(data);
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("Error in getReferenceData:", error);
            throw error;
        }
    }

    const handleEditContact = (contact) => {

        userContactForm.setFieldsValue(contact);
        setContactType(contact.contactMedium);
        setEditingContact(contact);
    };


    useEffect(() => {
        if (staffId !== 0) {
            getUserDetailsById(staffId);
        }
    }, [staffId]);

    useEffect(() => {
        getUserReferenceData();
    }, []);

    function handleVerifyContact(key) {
        const email = {
            contactValue: key.value, contactMedium: key.contactMedium
        }
        setVerifyingEmail(email)
        setIsContactModalVisible(true);
    }

    const closeModal = () => {
        setIsContactModalVisible(false);
    };

    const handleSendCode = (values) => {
        console.log('Send code to:', values.email);
        // Implement the code sending logic here
        closeModal(); // Close the modal after sending the code
    };

    function onSendCode() {

    }

    async function sendVerificationEmail() {
        try {
            setEmailLoader(true)
            const res = await axiosInstance.post(`${appURLs.web}${webAPI.contactVerification}`, verifyingEmail);
            if (res.status === 200) {
                setEmailLoader(false);
                setOtpRefData(res.data);
                setIsContactModalVisible(false)
                setIsOtpInsertModalVisible(true)
                return res.data.result;

            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            setEmailLoader(false)
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("Error in getReferenceData:", error);
            throw error;
        }
    }

    const handleChange = (index, value) => {
        if (isNaN(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;

        setOtp(newOtp);

        // Move focus to next input box if a digit is entered
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    async function onVerify(s) {

        const otpData = {
            otp: s, tokenRef: otpRefData?.otpRefNumber, contactMedium: verifyingEmail?.contactMedium
        }

        try {
            setEmailLoader(true)
            const res = await axiosInstance.post(`${appURLs.web}${webAPI.otpVerification}`, otpData);
            if (res.status === 200) {
                setEmailLoader(false);
                setIsOtpInsertModalVisible(false)
                getUserDetailsById(staffId);
                Notification.success(NotificationType.SUCCESS, res.data.message, NotificationPlacement.TOP_RIGHT);
                return res.data;

            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            setEmailLoader(false)
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("Error in getReferenceData:", error);
            throw error;
        }
    }

    const handleVerify = () => {
        onVerify(otp.join(''));
    };

    const handleEditIdentification = (identification) => {
        if (identification.documentPath) {
            getFilePublicId(identification?.documentPath);
        }
        if (identification.expiryDate) {
            const moment1 = dayjs(identification?.expiryDate);
            identification.expiryDate = moment1;
        }
        userIdentificationForm.setFieldsValue(identification);
        //setIdentificationType(identification?.identificationType);
        setEditingIdentification(identification);
    };


    function handleDeleteIdentification(identification, type) {
        userIdentificationForm.resetFields();
        let updatedIdentification = [];
        if (type === 'key') {
            // Remove the contact with the specified key
            updatedIdentification = identifications.filter((s) => s.key !== identification.key);
        } else if (type === 'id') {
            // Find the contact with the specified id and mark it as deleted
            updatedIdentification = identifications.map((s) => s.id === identification.id && s.identificationType === identification.identificationType ? {
                ...identification, isDeleted: true
            } : s);
        }
        setIdentifications(updatedIdentification);
    }

    function formatDate(identification) {
        const expiryDate = identification?.expiryDate;
        if (!expiryDate) {
            console.warn("Expiry date is missing or undefined for identification:", identification);
            return 'N/A';
        }
        const parsedDate = dayjs(expiryDate);
        if (!parsedDate.isValid()) {
            console.error("Invalid date format provided:", expiryDate);
            return 'Invalid Date';
        }
        const formattedDate = parsedDate.format('YYYY-MM-DD');
        console.log("Formatted expiry date:", formattedDate);
        return formattedDate;
    }

    const handleUpload = async (info) => {
        const {file} = info;

        // Create form data to be sent in the upload request
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file?.name);
        formData.append('destinationPath', 'Administration/Staff/IdentificationDocuments');
        formData.append('overwrite', false);

        try {
            setLoaderStatus(true);
            const response = await axiosInstance.post(appURLs.web + webAPI.fileUpload, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setLoaderStatus(false);
                const data = response.data.result;
                const fileData = {
                    ...data, fileName: file?.name,
                }
                setUploadedFileData(fileData);
                if (editingIdentification?.identificationType) {
                    const newEditData = {
                        ...editingIdentification,
                        documentPath: data.url
                    }
                    setEditingIdentification(newEditData);
                }
                Notification.success(NotificationType.SUCCESS, response.data.message, NotificationPlacement.TOP_RIGHT);
            }


        } catch (error) {
            setLoaderStatus(false);
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("There was an error uploading the file!", error);
        }
    };

    const handleDocumentDeleteButtonClick = async (e) => {
        e.preventDefault();
        try {
            setLoaderStatus(true);
            const response = await axiosInstance.delete(appURLs.web + webAPI.fileDelete, {
                params: {
                    publicId: uploadedFileData.public_id
                }
            });
            if (response.status === 200) {
                const newEditData = {
                    ...editingIdentification,
                    documentPath: null
                }
                setEditingIdentification(newEditData);
                setUploadedFileData({});
                setLoaderStatus(false);
                Notification.success(NotificationType.SUCCESS, response.data.message, NotificationPlacement.TOP_RIGHT);
            }
        } catch (error) {
            setLoaderStatus(false);
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("Error deleting document:", error);

        }
    };

    const handleDocumentViewButtonClick = (e) => {
        e.preventDefault();
        window.open(uploadedFileData?.url, '_blank');
    }

    function isCardSelected(identification) {
        if (identification.id) {
            return editingIdentification?.id === identification?.id;
        } else {
            return editingIdentification?.key === identification?.key;
        }
    }

    function isContactCardSelected(contact) {
        if (contact.id) {
            return editingContact?.id === contact?.id;
        } else {
            return editingContact?.key === contact?.key;
        }
    }

    return (<div className="content">
        <div style={{margin: '10px 0', display: 'flex', justifyContent: 'space-between'}}>
            <Breadcrumb sstyle={{margin: '10px 0'}}>
                <Breadcrumb.Item
                    className="custom-breadcrumb-item"
                    onClick={() => history.push('/user-dashboard')}>
                    User Management</Breadcrumb.Item>
                <Breadcrumb.Item>Add Staff</Breadcrumb.Item>
            </Breadcrumb>
        </div>

        <Card
            className="common-content-container"
            style={{
                background: isDarkMode ? 'var(--content-container-bg-dark)' : 'linear-gradient(100deg, #1489C8 24%, #58B6C3 51%)',
                paddingLeft: '12px',
                paddingRight: '8px',
                marginTop: '8px'
            }}
        >
            <Avatar
                size={115}
                src={"https://res.cloudinary.com/dge2tamb6/image/upload/v1717880623/Administration/Staff/IdentificationDocuments/IMG_0237.JPG%20%282%29.jpg"}
                alt="Avatar"
            />
        </Card>

        <Row gutter={[16, 16]}>
            <Col xs={24} lg={24}>
                <Card
                    className="common-content-container"
                    style={{
                        background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        marginTop: '10px'
                    }}
                >
                    <Form
                        form={form}
                        name="userProfileForm"
                        name="userProfileForm"
                        onFinish={onFinish}
                        layout='vertical'
                    >
                        <Tabs defaultActiveKey="1" type={screens.xs ? "line" : "card"}>
                            <TabPane tab={<span style={{
                                fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
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
                                        <Item label="Nationality" name="nationalityId">
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
                                        <Item label="Preferred Language" name="languageId"
                                              rules={[{required: true}]}>
                                            <Select
                                                options={languageLov}
                                            />
                                        </Item>
                                    </Col>
                                    <Col lg={8} xs={24}>
                                        <Item label="Designation" name="designationId"
                                              rules={[{required: true}]}>
                                            <Select
                                                options={designationLov}
                                            />
                                        </Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col lg={8} xs={24}>
                                        <Item label="Employee Number" name="employeeNumber"
                                              rules={[{required: true}]}>
                                            <Input/>
                                        </Item>
                                    </Col>
                                    <Col lg={8} xs={24}>
                                        <div style={{display: 'flex', alignItems: 'center', marginTop: '30px'}}>
                                            <Item name="isActive" style={{marginBottom: 0}}>
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
                                            <span
                                                style={{fontWeight: '500'}}>{isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>

                            {/*................................................................................................................................*/}

                            <TabPane tab={<span style={{
                                fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                            }}><PhoneOutlined/> Contact Details</span>} key="2">

                                <Collapse defaultActiveKey={['1']} style={{backgroundColor: '#7cc0ff4d'}}>
                                    <Panel header="Contact Details" key="1" icon={<PhoneOutlined/>}>
                                        <Form onFinish={handleAddContact} form={userContactForm}
                                              layout={"horizontal"}>
                                            <Row gutter={16}>
                                                <Col lg={6} xs={24}>
                                                    <Form.Item name="contactMedium" label="Type"
                                                               rules={[{required: true}]}>
                                                        <Select
                                                            options={contactRef}
                                                            onChange={handleTypeChange}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={6} xs={24}>
                                                    <Form.Item name="value" label="Contact Number or Email"
                                                               rules={[...commonRules, ...(contactType === 'EMAIL' ? emailRules : numberRules)]}>
                                                        {contactType === 'EMAIL' ? (<Input/>) : (
                                                            <Input type="number"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={6} xs={24}>
                                                    <Form.Item name="isPrimary" valuePropName="checked">
                                                        <Checkbox style={{marginTop: '35px'}}
                                                                  defaultChecked={false}>Primary
                                                            Contact</Checkbox>
                                                    </Form.Item>
                                                    <Form.Item name="isVerified" valuePropName="isVerified">

                                                    </Form.Item>
                                                </Col>
                                                <Col lg={6} xs={24}>
                                                    <Button style={{
                                                        marginTop: '20px', float: 'right'
                                                    }} type="primary"
                                                            onClick={userContactForm.submit} icon={<PlusOutlined/>}>
                                                        {editingContact ? "Update Record" : "Add Record"}
                                                    </Button>

                                                </Col>
                                            </Row>
                                        </Form>
                                        <Row gutter={16} style={{marginTop: '10px'}}>
                                            {contacts.filter(k => !k?.isDeleted).map((contact, index) => (
                                                <Col lg={6} xs={24} key={index} style={{marginTop: '20px'}}>
                                                    <Card
                                                        headStyle={{backgroundColor: isContactCardSelected(contact) && '#1890ff91'}}
                                                        title={<div style={{display: 'flex', alignItems: 'center'}}>
                                                            {contact.contactMedium === 'EMAIL' ? (
                                                                <Avatar icon={<MailOutlined/>}
                                                                        style={{marginRight: 8}}/>) : (
                                                                <Avatar icon={<PhoneOutlined/>}
                                                                        style={{marginRight: 8}}/>)}
                                                            {contact.contactMedium?.replace('_', ' ')}
                                                        </div>

                                                        }
                                                        actions={[<Button
                                                            type="link"
                                                            icon={<CheckCircleOutlined/>}
                                                            onClick={() => handleVerifyContact(contact)}
                                                            key="verify"
                                                        >
                                                            Verify
                                                        </Button>, <EditOutlined key="edit"
                                                                                 onClick={() => handleEditContact(contact)}/>,
                                                            <DeleteOutlined key="delete"
                                                                            onClick={() => handleDeleteContact(contact, contact.key ? 'key' : 'id')}/>]}
                                                    >
                                                        <p>{contact.value}</p>
                                                        <div style={{
                                                            display: 'flex', justifyContent: 'space-between'
                                                        }}>
                                                            <div>
                                                                {contact.isPrimary ? (<CheckCircleOutlined
                                                                    style={{marginRight: 8}}/>) : (
                                                                    <CloseCircleOutlined
                                                                        style={{marginRight: 8}}/>)}
                                                                {contact.isPrimary ? "Primary Contact" : "Not Primary Contact"}
                                                            </div>

                                                            {contact.isVerified ? <Tag color="green"
                                                                                       style={{marginTop: 2}}>Verified</Tag> :
                                                                <Tag color="red" style={{marginTop: 2}}>Not
                                                                    Verified</Tag>}
                                                        </div>

                                                    </Card>
                                                </Col>))}
                                        </Row>
                                    </Panel>
                                </Collapse>

                                {/*.......................................................*******************************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}

                                <Collapse defaultActiveKey={['1']}
                                          style={{marginTop: '20px', backgroundColor: '#f0f8ff24'}}>
                                    <Panel header="Identification Details" key="2" icon={<PhoneOutlined/>}
                                           style={{backgroundColor: '#f0f8ff24'}}>
                                        <Form onFinish={handleAddIdentification} form={userIdentificationForm}
                                              layout={"vertical"}>
                                            <Row gutter={16}>
                                                <Col lg={6} xs={24}>
                                                    <Form.Item name="identificationType" label="Type of Id"
                                                               rules={[{required: true}]}>
                                                        <Select
                                                            options={identificationType}
                                                            onChange={handleTypeChange}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={6} xs={24}>
                                                    <Form.Item name="identification" label="Identification Number"
                                                               rules={[{required: true}]}>
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={6} xs={24}>
                                                    <Form.Item name="issuingAuthority" label="Issuing Authority">
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={6} xs={24}>
                                                    <Form.Item name="expiryDate" label="Expiry Date">
                                                        <DatePicker style={{width: '100%'}}/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>


                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '5',
                                                alignItems: 'center'
                                            }}>
                                                     <span style={{
                                                         fontSize: '15px', fontWeight: '500', marginLeft: '15px'
                                                     }}>
                                                       <FileTextOutlined style={{marginRight: 8}}/>
                                                         {uploadedFileData.fileName ? uploadedFileData.fileName : "Identification document"}
                                                     </span>
                                                <Form.Item name="documentPath" label="">
                                                    {!uploadedFileData.fileName ? <Upload
                                                        customRequest={handleUpload} // Custom request handler
                                                        showUploadList={false} // Optionally hide the file list
                                                    >
                                                        <Button style={{margin: '20px 15px 0px 0px'}}
                                                                icon={<UploadOutlined/>}>
                                                            Upload Document
                                                        </Button>
                                                    </Upload> : <div
                                                        style={{margin: '20px 15px 0px 0px'}}
                                                        className={`button-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                                        <CommonButton
                                                            onClick={handleDocumentViewButtonClick}
                                                            icon={<EyeOutlined/>}
                                                            className="view"
                                                            isDarkMode={isDarkMode}/>

                                                        <CommonButton onClick={handleDocumentDeleteButtonClick}
                                                                      icon={<DeleteOutlined/>}
                                                                      className="delete"
                                                                      isDarkMode={isDarkMode}/>
                                                    </div>
                                                    }
                                                </Form.Item>
                                            </div>
                                            <Row style={{float: 'right'}}>
                                                <Button style={{marginTop: '15px'}} type="primary"
                                                        onClick={userIdentificationForm.submit}
                                                        icon={<PlusOutlined/>}>
                                                    {editingIdentification ? "Update Record" : "Add Record"}
                                                </Button>
                                            </Row>

                                        </Form>
                                        <Row gutter={16} style={{marginTop: '50px'}}>
                                            {identifications?.filter(k => !k?.isDeleted).map((identification, index) => (
                                                <Col lg={6} xs={24} key={index} style={{marginTop: '20px'}}>
                                                    <Card
                                                        headStyle={{backgroundColor: isCardSelected(identification) && '#1890ff91'}}
                                                        title={<div style={{display: 'flex', alignItems: 'center'}}>
                                                            <Avatar icon={<FileProtectOutlined/>}
                                                                    style={{marginRight: 8}}/>
                                                            <span>{identification.identificationType?.replace('_', ' ')}</span>
                                                        </div>}
                                                        actions={[<EditOutlined key="edit"
                                                                                onClick={() => handleEditIdentification(identification)}/>,
                                                            <DeleteOutlined key="delete"
                                                                            onClick={() => handleDeleteIdentification(identification, identification.key ? 'key' : 'id')}/>]}
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #f0f0f0',
                                                            padding: '16px'
                                                        }}
                                                    >

                                                        <Row>
                                                            <Col xs={10} lg={10}>
                                                                <p><span>Identification Number</span></p>
                                                            </Col>
                                                            <Col xs={1} lg={1}>
                                                                <p><span> :</span></p>
                                                            </Col>
                                                            <Col xs={13} lg={13}>
                                                                <p><span
                                                                    style={{fontWeight: '500'}}>{identification?.identification}</span>
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs={10} lg={10}>
                                                                <p><span>Issuing Authority</span></p>
                                                            </Col>
                                                            <Col xs={1} lg={1}>
                                                                <p><span> :</span></p>
                                                            </Col>
                                                            <Col xs={13} lg={13}>
                                                                <p>
                                                                        <span
                                                                            style={{fontWeight: '500'}}>{identification?.issuingAuthority ? identification?.issuingAuthority : 'N/A'}</span>
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs={10} lg={10}>
                                                                <p><span>Expiry Date</span></p>
                                                            </Col>
                                                            <Col xs={1} lg={1}>
                                                                <p><span> :</span></p>
                                                            </Col>
                                                            <Col xs={13} lg={13}>
                                                                <p>
                                                                        <span
                                                                            style={{fontWeight: '500'}}>{formatDate(identification)}</span>
                                                                </p>
                                                            </Col>
                                                        </Row>


                                                        <Row style={{
                                                            marginTop: '20px',
                                                            border: '1px solid #d9d9d9',
                                                            padding: '10px',
                                                            borderRadius: '4px',
                                                            background: '#fafafa'
                                                        }}>
                                                            <Col span={20}>
                                                                <Button
                                                                    disabled={!identification?.documentPath}
                                                                    type="link"
                                                                    onClick={() => window.open(identification?.documentPath)}
                                                                    icon={<FileProtectOutlined/>}>
                                                                    Identification Document</Button>
                                                            </Col>
                                                            <Col span={4} style={{textAlign: 'right'}}>
                                                                <Button type="primary" shape="circle"
                                                                        icon={<DownloadOutlined/>}
                                                                        disabled={!identification?.documentPath}
                                                                        onClick={() => {
                                                                            fetch(identification?.documentPath)
                                                                                .then((response) => response.blob())
                                                                                .then((blob) => {
                                                                                    const url = window.URL.createObjectURL(new Blob([blob]));
                                                                                    const link = document.createElement("a");
                                                                                    link.href = url;
                                                                                    link.download = identification.identification || "downloaded-file";
                                                                                    document.body.appendChild(link);

                                                                                    link.click();

                                                                                    document.body.removeChild(link);
                                                                                    window.URL.revokeObjectURL(url);
                                                                                })
                                                                                .catch((error) => {
                                                                                    console.error("Error fetching the file:", error);
                                                                                });
                                                                        }}/>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>))}
                                        </Row>
                                    </Panel>
                                </Collapse>

                            </TabPane>


                            {/*..........................................................................................................*/}

                            <TabPane tab={<span style={{
                                fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                            }}><SettingOutlined/> System Details</span>} key="3">

                                <Row gutter={16} style={{marginTop: "20px"}}>
                                    <Col lg={8} xs={24}>
                                        <Item label="User Name" name="user.username" rules={[{required: true}]}>
                                            <Input/>
                                        </Item>
                                    </Col>
                                    <Col lg={8} xs={24}>
                                        <Item label="New Password" name="newPassword"
                                              rules={[({getFieldValue}) => ({
                                                  validator(_, value) {
                                                      if (!value || value.length >= 6) {
                                                          return Promise.resolve();
                                                      }
                                                      return Promise.reject('Password must be at least 6 characters!');
                                                  },
                                              }),]}>
                                            <Input.Password/>
                                        </Item>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab={<span style={{
                                fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                            }}><LaptopOutlined/> Assigned Devices</span>} key="4">

                                <Table style={{marginTop: "20px"}} dataSource={user.assignedDevices} columns={[{
                                    title: 'Device Type',
                                    dataIndex: 'deviceTypes',
                                    key: 'deviceTypes'
                                }, {
                                    title: 'Make/Model',
                                    dataIndex: 'makeOrModel',
                                    key: 'makeOrModel'
                                }, {title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber'}, {
                                    title: 'Assigned Date',
                                    dataIndex: 'assignedDate',
                                    key: 'assignedDate',
                                    render: text => moment(text).format('YYYY-MM-DD')
                                }, {
                                    title: 'Handover Date',
                                    dataIndex: 'handoverDate',
                                    key: 'handoverDate',
                                    render: text => moment(text).format('YYYY-MM-DD')
                                },]} rowKey="id"/>
                            </TabPane>
                            <TabPane tab={<span style={{
                                fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                            }}><AlertOutlined/> Emergency Details</span>} key="5">

                                <Table style={{marginTop: "20px"}} dataSource={user.emergencyDetails} columns={[{
                                    title: 'Name',
                                    dataIndex: 'name',
                                    key: 'name'
                                }, {
                                    title: 'Relationship',
                                    dataIndex: 'relationshipType',
                                    key: 'relationshipType'
                                }, {
                                    title: 'Address',
                                    dataIndex: 'address',
                                    key: 'address'
                                }, {
                                    title: 'Contact Number',
                                    dataIndex: 'contactNumber',
                                    key: 'contactNumber'
                                }, {title: 'Email', dataIndex: 'email', key: 'email'},]} rowKey="id"/>
                            </TabPane>
                            <TabPane tab={<span style={{
                                fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
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
        <Modal
            visible={isContactModalVisible}
            onCancel={closeModal}
            footer={null}
            title={null}
            centered
            width={300}
            style={{textAlign: 'center'}}
        >
            <img src="/genovIT-2.jpeg" alt="Logo" style={{width: '150px'}}/>
            <p style={{fontSize: '20px'}}>  {emailLoader ? <LoadingOutlined/> : <MailOutlined/>}</p>
            <h2>Verify Contact Details</h2>
            <p style={{fontSize: '12px'}}>We will send you an SMS with code to following mail</p>
            <div style={{display: 'flex', justifyContent: 'center'}}>

                    <span style={{fontWeight: '500'}}>
                    {verifyingEmail.contactValue}
                </span>
            </div>

            <Button style={{marginTop: "10px"}} type="primary" onClick={sendVerificationEmail} block>
                Send Code
            </Button>


        </Modal>
        <Modal
            visible={isOtpInsertModalVisible}
            onCancel={() => setIsOtpInsertModalVisible(false)}
            footer={null}
            title={null}
            centered
            width={300}
            style={{textAlign: 'center'}}
        >
            <img src="/genovIT-2.jpeg" alt="Logo" style={{width: '150px'}}/>
            <h2>Verify OTP</h2>
            <p>Please enter the 6-digit authentication code which was sent to {verifyingEmail.contactValue}</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '5px', margin: '20px 0'}}>
                {otp.map((digit, index) => (<Input
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    maxLength={1}
                    style={{width: '40px', height: '40px', textAlign: 'center', fontSize: '18px'}}
                />))}
            </div>
            <Button type="primary" onClick={handleVerify} block>
                Verify
            </Button>
            <p style={{marginTop: '10px', fontSize: '12px'}}>
                Not received your OTP?{' '}
                <Text type="link" style={{color: 'blue', cursor: 'pointer'}}>
                    Resend Code
                </Text>
            </p>
        </Modal>
        <Modal
            visible={uploadImgViewModal}
            onCancel={() => setUploadImgViewModal(false)}
            footer={null} // Assuming you don't want any footer buttons
        >
            {/* Place your image component or img tag here */}
            <img src={uploadedFileData?.url} alt="Your Image"/>
        </Modal>
        {loaderStatus && <Loader/>}
    </div>);
}

export default UserProfileCreate;
