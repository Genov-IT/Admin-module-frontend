import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    Layout,
    Row,
    Col,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Select,
    Switch, Tag
} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import axios from "axios";
import Swal from 'sweetalert2';
import moment from 'moment';
import {appURLs, webAPI} from '../../enums/urls';
import Loader from '../../component/commonComponent/Loader';
import {authService} from '../../services/AuthService';
import Notification from "../../component/Notification/CustomNotification ";
import {NotificationPlacement, NotificationType} from "../../enums/constants";
import AxiosInstance from "../../utils/AxiosInstance";
import axiosInstance from "../../utils/AxiosInstance";
import {EnumConverter} from "../../utils/EnumConverter";
import {type} from "@testing-library/user-event/dist/type";
import {NavData} from "../../component/NavigationalData/NavData";
import MenuCard from "../../component/commonComponent/Cards/MenuCard";
import CommonButton from "../../component/commonComponent/Buttons/IconButtons/CommonButton";

const {confirm: antdConfirm} = Modal;
const {Item} = Form;
const {Option} = Select;
const {Content} = Layout;

function ResourceView({isDarkMode}) {
    const {mainEntity} = useParams();
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [resources, setResource] = useState([]);
    const [refContracts, setRefContracts] = useState([]);
    const [formAttributes, setFormAttributes] = useState([]);
    const [associationList, setAssociationList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [form] = Form.useForm();
    const history = useHistory();

    function getAllReferenceResources() {
        const requestBody = {
            select: ["*"],
            from: mainEntity.split('$')[0],
            logic: [{where: "id", condition: "nequal", value: 0}],
            orderBy: ["id:DESC"],
            size: pageSize,
            page: page - 1,
            resultType: "M"
        };

        axiosInstance
            .post(`${appURLs.web}${webAPI.advanceSearch}`, requestBody)
            .then((res) => {
                if (res.status === 200) {
                    setResource(res.data.results);
                    setLoaderStatus(false);
                }
            })
            .catch((error) => {
                setLoaderStatus(false);
                Notification.error(
                    NotificationType.ERROR,
                    error?.response?.data.message,
                    NotificationPlacement.TOP_RIGHT
                );
                console.error("Error", error);
            });
    }

    function getAllReferenceContracts() {
        axiosInstance
            .get(`${appURLs.web}${webAPI.refContracts}${mainEntity.split('$')[0]}`)
            .then((res) => {
                if (res.status === 200) {
                    setRefContracts(res.data);
                    processReferenceAttributes(res.data);
                    setLoaderStatus(false);
                }
            })
            .catch((error) => {
                setLoaderStatus(false);
                Notification.error(
                    NotificationType.ERROR,
                    error?.response?.data.message,
                    NotificationPlacement.TOP_RIGHT
                );
                console.error("Error", error);
            });
    }

    function processReferenceAttributes(data) {
        if (data?.length > 0) {
            const findFirst = data.filter(f => f.httpMethod === 'POST' && f.accessUrl.endsWith('/save'))[0];
            if (findFirst) {
                const attributes = findFirst.requestDetails.requestBody;
                setFormAttributes(attributes);
            }
        }
    }

    function getResourceObject(data) {

        if (data?.length > 0) {
            const filterData = data.filter(f => f.mainEntity === mainEntity.split('$')[0]);

            const associations = filterData[0]?.associations;
            const associationList = [];
            associations.forEach(association => {
                let associationObject;
                const requestBody = {
                    select: ["*"],
                    from: association.association,
                    logic: [{where: "id", condition: "nequal", value: 0}],
                    orderBy: ["id:DESC"],
                    resultType: "M"
                };

                axiosInstance
                    .post(`${appURLs.web}${webAPI.advanceSearch}`, requestBody)
                    .then((res) => {
                        if (res.status === 200) {
                            associationObject = {
                                displayName: association.displayName,
                                data: res.data.result
                            }
                            associationList.push(associationObject)
                            setLoaderStatus(false);
                        }
                    })
                    .catch((error) => {
                        setLoaderStatus(false);
                        Notification.error(
                            NotificationType.ERROR,
                            error?.response?.data.message,
                            NotificationPlacement.TOP_RIGHT
                        );
                        console.error("Error", error);
                    });
            })
            setAssociationList(associationList);
        }
    }

    function getAllReference() {
        axiosInstance.get(`${appURLs.web}${webAPI.getAllResources}`)
            .then((res) => {
                if (res.status === 200) {
                    getResourceObject(res.data);
                    setLoaderStatus(false);
                }
            })
            .catch((error) => {
                setLoaderStatus(false);
                Notification.error(NotificationType.ERROR, error?.response?.data.message, NotificationPlacement.TOP_RIGHT);
                console.error("Error", error);
            });
    }

    useEffect(() => {
        getAllReference();
        getAllReferenceResources();
        getAllReferenceContracts();
    }, []);

    useEffect(() => {
        getAllReferenceResources();
    }, [pageSize, page]);

    function showModal(isUpdate) {
        if (isUpdate) {
            setIsUpdate(true);
        } else {
            setIsUpdate(false);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };


    function createReferenceData(values) {
        const link = `/faste/${mainEntity.split('$')[0]}/save`;
        axiosInstance
            .post(`${appURLs.web}${link}`, values)
            .then((res) => {
                if (res.status === 200) {
                    Notification.success(NotificationType.SUCCESS, "Successfully created !", NotificationPlacement.TOP_RIGHT);
                    getAllReferenceResources();
                    setLoaderStatus(false);
                }
            })
            .catch((error) => {
                setLoaderStatus(false);
                Notification.error(
                    NotificationType.ERROR,
                    error?.response?.data.message,
                    NotificationPlacement.TOP_RIGHT
                );
                console.error("Error", error);
            });

    }

    const restructureValues = (values, attributes) => {
        const result = {};

        for (const key in attributes) {
            if (typeof attributes[key] === 'object' && !Array.isArray(attributes[key])) {
                // Check if the value is a primitive and the attribute is an object with an 'id' field
                if (typeof values[key] !== 'object') {
                    result[key] = {id: values[key]};
                } else {
                    result[key] = restructureValues(values[key] || {}, attributes[key]);
                }
            } else if (typeof attributes[key] === 'object' && Array.isArray(attributes[key])) {
                result[key] = values[key] ? values[key].map(val => restructureValues(val, attributes[key][0])) : [];
            } else {
                result[key] = values[key];
            }
        }
        return result;
    };

    const restructureFormValues = (values, attributes) => {
        const result = {};

        for (const key in attributes) {
            if (typeof attributes[key] === 'object' && !Array.isArray(attributes[key])) {
                // Check if the value is an object and has an 'id' field
                if (values[key] && typeof values[key] === 'object' && 'id' in values[key]) {
                    result[key] = values[key].id;
                } else {
                    result[key] = restructureFormValues(values[key] || {}, attributes[key]);
                }
            } else if (typeof attributes[key] === 'object' && Array.isArray(attributes[key])) {
                result[key] = values[key] ? values[key].map(val => restructureFormValues(val, attributes[key][0])) : [];
            } else {
                result[key] = values[key];
            }
        }

        return result;
    };


    function updateReferenceData(structuredValues) {
        const updatedData = {
            ...structuredValues,
            id: editingId
        }
        const link = `/faste/${mainEntity.split('$')[0]}/update`;
        axiosInstance
            .put(`${appURLs.web}${link}`, updatedData)
            .then((res) => {
                if (res.status === 200) {
                    Notification.success(NotificationType.SUCCESS, "Successfully updated !", NotificationPlacement.TOP_RIGHT);
                    getAllReferenceResources();
                    setLoaderStatus(false);
                }
            })
            .catch((error) => {
                setLoaderStatus(false);
                Notification.error(
                    NotificationType.ERROR,
                    error?.response?.data.message,
                    NotificationPlacement.TOP_RIGHT
                );
                console.error("Error", error);
            });
    }

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                // Handle form submission, e.g., send the data to the server
                const structuredValues = restructureValues(values, formAttributes);
                if (isUpdate) {
                    updateReferenceData(structuredValues);
                } else {
                    createReferenceData(structuredValues);
                }
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const renderFormItems = (attributes, prefix = '') => {
        return Object.keys(attributes).map(key => {
            const name = prefix ? `${prefix}.${key}` : key;
            const association = associationList.find(a => a.displayName.toLowerCase() === key.toLowerCase());
            if (association) {
                return (
                    <Item
                        key={name}
                        name={name}
                        label={name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                        rules={[{required: true, message: `Please select ${name}!`}]}
                    >
                        <Select>
                            {association.data.map(item => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Item>
                );
            }

            if (typeof attributes[key] === 'object') {
                return renderFormItems(attributes[key], name);
            }

            if (attributes[key] === 'Boolean') {
                return (
                    <Item
                        key={name}
                        name={name}
                        label={name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                        valuePropName="checked"
                    >
                        <Switch/>
                    </Item>
                );
            }

            return (
                <Item
                    key={name}
                    name={name}
                    label={name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                    rules={[{required: true, message: `Please input ${name}!`}]}
                >
                    <Input/>
                </Item>
            );
        });
    };


    const onEditBtnClick = (record) => {

        setIsUpdate(true)
        const formValues = restructureFormValues(record, formAttributes);
        setIsEditing(true);
        setEditingId(record.id);
        form.setFieldsValue(formValues);
        showModal(true);
    };

    const onDeleteBtn = record => {
        const link = `/faste/${mainEntity.split('$')[0]}/delete/${record.id}`;
        antdConfirm({
            title: 'Are you sure?',
            content: "You won't be able to revert this!",
            okText: 'Yes, delete it!',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                setLoaderStatus(true);
                axiosInstance.delete(`${appURLs.web}${link}`)
                    .then((res) => {
                        if (res.status === 200) {
                            getAllReferenceResources()
                            setLoaderStatus(false);
                            Notification.success(NotificationType.SUCCESS, "Successfully deleted !", NotificationPlacement.TOP_RIGHT);
                            // Show success message using Ant Design notification if needed
                        } else {
                            setLoaderStatus(false);
                            Notification.error(NotificationType.ERROR, res.data.message, NotificationPlacement.TOP_RIGHT);
                        }
                    })
                    .catch((error) => {
                        Notification.error(NotificationType.ERROR, error.response.data.message, NotificationPlacement.TOP_RIGHT);
                        console.error('Error', error);
                        setLoaderStatus(false);
                        // Show error message using Ant Design notification if needed
                    });
            },
            onCancel() {
                setLoaderStatus(false);
            },
        });
    };


    function onViewBtnClick(record) {
        setIsViewModalVisible(true);
        const formValues = restructureFormValues(record, formAttributes);
        form.setFieldsValue(formValues);
    }

    function onPageChange(page, pageSize) {
        setPage(page)
        setPageSize(pageSize);
    }

    return (
        <div>
            <div style={{margin: '15px 20px', display: 'flex', justifyContent: 'space-between'}}>
                <Breadcrumb style={{margin: '10px 0 0 '}}>
                    <Breadcrumb.Item
                        className="custom-breadcrumb-item"
                        onClick={() => history.push('/reference')}>
                        Reference Management
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{mainEntity.split('$')[1]} Manage</Breadcrumb.Item>
                </Breadcrumb>

                <Button type="primary" icon={<PlusOutlined/>} onClick={() => showModal(false)}
                        className="common-save-btn common-btn-color">
                    <span style={{fontWeight: '600'}}>Add New</span>
                </Button>
            </div>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={24}>
                    <div style={{margin: '15px 20px 15px 15px'}}>
                        <Table
                            dataSource={resources}
                            scroll={{x: true}}
                            pagination={{
                                pageSizeOptions: ['1', '5', '30', '50'], // Customize the page size options
                                showSizeChanger: true, // Enable the page size selector
                                showQuickJumper: true, // Enable the page jumper input
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, // Display total number of items
                                onChange: (page, pageSize) => onPageChange(page, pageSize), // Callback when page changes
                                onShowSizeChange: (current, size) => console.log('Current:', current, 'Size:', size), // Callback when page size changes
                            }}
                            columns={
                                resources?.length > 0
                                    ? [
                                        ...Object.keys(resources[0])
                                            .filter((key) => typeof resources[0][key] !== 'object' && key !== 'id')
                                            .map((key) => {
                                                let columnConfig = {
                                                    title: key.toUpperCase(),
                                                    dataIndex: key,
                                                    key,
                                                };

                                                // Check if the attribute is boolean
                                                if (formAttributes[key] === 'Boolean') {
                                                    columnConfig.render = (text) => (
                                                        <Tag color={text ? 'green' : 'red'}>
                                                            {text ? 'Active' : 'Inactive'}
                                                        </Tag>
                                                    );
                                                }

                                                return columnConfig;
                                            }),
                                        {
                                            title: 'Action',
                                            dataIndex: '',
                                            key: 'x',
                                            width: '10%',
                                            render: (record) => (
                                                <div className={`button-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                                    <CommonButton onClick={() => onViewBtnClick(record)}
                                                                  icon={<EyeOutlined/>}
                                                                  className="view" isDarkMode={isDarkMode}/>
                                                    <CommonButton onClick={() => onEditBtnClick(record)}
                                                                  icon={<EditOutlined/>} className="edit"
                                                                  isDarkMode={isDarkMode}/>
                                                    <CommonButton onClick={() => onDeleteBtn(record)}
                                                                  icon={<DeleteOutlined/>}
                                                                  className="delete" isDarkMode={isDarkMode}/>
                                                </div>
                                            ),
                                        }
                                    ]
                                    : []
                            }

                        />
                    </div>
                </Col>
            </Row>
            <Modal
                title={`${isUpdate ? "Update" : "Add New"} ${mainEntity.split('$')[1]} Record`}
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
                okText={isUpdate ? "Update" : "Save"}
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    {renderFormItems(formAttributes)}
                </Form>
            </Modal>

            <Modal
                title={`${mainEntity.split('$')[1]} Record`}
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                cancelText="Cancel"
                footer={false}
            >
                <Form disabled={true} form={form} layout="vertical">
                    {renderFormItems(formAttributes)}
                </Form>
            </Modal>

            {loaderStatus && <Loader/>}
        </div>
    );
}

export default ResourceView;