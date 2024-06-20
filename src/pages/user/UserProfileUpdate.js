import React, {useEffect, useRef, useState} from "react";
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
    EyeOutlined,
    SolutionOutlined,
    AimOutlined,
    MobileOutlined,
    TabletOutlined
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
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api'
import MapComponent from "../../component/commonComponent/GoogleMap/MapComponent";
import MainMapComponent from "../../component/commonComponent/GoogleMap/MainMapComponent";
import {GiPaper} from "react-icons/gi";
import {BiBook, BiCurrentLocation} from "react-icons/bi";
import generateError from "../../utils/ErrorHandler";


const {Text} = Typography;
const {Panel} = Collapse;
const {Item} = Form;
const {Option} = Select;
const {TabPane} = Tabs;
const {useBreakpoint} = Grid;

function UserProfileUpdate({isDarkMode}) {
    const {id} = useParams();
    const [form] = Form.useForm();
    const [userContactForm] = Form.useForm();
    const [userIdentificationForm] = Form.useForm();
    const [locationForm] = Form.useForm();
    const [userDeviceForm] = Form.useForm();
    const [userEmergencyDetailsForm] = Form.useForm();

    //const [locations, setLocations] = useState([]);
    const [editingLocation, setEditingLocation] = useState(null);
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [user, setUser] = useState({});
    const [genderRef, setGenderRef] = useState([]);
    const [addressTypes, setAddressTypes] = useState([]);
    const [countryRef, setCountryRef] = useState([]);
    const [contactRef, setContactRef] = useState([]);
    const [stateRef, setStateRef] = useState([]);
    const [suburbRefData, setSuburbRefData] = useState([]);
    const [cityRefData, setCityRefData] = useState([]);
    const [postalCodeRefData, setPostalCodeRefData] = useState([]);
    const [nationalityLov, setNationalityLov] = useState([]);
    const [languageLov, setLanguageLov] = useState([]);
    const [designationLov, setDesignationLov] = useState([]);
    const [assignedDeviceTypeLov, setAssignedDeviceTypeLov] = useState([]);
    const [relationshipTypesLov, setRelationshipTypesLov] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [isSystemUser, setIsSystemUser] = useState(false);
    const [savedStaff, setSavedStaff] = useState({});
    const screens = useBreakpoint();
    const history = useHistory();
    const [contacts, setContacts] = useState([]);
    const [emergencyDetails, setEmergencyDetails] = useState([]);
    const [identifications, setIdentifications] = useState([]);
    const [locations, setLocations] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [editingEmergencyDetails, setEditingEmergencyDetails] = useState(null);
    const [editingAssignDevices, setEditAssignDevices] = useState(null);
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
    const [selectedCountryRef, setSelectedCountryRef] = useState(null);
    const [selectedStateRef, setSelectedStateRef] = useState(null);
    const [selectedSuburbRef, setSelectedSuburbRef] = useState(null);
    const [selectedCityRef, setSelectedCityRef] = useState(null);
    const [selectedPostalCodeRef, setSelectedPostalCodeRef] = useState(null);
    const [cityRefDataList, setCityRefDataList] = useState([]);
    const [selectedCityData, setSelectedCityData] = useState({});
    const [collapsableKey, setCollapsableKey] = useState(1);
    const [isUserCreated, setIsUserCreated] = useState(false);
    const [devices, setDevices] = useState([]);

    const locationRefMain = useRef(null);
    const identificationRefMain = useRef(null);
    const contactRefMain = useRef(null);

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


    const onFinish = (values) => {
        console.log(values)
        console.log('cont', EnumConverter.getFieldFromObjectById(nationalityLov, values.nationalityRefId, "label"))

        const reqBody = {
            "id": savedStaff ? savedStaff.id : null,
            "isSystemUser": isSystemUser,
            "isSystemUserVerified": savedStaff.isSystemUserVerified ? savedStaff.isSystemUserVerified : false,
            "userVerificationEmail": values.userVerificationEmail,
            "isSuperUser": null,
            "user": {
                "id": null,
                "username": values.username,
                "password": null
            },
            "isActive": isActive,
            "salutation": values.salutation,
            "firstName": values.firstName,
            "lastName": values.lastName,
            "otherName": null,
            "fullName": values.firstName + ' ' + values.lastName,
            "nationalityRefId": values.nationalityRefId,
            "nationalityRefValue": EnumConverter.getFieldFromObjectById(nationalityLov, values.nationalityRefId, "label"),
            "languageRefId": values.languageRefId,
            "languageRefValue": EnumConverter.getFieldFromObjectById(languageLov, values.languageRefId, "label"),
            "employeeNumber": values.employeeNumber,
            "lineManagerId": null,
            "profilePhotoPath": savedStaff.profilePhotoPath,
            "signaturePhotoPath": null,
            "gender": values.gender,
            "isContactVerified": false,
            "dateOfBirth": values.dateOfBirth,
            "employmentType": null,
            "startDate": values.startDate,
            "endDate": null,
            "departmentId": null,
            "designationRefId": values.designationRefId,
            "designationRefValue": EnumConverter.getFieldFromObjectById(designationLov, values.designationRefId, "label"),
            "staffPrimaryEmail": null,
            "staffPrimaryMobileNumber": null,
            "staffPrimaryLandLineNumber": null,
            "identifications": identifications ? identifications : [],
            "staffContacts": contacts ? contacts : [],
            "physicalAddresses": locations ? locations : [],
            "assignedDevices": devices ? devices : [],
            "emergencyDetails": emergencyDetails ? emergencyDetails : [],
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
                        getUserDetailsById(res.data.id)
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

    const handleContactFormClear = () => {
        userContactForm.resetFields();
        setEditingContact(null);
    };

    const handleIdentificationFormClear = () => {
        userIdentificationForm.resetFields();
        setEditingIdentification(null);
        setUploadedFileData({});
    };

    const handleLocationFormClear = () => {
        setEditingLocation(null);
        locationForm.resetFields();
    };

    const handleClear = () => {
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
                    setLocations(res.data?.physicalAddresses);
                    setContacts(res.data?.staffContacts);
                    setEmergencyDetails(res.data?.emergencyDetails);
                    setDevices(res.data?.assignedDevices);
                    setIdentifications(res.data?.identifications);
                    const staffData = res.data;
                    staffData.dateOfBirth = moment(res.data?.dateOfBirth);
                    staffData.startDate = moment(res.data?.startDate);
                    staffData.userVerificationEmail = res.data?.userVerificationEmail ? res.data?.userVerificationEmail : res.data?.staffPrimaryEmail;
                    if (res.data?.user?.username && staffData.isSystemUser) {
                        setIsUserCreated(true);
                    }
                    staffData.username = res.data?.user?.username;
                    setIsActive(staffData.isActive);
                    setIsSystemUser(staffData.isSystemUser);
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

    const getReferenceData = async (syrnationality, isActive) => {
        let requestBody;
        if (isActive) {
            requestBody = {
                select: ["id", "name"],
                from: syrnationality,
                logic: [{where: "id", condition: "nequal", value: 0, logicalOperator: "AND"},
                    {where: "isActive", condition: "equal", value: isActive}],
                orderBy: ["id:DESC"],
                resultType: "M"
            };

        } else {
            requestBody = {
                select: ["id", "name"],
                from: syrnationality,
                logic: [{where: "id", condition: "nequal", value: 0}],
                orderBy: ["id:DESC"],
                resultType: "M"
            };

        }

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
            setIdentificationType(EnumConverter.convertToWords(identificationType));

            const addressTypes = await getGenderReference("AddressTypes");
            setAddressTypes(EnumConverter.convertToWords(addressTypes));

            const countryRef = await getFasteFindAllData("syrcountry");
            setCountryRef(EnumConverter.convertToLov(countryRef));
            console.log("Country", countryRef);
            const nationalityData = await getReferenceData('syrnationality');
            setNationalityLov(EnumConverter.convertToLov(nationalityData));
            const languageData = await getReferenceData('syrlanguage');
            setLanguageLov(EnumConverter.convertToLov(languageData));
            const designationData = await getReferenceData('syrdesignation');
            setDesignationLov(EnumConverter.convertToLov(designationData));
            const assignedDevices = await getReferenceData('syrassigneddevicetype', true);
            setAssignedDeviceTypeLov(EnumConverter.convertToLov(assignedDevices));
            const relationshipTypes = await getReferenceData('syrrelationshiptype', true);
            setRelationshipTypesLov(EnumConverter.convertToLov(relationshipTypes));
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
                getUserDetailsById(id);
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

    async function uploadFile(formData) {
        try {
            setLoaderStatus(true);
            const response = await axiosInstance.post(appURLs.web + webAPI.fileUpload, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setLoaderStatus(false);
                return response;
                Notification.success(NotificationType.SUCCESS, response.data.message, NotificationPlacement.TOP_RIGHT);
            }
        } catch (error) {
            setLoaderStatus(false);
            Notification.error(NotificationType.ERROR, error?.response?.data.message || 'An error occurred', NotificationPlacement.TOP_RIGHT);
            console.error("There was an error uploading the file!", error);
        }
    }

    const handleUpload = async (info) => {
        const {file} = info;
        // Create form data to be sent in the upload request
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file?.name);
        formData.append('destinationPath', 'Administration/Staff/IdentificationDocuments');
        formData.append('overwrite', false);
        const response = await uploadFile(formData);
        const data = response?.data?.result;
        if (data) {
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

    async function advanceSearch(reqBody) {
        try {
            const res = await axiosInstance.post(`${appURLs.web}${webAPI.advanceSearch}`, reqBody);
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
    }

    async function getFasteFindAllByAssociation(resource, association, associationId) {
        let requestBody;
        if (resource === "syrpostalcode") {
            requestBody = {
                select: ["id", "code"],
                from: resource,
                logic: [{where: association, condition: "equal", value: associationId}],
                orderBy: ["id:DESC"],
                resultType: "M"
            };
        } else {
            requestBody = {
                select: ["id", "name"],
                from: resource,
                logic: [{where: association, condition: "equal", value: associationId}],
                orderBy: ["id:DESC"],
                resultType: "M"
            };
        }

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
    }

    const getFasteFindAllData = async (resource) => {
        const link = `${resource}/find/all`;
        try {
            const res = await axiosInstance.get(`${appURLs.web}${webAPI.fasteFindeAll}${link}`);
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

    const scrollToElementWithMargin = (element, margin = 20) => {
        if (element && element.current) {
            // Get the element's position relative to the top of the document
            const elementPosition = element.current.getBoundingClientRect().top + window.scrollY;
            // Subtract the margin from the calculated position
            const offsetPosition = elementPosition - margin;
            // Smooth scroll to the calculated position
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handlePanelChange = (key) => {
        let targetRef = null;
        switch (key) {
            case 1:
                targetRef = scrollToElementWithMargin(contactRefMain, 20);
                break;
            case 2:
                targetRef = scrollToElementWithMargin(identificationRefMain, 20);
                break;
            case 3:
                targetRef = scrollToElementWithMargin(locationRefMain, 20);
                break;
            default:
                break;
        }
    };


    //Location information..................................................... Start

    const handleAddLocation = (values) => {
        console.log("location", values);
        console.log("editingLocation", editingLocation);
        console.log("locations", locations);

        const getRefValue = (refData, refId, field = "label") =>
            EnumConverter.getFieldFromObjectById(refData, refId, field);

        const createLocationObject = (baseValues, idOrKey) => ({
            ...baseValues,
            key: idOrKey,
            id: editingLocation?.id,
            isDeleted: false,
            longitude: selectedCityData[0]?.longitude,
            latitude: selectedCityData[0]?.latitude,
            countryRefValue: getRefValue(countryRef, baseValues.countryRefId),
            regionRefValue: getRefValue(stateRef, baseValues.regionRefId),
            suburbRefValue: getRefValue(suburbRefData, baseValues.suburbRefId),
            cityRefValue: getRefValue(cityRefData, baseValues.cityRefId),
            postalCodeRefValue: getRefValue(postalCodeRefData, baseValues.postalCodeRefId),
        });

        if (editingLocation) {
            // Find the index of the location being edited
            const index = editingLocation.id
                ? locations.findIndex((loc) => loc.id === editingLocation.id)
                : locations.findIndex((loc) => loc.key === editingLocation.key);

            if (index !== -1) {
                // Create the updated location object
                const updatedLocation = createLocationObject(values, editingLocation?.id ? editingLocation.id : editingLocation.key);

                // Create a new array with the updated location
                const updatedLocationList = [
                    ...locations.slice(0, index),
                    updatedLocation,
                    ...locations.slice(index + 1)
                ];

                console.log("Updated location", updatedLocationList);
                // Update the state with the new locations array
                setLocations(updatedLocationList);
            }
        } else {
            // Create a new location with a unique key
            const newLocation = createLocationObject(values, values.key || Date.now());

            setLocations([...locations, newLocation]);
        }

        // Reset the editing state and form
        setEditingLocation(null);
        locationForm.resetFields();
    };


    const handleEditLocation = (location) => {
        setSelectedCountryRef(location.countryRefId);
        setSelectedStateRef(location.regionRefId);
        setSelectedSuburbRef(location.suburbRefId);
        setSelectedCityRef(location.cityRefId);
        setSelectedPostalCodeRef(location.postalCodeRefId);
        console.log("Edit location", location);
        setEditingLocation(location);
        locationForm.setFieldsValue(location);
    };

    const handleDeleteLocation = (location, type) => {
        locationForm.resetFields();
        let updatedLocation = [];
        if (type === 'key') {
            // Remove the contact with the specified key
            updatedLocation = locations.filter((s) => s.key !== location.key);
        } else if (type === 'id') {
            // Find the contact with the specified id and mark it as deleted
            updatedLocation = locations.map((s) => s.id === location.id ? {
                ...location, isDeleted: true
            } : s);
        }
        setLocations(updatedLocation);
    };

    const isCardLocationSelected = (location) => {
        return editingLocation && location.id === editingLocation.id;
    };

    const formatAddress = (location) => {
        return `${location.lineOne}, ${location.lineTwo}, ${location?.cityRefValue}, ${location?.suburbRefValue}, ${location?.regionRefValue}, ${location?.countryRefValue}, ${location?.postalCodeRefValue}`;
    };


    useEffect(() => {
        const fetchStateRef = async () => {
            if (selectedCityRef) {
                try {
                    const postalRefData = await getFasteFindAllByAssociation("syrpostalcode", "city.id", selectedCityRef);
                    setPostalCodeRefData(EnumConverter.convertToLov(postalRefData));

                    const reqBody = {
                        select: ["longitude", "latitude"],
                        from: "syrcity",
                        logic: [{where: "id", condition: "equal", value: selectedCityRef}],
                        orderBy: ["id:DESC"],
                        resultType: "M"
                    };

                    const cityData = await advanceSearch(reqBody);
                    setSelectedCityData(cityData);
                } catch (error) {
                    console.error("Error fetching state references:", error);
                }
            }
        };
        fetchStateRef();
        const selectedCityData = cityRefDataList?.filter(city => city.id === selectedCityRef);
        setSelectedCityData(selectedCityData);
        return () => {

        };
    }, [selectedCityRef]);

    useEffect(() => {
        const fetchStateRef = async () => {
            if (selectedSuburbRef) {
                try {
                    const cityRefData = await getFasteFindAllByAssociation("syrcity", "suburb.id", selectedSuburbRef);
                    setCityRefData(EnumConverter.convertToLov(cityRefData));
                } catch (error) {
                    console.error("Error fetching state references:", error);
                }
            }
        };
        fetchStateRef();
        return () => {

        };
    }, [selectedSuburbRef]);

    useEffect(() => {
        const fetchStateRef = async () => {
            if (selectedStateRef) {
                try {
                    const suburbRefData = await getFasteFindAllByAssociation("syrsuburb", "state.id", selectedStateRef);
                    setSuburbRefData(EnumConverter.convertToLov(suburbRefData));
                } catch (error) {
                    console.error("Error fetching state references:", error);
                }
            }
        };
        fetchStateRef();
        return () => {

        };
    }, [selectedStateRef]);


    useEffect(() => {
        const fetchStateRef = async () => {
            if (selectedCountryRef) {
                try {
                    const stateRefData = await getFasteFindAllByAssociation("syrstate", "country.id", selectedCountryRef);
                    setStateRef(EnumConverter.convertToLov(stateRefData));
                } catch (error) {
                    console.error("Error fetching state references:", error);
                }
            }
        };
        fetchStateRef();
        return () => {

        };
    }, [selectedCountryRef]);

    //Location information..................................................... End


    //Assigned device information..................................................... Start

    const handleAddDevice = (values) => {
        console.log("edit", editingAssignDevices)
        const getRefValue = (refData, refId, field = "label") =>
            EnumConverter.getFieldFromObjectById(refData, refId, field);

        const createLocationObject = (baseValues, idOrKey) => ({
            ...baseValues,
            key: idOrKey,
            id: editingAssignDevices?.id,
            isDeleted: false,
            deviceTypeRefValue: getRefValue(assignedDeviceTypeLov, values.deviceTypeRefId)
        });

        if (editingAssignDevices) {
            const index = editingAssignDevices.id
                ? devices.findIndex((loc) => loc.id === editingAssignDevices.id)
                : devices.findIndex((loc) => loc.key === editingAssignDevices.key);

            if (index !== -1) {
                const updatedLocation = createLocationObject(values, editingAssignDevices?.id ? editingAssignDevices.id : editingAssignDevices.key);
                const updatedDeviceList = [
                    ...devices.slice(0, index),
                    updatedLocation,
                    ...devices.slice(index + 1)
                ];

                console.log("Updated location", updatedDeviceList);
                setDevices(updatedDeviceList);
            }
        } else {
            const newAssignedDevice = createLocationObject(values, values.key || Date.now());
            setDevices([...devices, newAssignedDevice]);
        }
        userDeviceForm.resetFields();
        editingAssignDevices(null);

    }




    function handleDeviceFormClear() {
        userDeviceForm.resetFields();
        setEditAssignDevices(null);
    }

    function isDeviceCardSelected(device) {
        if (device.id) {
            return editingAssignDevices?.id === device?.id;
        } else {
            return editingAssignDevices?.key === device?.key;
        }
    }

    const handleEditDevice = (device) => {
        setEditAssignDevices(device);
        if (device.assignedDate) {
            const moment1 = dayjs(device?.assignedDate);
            device.assignedDate = moment1;
        }
        if (device.handoverDate) {
            const moment1 = dayjs(device?.handoverDate);
            device.handoverDate = moment1;
        }
        userDeviceForm.setFieldsValue(device);
    };

    const handleDeleteDevice = (device, type) => {
        userDeviceForm.resetFields();
        let updatedDevice = [];
        if (type === 'key') {
            updatedDevice = devices.filter((s) => s.key !== device.key);
        } else if (type === 'id') {
            updatedDevice = devices.map((s) => s.id === device.id ? {
                ...device, isDeleted: true
            } : s);
        }
        setDevices(updatedDevice);
    };

    //Assigned device information..................................................... End


    //Emergency details information..................................................... Start

    const handleAddEmergencyDetails = (values) => {

        const getRefValue = (refData, refId, field = "label") =>
            EnumConverter.getFieldFromObjectById(refData, refId, field);

        const createLocationObject = (baseValues, idOrKey) => ({
            ...baseValues,
            key: idOrKey,
            id: editingEmergencyDetails?.id,
            isDeleted: false,
            relationshipTypeRefValue: getRefValue(relationshipTypesLov, baseValues.relationshipTypeRefId),
        });

        if (editingEmergencyDetails) {
            // Find the index of the location being edited
            const index = editingEmergencyDetails.id
                ? emergencyDetails.findIndex((loc) => loc.id === editingEmergencyDetails.id)
                : emergencyDetails.findIndex((loc) => loc.key === editingEmergencyDetails.key);

            if (index !== -1) {
                // Create the updated location object
                const updatedEmergencyDetails = createLocationObject(values, editingEmergencyDetails?.id ? editingEmergencyDetails.id : editingEmergencyDetails.key);

                // Create a new array with the updated location
                const updatedEmergencyDetailsList = [
                    ...emergencyDetails.slice(0, index),
                    updatedEmergencyDetails,
                    ...emergencyDetails.slice(index + 1)
                ];


                // Update the state with the new locations array
                setEmergencyDetails(updatedEmergencyDetailsList);
            }
        } else {
            // Create a new location with a unique key
            const newEmergencyDetails = createLocationObject(values, values.key || Date.now());

            setEmergencyDetails([...emergencyDetails, newEmergencyDetails]);
        }

        // Reset the editing state and form
        handleEmergencyDetailsFormClear();
    };

    function handleEmergencyDetailsFormClear() {
        setEditingEmergencyDetails(null);
        userEmergencyDetailsForm.resetFields();
    }

    const handleEditEmergencyDetails = (emergencyDetails) => {
        setEditingEmergencyDetails(emergencyDetails);
        userEmergencyDetailsForm.setFieldsValue(emergencyDetails);
    };

    const handleDeleteEmergencyDetails = (emergencyDetail, type) => {
        userEmergencyDetailsForm.resetFields();
        let emergencyDetailsList = [];
        if (type === 'key') {
            emergencyDetailsList = emergencyDetails.filter((s) => s.key !== emergencyDetail.key);
        } else if (type === 'id') {
            emergencyDetailsList = emergencyDetails.map((s) => s.id === emergencyDetail.id ? {
                ...emergencyDetail, isDeleted: true
            } : s);
        }
        setEmergencyDetails(emergencyDetailsList);
    };

    function isEmergencyDetailsSelected(emgDetail) {
        if (emgDetail.id) {
            return editingEmergencyDetails?.id === emgDetail?.id;
        } else {
            return editingEmergencyDetails?.key === emgDetail?.key;
        }
    }

    //Emergency details information..................................................... End

    useEffect(() => {
        if (id !== undefined && id !== null) {
            getUserDetailsById(id);
        }
    }, [id]);

    useEffect(() => {
        getUserReferenceData();
    }, []);




    return (
        <div className="content">
            <div style={{margin: '10px 0', display: 'flex', justifyContent: 'space-between'}}>
                <Breadcrumb sstyle={{margin: '10px 0'}}>
                    <Breadcrumb.Item
                        className="custom-breadcrumb-item"
                        onClick={() => history.push('/user-dashboard')}>
                        User Management</Breadcrumb.Item>
                    <Breadcrumb.Item>User Profile</Breadcrumb.Item>
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
                <div style={{display: 'flex'}}>
                    <label htmlFor="upload-avatar" style={{cursor: 'pointer'}}>
                        {savedStaff?.profilePhotoPath ? (
                            <Avatar
                                size={115}
                                src={savedStaff?.profilePhotoPath}
                                alt="Avatar"
                            />
                        ) : (
                            <Avatar
                                size={115}
                                icon={<UserOutlined/>} // You can use any icon for the default avatar
                            />
                        )}
                    </label>
                    <input
                        id="upload-avatar"
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            // Create form data to be sent in the upload request
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('filename', file?.name);
                            formData.append('destinationPath', 'Administration/Staff/Profile-photo');
                            formData.append('overwrite', false);
                            const response = await uploadFile(formData);
                            console.log("photo", response);
                            savedStaff.profilePhotoPath = response?.data?.result?.url
                            setSavedStaff(savedStaff);
                        }}
                    />
                    <div style={{marginLeft: '40px', display: 'grid'}}>
                        <span
                            style={{fontSize: '24px', fontWeight: '700', color: 'white'}}>{savedStaff?.fullName}</span>
                        <span
                            style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'white',
                                justifyContent: 'space-around'
                            }}><MailOutlined/> {savedStaff?.staffPrimaryEmail ? savedStaff?.staffPrimaryEmail : 'N/A'}</span>
                        <span
                            style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'white'
                            }}><PhoneOutlined/> {savedStaff?.staffPrimaryMobileNumber ? savedStaff?.staffPrimaryMobileNumber : 'N/A'}</span>
                        <Tag color={savedStaff?.isActive ? 'green' : 'volcano'} style={{
                            width: 'fit-content',
                            alignItems: 'center',
                            height: 'fit-content',
                            borderRadius: '10px'
                        }}>
                            {isActive ? <span style={{fontWeight: '700', padding: '10px'}}>Active</span> :
                                <span>Inactive</span>}
                        </Tag>

                    </div>
                </div>
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
                            <Tabs  defaultActiveKey="1" type={screens.xs ? "line" : "card"}>
                                <TabPane  tab={<span style={{
                                    fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                                }}><UserOutlined/> Basic Details</span> } key="1" >

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
                                            <Item label="Date of Birth" name="dateOfBirth"
                                                  rules={[{required: true}]}>
                                                <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Nationality" name="nationalityRefId">
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
                                            <Item label="Preferred Language" name="languageRefId"
                                                  rules={[{required: true}]}>
                                                <Select
                                                    options={languageLov}
                                                />
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Designation" name="designationRefId"
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

                                    {/*.......................................................***************Contact Details****************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
                                    <div ref={contactRefMain}>
                                        <Collapse expandIconPosition="right" defaultActiveKey={['1']}
                                                  style={{
                                                      border: collapsableKey === 1 && '1.5px solid #58b6c3',
                                                      marginTop: '16px'
                                                  }} onChange={() => {
                                            setCollapsableKey(1);
                                            handlePanelChange(1);
                                        }}>
                                            <Panel header={
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <Avatar icon={<PhoneOutlined/>}/>
                                                    <span style={{marginLeft: 16, fontWeight: 500, fontSize: 16}}>Contact Details</span>
                                                </div>
                                            } key="1"
                                                   icon={<PhoneOutlined/>} onClick={() => {
                                                setCollapsableKey(1);
                                                handlePanelChange(1);
                                            }}>

                                                <div style={{padding: '16px'}}>
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
                                                                <div style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'end',
                                                                    marginTop: '20px',
                                                                    float: 'right'
                                                                }}>

                                                                    <Button type="default"
                                                                            onClick={handleContactFormClear}
                                                                            style={{
                                                                                marginRight: '8px',
                                                                                backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                                                color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                                                border: '1px solid var(--cancel-btn-color-light)'

                                                                            }}>
                                                                        <span style={{
                                                                            fontWeight: '700',
                                                                            minWidth: 60
                                                                        }}>Rest</span>
                                                                    </Button>

                                                                    <Button type="default"
                                                                            onClick={userContactForm.submit}

                                                                            style={{
                                                                                marginRight: '8px',
                                                                                backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                                                color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                                                border: '1px solid var(--cancel-btn-color-light)'

                                                                            }}>
                                                                        <span
                                                                            style={{fontWeight: '700'}}><PlusOutlined/> {editingContact ? "Update Record" : "Add Record"}</span>
                                                                    </Button>

                                                                </div>

                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                    <Row gutter={[32, 12]} style={{marginTop: '16px'}}>
                                                        {contacts.filter(k => !k?.isDeleted).map((contact, index) => (
                                                            <Col lg={8} xs={24} key={index} style={{marginTop: '20px'}}>
                                                                <Card
                                                                    headStyle={{backgroundColor: isContactCardSelected(contact) && '#1890ff91'}}
                                                                    title={<div
                                                                        style={{display: 'flex', alignItems: 'center'}}>
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
                                                                    <p style={{marginBottom: '8px'}}>{contact.value}</p>
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
                                                </div>
                                            </Panel>
                                        </Collapse>
                                    </div>
                                    {/*.......................................................***************Identification Details****************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}

                                    <div ref={identificationRefMain}>
                                        <Collapse expandIconPosition="right" defaultActiveKey={['1']}
                                                  style={{
                                                      marginTop: '32px',
                                                      border: collapsableKey === 2 && '1.5px solid #58b6c3'
                                                  }} onChange={() => {
                                            setCollapsableKey(2);
                                            handlePanelChange(2);
                                        }}>
                                            <Panel
                                                header={
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: 16
                                                    }}>
                                                        <Avatar icon={<SolutionOutlined/>}/>
                                                        <span style={{marginLeft: 12, fontWeight: 500}}>Identification Details</span>
                                                    </div>
                                                } key="2" icon={<SolutionOutlined/>}
                                                style={{backgroundColor: '#f0f8ff24'}}
                                                onClick={() => {
                                                    setCollapsableKey(2);
                                                    handlePanelChange(2);
                                                }}>
                                                <div style={{padding: '16px'}}>
                                                    <Form onFinish={handleAddIdentification}
                                                          form={userIdentificationForm}
                                                          layout={"vertical"}>
                                                        <Row gutter={20}>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="identificationType"
                                                                           label="Type of Id"
                                                                           rules={[{required: true}]}>
                                                                    <Select
                                                                        options={identificationType}
                                                                        onChange={handleTypeChange}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="identification"
                                                                           label="Identification Number"
                                                                           rules={[{required: true}]}>
                                                                    <Input/>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="issuingAuthority"
                                                                           label="Issuing Authority">
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
                                                                    <Button style={{
                                                                        margin: '20px 15px 0px 0px',
                                                                        fontWeight: "500"
                                                                    }}
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

                                                                    <CommonButton
                                                                        onClick={handleDocumentDeleteButtonClick}
                                                                        icon={<DeleteOutlined/>}
                                                                        className="delete"
                                                                        isDarkMode={isDarkMode}/>
                                                                </div>
                                                                }
                                                            </Form.Item>
                                                        </div>
                                                        <Row style={{float: 'right'}}>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'end',
                                                                marginTop: '20px',
                                                                float: 'right'
                                                            }}>
                                                                <Button type="default"
                                                                        onClick={handleIdentificationFormClear}
                                                                        style={{
                                                                            marginRight: '8px',
                                                                            backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                                            color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                                            border: '1px solid var(--cancel-btn-color-light)'

                                                                        }}>
                                                                    <span style={{
                                                                        fontWeight: '700',
                                                                        minWidth: 60
                                                                    }}>Rest</span>
                                                                </Button>
                                                                <Button type="default"
                                                                        onClick={userIdentificationForm.submit}

                                                                        style={{
                                                                            marginRight: '8px',
                                                                            backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                                            color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                                            border: '1px solid var(--cancel-btn-color-light)'

                                                                        }}>
                                                                    <span
                                                                        style={{fontWeight: '700'}}><PlusOutlined/> {editingIdentification ? "Update Record" : "Add Record"}</span>
                                                                </Button>

                                                            </div>
                                                        </Row>

                                                    </Form>
                                                    <Row gutter={[32, 12]} style={{marginTop: '52px'}}>
                                                        {identifications?.filter(k => !k?.isDeleted).map((identification, index) => (
                                                            <Col lg={8} xs={24} key={index}
                                                                 style={{marginTop: '20px'}}>
                                                                <Card
                                                                    headStyle={{backgroundColor: isCardSelected(identification) && '#1890ff91'}}
                                                                    title={<div
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }}>
                                                                        <Avatar icon={<FileProtectOutlined/>}
                                                                                style={{marginRight: 8}}/>
                                                                        <span>{identification.identificationType?.replace('_', ' ')}</span>
                                                                    </div>}
                                                                    actions={[<EditOutlined key="edit"
                                                                                            onClick={() => handleEditIdentification(identification)}/>,
                                                                        <DeleteOutlined key="delete"
                                                                                        onClick={() => handleDeleteIdentification(identification, identification.key ? 'key' : 'id')}/>]}

                                                                >

                                                                    <Row>
                                                                        <Col xs={10} lg={10}
                                                                             style={{marginBottom: '8px'}}>
                                                                            <p><span>Identification Number</span>
                                                                            </p>
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
                                                                        <Col xs={10} lg={10}
                                                                             style={{marginBottom: '8px'}}>
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
                                                                        <Col xs={10} lg={10}
                                                                             style={{marginBottom: '8px'}}>
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
                                                </div>
                                            </Panel>
                                        </Collapse>
                                    </div>

                                    {/*.......................................................***************Location Details****************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
                                    <div ref={locationRefMain}>
                                        <Collapse expandIconPosition="right" defaultActiveKey={['1']}
                                                  style={{
                                                      marginTop: '32px',
                                                      border: collapsableKey === 3 && '1.5px solid #58b6c3'
                                                  }} onChange={() => {
                                            setCollapsableKey(3);
                                            handlePanelChange(3);
                                        }}>
                                            <Panel onClick={() => {
                                                setCollapsableKey(3);
                                                handlePanelChange(3);
                                            }} key="3"
                                                   icon={<PhoneOutlined/>}
                                                   style={{backgroundColor: '#f0f8ff24'}}
                                                   header={
                                                       <div style={{
                                                           display: 'flex',
                                                           alignItems: 'center',
                                                           fontSize: 16
                                                       }}>
                                                           <Avatar icon={<AimOutlined/>}/>
                                                           <span style={{
                                                               marginLeft: 12,
                                                               fontWeight: 500
                                                           }}>Location Details</span>
                                                       </div>
                                                   }>
                                                <div style={{padding: '16px'}}>
                                                    <Form onFinish={handleAddLocation} form={locationForm}
                                                          layout={"vertical"}>
                                                        <Row gutter={20}>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="addressType" label="Address Type"
                                                                           rules={[{required: true}]}>
                                                                    <Select
                                                                        options={addressTypes}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="lineOne" label="Address Line 1"
                                                                           rules={[{required: true}]}>
                                                                    <Input/>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="lineTwo" label="Address Line 2">
                                                                    <Input/>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="countryRefId" label="Country"
                                                                           rules={[{required: true}]}>
                                                                    <Select
                                                                        onChange={(record) => setSelectedCountryRef(record)}
                                                                        options={countryRef}
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                        </Row>
                                                        <Row gutter={16}>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="regionRefId"
                                                                           label="State/Province/Region">
                                                                    <Select
                                                                        onChange={(record) => setSelectedStateRef(record)}
                                                                        options={stateRef}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="suburbRefId" label="Sub-District">
                                                                    <Select
                                                                        onChange={(record) => setSelectedSuburbRef(record)}
                                                                        options={suburbRefData}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="cityRefId" label="City"
                                                                           rules={[{required: true}]}>
                                                                    <Select
                                                                        onChange={(record) => setSelectedCityRef(record)}
                                                                        options={cityRefData}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col lg={6} xs={24}>
                                                                <Form.Item name="postalCodeRefId"
                                                                           label="Postal/Zip Code">
                                                                    <Select
                                                                        onChange={(record) => setSelectedPostalCodeRef(record)}
                                                                        options={postalCodeRefData}
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                        </Row>
                                                        <span>Geo location</span>
                                                        <div
                                                            style={{height: '600px', marginTop: '10px'}}>
                                                            {console.log("selectedPostalCodeRef", selectedCityData)}
                                                            <MainMapComponent lat={selectedCityData[0]?.latitude}
                                                                              lng={selectedCityData[0]?.longitude}/>
                                                        </div>

                                                        <Row style={{float: 'right'}}>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'end',
                                                                marginTop: '30px',
                                                                float: 'right'
                                                            }}>
                                                                <Button type="default" onClick={handleLocationFormClear}
                                                                        style={{
                                                                            marginRight: '8px',
                                                                            backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                                            color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                                            border: '1px solid var(--cancel-btn-color-light)'

                                                                        }}>
                                                                    <span style={{
                                                                        fontWeight: '700',
                                                                        minWidth: 60
                                                                    }}>Rest</span>
                                                                </Button>
                                                                <Button type="default" onClick={locationForm.submit}

                                                                        style={{
                                                                            marginRight: '8px',
                                                                            backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                                            color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                                            border: '1px solid var(--cancel-btn-color-light)'

                                                                        }}>
                                                                    <span
                                                                        style={{fontWeight: '700'}}><PlusOutlined/> {editingLocation ? "Update Record" : "Add Record"}</span>
                                                                </Button>

                                                            </div>
                                                        </Row>
                                                    </Form>
                                                    <Row gutter={[32, 12]} style={{marginTop: '64px'}}>
                                                        {locations?.filter(location => !location?.isDeleted).map((location, index) => (
                                                            <Col lg={8} xs={24} key={index}
                                                                 style={{marginTop: '20px'}}>
                                                                <Card
                                                                    headStyle={{backgroundColor: isCardLocationSelected(location) && '#1890ff91'}}
                                                                    title={<div
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }}>
                                                                        <Avatar icon={<FileTextOutlined/>}
                                                                                style={{marginRight: 8}}/>
                                                                        <span>{location.addressType?.replace('_', ' ')}</span>
                                                                    </div>}
                                                                    actions={[
                                                                        <EditOutlined key="edit"
                                                                                      onClick={() => handleEditLocation(location)}/>,
                                                                        <DeleteOutlined key="delete"
                                                                                        onClick={() => handleDeleteLocation(location, location.key ? 'key' : 'id')}/>
                                                                    ]}
                                                                    style={{
                                                                        padding: '16px',
                                                                        maxWidth: '50'
                                                                    }}
                                                                >
                                                                    <Row style={{marginBottom: '8px'}}>
                                                                        <Col xs={10} lg={4}>
                                                                            <p><span>Address</span></p>
                                                                        </Col>
                                                                        <Col xs={1} lg={1}>
                                                                            <p><span>:</span></p>
                                                                        </Col>
                                                                        <Col xs={13} lg={13}>
                                                                            <p><span
                                                                                style={{fontWeight: '500'}}>{location.lineOne}, {location.lineTwo}</span>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{marginBottom: '8px'}}>
                                                                        <Col xs={10} lg={4}>
                                                                            <p><span>City</span></p>
                                                                        </Col>
                                                                        <Col xs={1} lg={1}>
                                                                            <p><span>:</span></p>
                                                                        </Col>
                                                                        <Col xs={13} lg={13}>
                                                                            <p><span
                                                                                style={{fontWeight: '500'}}>{location?.cityRefValue}</span>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{marginBottom: '8px'}}>
                                                                        <Col xs={10} lg={4}>
                                                                            <p><span>District</span></p>
                                                                        </Col>
                                                                        <Col xs={1} lg={1}>
                                                                            <p><span>:</span></p>
                                                                        </Col>
                                                                        <Col xs={13} lg={13}>
                                                                            <p><span
                                                                                style={{fontWeight: '500'}}>{location?.suburbRefValue}</span>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{marginBottom: '8px'}}>
                                                                        <Col xs={10} lg={4}>
                                                                            <p><span>Province</span></p>
                                                                        </Col>
                                                                        <Col xs={1} lg={1}>
                                                                            <p><span>:</span></p>
                                                                        </Col>
                                                                        <Col xs={13} lg={13}>
                                                                            <p><span
                                                                                style={{fontWeight: '500'}}>{location?.regionRefValue}</span>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{marginBottom: '8px'}}>
                                                                        <Col xs={10} lg={4}>
                                                                            <p><span>Country</span></p>
                                                                        </Col>
                                                                        <Col xs={1} lg={1}>
                                                                            <p><span>:</span></p>
                                                                        </Col>
                                                                        <Col xs={13} lg={13}>
                                                                            <p><span
                                                                                style={{fontWeight: '500'}}>{location?.countryRefValue}</span>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                </Card>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            </Panel>
                                        </Collapse>
                                    </div>
                                </TabPane>


                                {/*..........................................................................................................*/}

                                <TabPane tab={<span style={{
                                    fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                                }}><SettingOutlined/> System Details</span>} key="3">

                                    <Row gutter={20} style={{marginTop: "20px"}}>
                                        <Col lg={4} xs={24}>
                                            <div style={{display: 'flex', alignItems: 'center', marginTop: '30px'}}>
                                                <span>System User</span>
                                                <Item name="isSystemUser" style={{margin: '0 0 0 16px'}}>
                                                    <Switch
                                                        checkedChildren="True"
                                                        unCheckedChildren="False"
                                                        style={{
                                                            backgroundColor: isSystemUser ? 'var( --theam-color)' : 'gray',
                                                            marginRight: '8px',
                                                        }}
                                                        disabled={isUserCreated}
                                                        checked={isSystemUser}
                                                        onChange={(checked) => setIsSystemUser(checked)}
                                                    />
                                                    <span
                                                        style={{fontWeight: '500'}}>{isSystemUser ? 'Active' : 'Inactive'}</span>
                                                </Item>

                                            </div>
                                        </Col>
                                        <Col lg={8} xs={24} style={{marginLeft: '28px'}}>
                                            <Item label="User Name" name="username"
                                                  rules={[{required: !isSystemUser ? false : true}]}>
                                                <Input disabled={isUserCreated || !isSystemUser}/>
                                            </Item>
                                        </Col>
                                        <Col lg={8} xs={24}>
                                            <Item label="Verification Email" name="userVerificationEmail"
                                                  rules={[{required: !isSystemUser ? false : true}]}>
                                                <Input disabled={isUserCreated || !isSystemUser}/>
                                            </Item>
                                        </Col>

                                    </Row>
                                </TabPane>

                                <TabPane tab={<span style={{
                                    fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                                }}><LaptopOutlined/> Assigned Devices</span>} key="4">
                                    <Card style={{marginTop: '8px'}}>
                                        <div style={{padding: '8px'}}>
                                            <Form onFinish={handleAddDevice} form={userDeviceForm} layout={"vertical"}>
                                                <Row gutter={16}>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="deviceTypeRefId" label="Device Type"
                                                                   rules={[{required: true}]}>
                                                            <Select options={assignedDeviceTypeLov}
                                                                   />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="makeOrModel" label="Make/Model"
                                                                   rules={[{required: true}]}>
                                                            <Input/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="serialNumber" label="Serial Number"
                                                                   rules={[{required: true}]}>
                                                            <Input/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="assignedDate" label="Assigned Date"
                                                                   rules={[{required: true}]}>
                                                            <DatePicker style={{width: '100%'}} format="YYYY-MM-DD"/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="handoverDate" label="Handover Date">
                                                            <DatePicker style={{width: '100%'}} format="YYYY-MM-DD"/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'end',
                                                    float: 'right'
                                                }}>
                                                    <Button
                                                        type="default"
                                                        onClick={handleDeviceFormClear}
                                                        style={{
                                                            marginRight: '8px',
                                                            backgroundColor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                            color: isDarkMode ? 'var(--cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                            border: '1px solid var(--cancel-btn-color-light)'
                                                        }}>
                                                        <span style={{fontWeight: '700', minWidth: 60}}>Reset</span>
                                                    </Button>

                                                    <Button
                                                        type="default"
                                                        onClick={userDeviceForm.submit}
                                                        style={{

                                                            backgroundColor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                            color: isDarkMode ? 'var(--cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                            border: '1px solid var(--cancel-btn-color-light)'
                                                        }}>
                                                        <span
                                                            style={{fontWeight: '700'}}><PlusOutlined/> {editingAssignDevices ? "Update Record" : "Add Record"}</span>
                                                    </Button>

                                                </div>


                                            </Form>
                                            <Row gutter={[32, 12]} style={{marginTop: '32px'}}>
                                                {devices.filter(k => !k?.isDeleted).map((device, index) => (
                                                    <Col lg={6} xs={24} key={index} style={{marginTop: '20px'}}>
                                                        <Card
                                                            headStyle={{backgroundColor: isDeviceCardSelected(device) && '#1890ff91'}}
                                                            title={<div style={{display: 'flex', alignItems: 'center'}}>
                                                                <Avatar icon={<LaptopOutlined/>}
                                                                        style={{marginRight: 8}}/>
                                                                {device?.deviceTypeRefValue}
                                                            </div>}

                                                            actions={[
                                                                <EditOutlined key="edit"
                                                                              onClick={() => handleEditDevice(device)}/>,
                                                                <DeleteOutlined key="delete"
                                                                                onClick={() => handleDeleteDevice(device, device.key ? 'key' : 'id')}/>
                                                            ]}>
                                                            <Row style={{marginBottom: '8px'}}>
                                                                <Col xs={14} lg={7}>
                                                                    <p><span>Model</span></p>
                                                                </Col>
                                                                <Col xs={1} lg={1}>
                                                                    <p><span>:</span></p>
                                                                </Col>
                                                                <Col xs={9} lg={9}>
                                                                    <p><span
                                                                        style={{fontWeight: '500'}}>{device.makeOrModel}</span>
                                                                    </p>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{marginBottom: '8px'}}>
                                                                <Col xs={14} lg={7}>
                                                                    <p><span>Serial Number</span></p>
                                                                </Col>
                                                                <Col xs={1} lg={1}>
                                                                    <p><span>:</span></p>
                                                                </Col>
                                                                <Col xs={9} lg={9}>
                                                                    <p><span
                                                                        style={{fontWeight: '500'}}>{device.serialNumber}</span>
                                                                    </p>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{marginBottom: '8px'}}>
                                                                <Col xs={14} lg={7}>
                                                                    <p><span>Assigned Date</span></p>
                                                                </Col>
                                                                <Col xs={1} lg={1}>
                                                                    <p><span>:</span></p>
                                                                </Col>
                                                                <Col xs={9} lg={13}>
                                                                    <p><span
                                                                        style={{fontWeight: '500'}}>{dayjs(device.assignedDate).format('YYYY-MM-DD')}</span>
                                                                    </p>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{marginBottom: '8px'}}>
                                                                <Col xs={14} lg={7}>
                                                                    <p><span>Handover Date</span></p>
                                                                </Col>
                                                                <Col xs={1} lg={1}>
                                                                    <p><span>:</span></p>
                                                                </Col>
                                                                <Col xs={9} lg={13}>
                                                                    <p><span
                                                                        style={{fontWeight: '500'}}>{dayjs(device.handoverDate).format('YYYY-MM-DD')}</span>
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </Card>


                                </TabPane>
                                <TabPane tab={<span style={{
                                    fontWeight: '500', fontSize: '1rem', margin: '0px 20px 0px 20px'
                                }}><AlertOutlined/> Emergency Details</span>} key="5">

                                    <Card style={{ marginTop: '8px' }}>
                                        <div style={{ padding: '8px' }}>
                                            <Form onFinish={handleAddEmergencyDetails} form={userEmergencyDetailsForm} layout={"vertical"}>
                                                <Row gutter={16}>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="relationshipTypeRefId" label="Relationship Type" rules={[{ required: true }]}>
                                                            <Select options={relationshipTypesLov}
                                                                  />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col lg={6} xs={24}>
                                                        <Form.Item name="contactDetail" label="Contact Detail" rules={[{ required: true }]}>
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>

                                                </Row>
                                                <Row gutter={16}>
                                                    <Col lg={24} xs={24}>
                                                        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <div style={{ display: 'flex', justifyContent: 'end', float: 'right' }}>
                                                    <Button
                                                        type="default"
                                                        onClick={handleEmergencyDetailsFormClear}
                                                        style={{
                                                            marginRight: '8px',
                                                            backgroundColor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                            color: isDarkMode ? 'var(--cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                            border: '1px solid var(--cancel-btn-color-light)'
                                                        }}>
                                                        <span style={{ fontWeight: '700', minWidth: 60 }}>Reset</span>
                                                    </Button>

                                                    <Button
                                                        type="default"
                                                        onClick={userEmergencyDetailsForm.submit}
                                                        style={{
                                                            backgroundColor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                            color: isDarkMode ? 'var(--cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                                            border: '1px solid var(--cancel-btn-color-light)'
                                                        }}>
                                                        <span style={{ fontWeight: '700' }}><PlusOutlined /> {editingEmergencyDetails ? "Update Record" : "Add Record"}</span>
                                                    </Button>
                                                </div>
                                            </Form>

                                            <Row gutter={[32, 12]} style={{ marginTop: '32px' }}>
                                                {emergencyDetails.filter(emgDetail => !emgDetail.isDeleted).map((emgDetail, index) => (
                                                    <Col lg={6} xs={24} key={index} style={{ marginTop: '20px' }}>
                                                        <Card
                                                            headStyle={{backgroundColor: isEmergencyDetailsSelected(emgDetail) && '#1890ff91'}}
                                                            title={<div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                                                                {emgDetail.name}
                                                            </div>}
                                                            actions={[
                                                                <EditOutlined key="edit" onClick={() => handleEditEmergencyDetails(emgDetail)} />,
                                                                <DeleteOutlined key="delete" onClick={() => handleDeleteEmergencyDetails(emgDetail,emgDetail.key ? 'key' : 'id')} />
                                                            ]}
                                                        >
                                                            <Row style={{ marginBottom: '8px' }}>
                                                                <Col xs={14} lg={7}>
                                                                    <p><span>Relationship</span></p>
                                                                </Col>
                                                                <Col xs={1} lg={1}>
                                                                    <p><span>:</span></p>
                                                                </Col>
                                                                <Col xs={9} lg={16}>
                                                                    <p><span style={{ fontWeight: '500' }}>{emgDetail.relationshipTypeRefValue}</span></p>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ marginBottom: '8px' }}>
                                                                <Col xs={14} lg={7}>
                                                                    <p><span>Contact Detail</span></p>
                                                                </Col>
                                                                <Col xs={1} lg={1}>
                                                                    <p><span>:</span></p>
                                                                </Col>
                                                                <Col xs={9} lg={16}>
                                                                    <p><span style={{ fontWeight: '500' }}>{emgDetail.contactDetail}</span></p>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ marginBottom: '8px' }}>
                                                                <Col xs={14} lg={7}>
                                                                    <p><span>Address</span></p>
                                                                </Col>
                                                                <Col xs={1} lg={1}>
                                                                    <p><span>:</span></p>
                                                                </Col>
                                                                <Col xs={9} lg={16}>
                                                                    <p><span style={{ fontWeight: '500' }}>{emgDetail.address}</span></p>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </Card>

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

export default UserProfileUpdate;
