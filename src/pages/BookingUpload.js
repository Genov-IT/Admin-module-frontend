import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Descriptions, Switch, Modal, Card, Image, Tag } from 'antd';
import { Form, Input, Select, Button, DatePicker, Upload, message as AntMessage } from 'antd';
import { PlusOutlined, SearchOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
    Form_Config
} from '../enums/sysParam'

import axios from "axios";
import Swal from 'sweetalert2'
import { appURLs, webAPI } from '../enums/urls';
import Loader from '../component/commonComponent/Loader';
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';
import { authService } from '../services/AuthService'
import {
    perTypes,
    divisions,

} from '../enums/constants';
import MapComponent from "../component/commonComponent/GoogleMap/MapComponent";
import { connect } from 'react-redux';
import {
    NotificationPlacement,
    NotificationType,
} from '../enums/constants'
import Notification from '../component/Notification/CustomNotification ';
import DeleteButton from "../component/commonComponent/Buttons/IconButtons/DeleteButton ";
import AccountCSS from '../component/pagesComponent/account.module.css';
const { confirm: antdConfirm } = Modal;

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Dragger } = Upload;

function BookingUpload({ isDarkMode }) {
    const screenHeight = window.innerHeight;
    const [form] = Form.useForm();
    const [loaderStatus, setLoaderStatus] = useState(false);
    const history = useHistory();
    const [user, setUser] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [documentSubLevel, setDocumentSubLevel] = useState([]);
    const [qmsAccess, setQmsAccess] = useState(false);

    const [rentalPeriod, setRentalPeriod] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [locationData, setLocationData] = useState([]);
    const [stockItemData, setStockItemData] = useState([]);
    const [stockLovData, setStockLovData] = useState([]);
    const [stockSelectedList, setStockSelectedList] = useState([]);
    const [activeExpRow, setActiveExpRow] = useState('');
    const [allEmployeeLovData, setAllEmployeeLovData] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [employeeSelectedList, setEmployeeSelectedList] = useState([]);
    const [selectedEmployeeList, setSelectedEmployeeList] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState({});


    const onAddLocation = () => {
        setModalVisible(true);
    };


    const handleRentalPeriodChange = (dates) => {
        setRentalPeriod(dates);
    };

    async function insertBookingData(formData) {
        setLoaderStatus(true);

        try {
            let res = await axios.post(appURLs.web + webAPI.insertBooking, formData);

            if (res.status === 200) {
                setLoaderStatus(false);

                Notification.success(NotificationType.SUCCESS, res.data.data.bookingName + " " + res.data.message, NotificationPlacement.TOP_RIGHT);

                handleClear();
            }
        } catch (error) {

            setLoaderStatus(false);
            Notification.error(NotificationType.ERROR, error.response.data.message, NotificationPlacement.TOP_RIGHT);
            console.error("Error", error);
        }
    }



    useEffect(() => {
        console.log("log", stockSelectedList)
        console.log("emp", employeeSelectedList)
        stockSelectedList.find(stock => {

        })

    }, [stockSelectedList]);



    const onFinish = async (values) => {


        const newStockList = stockSelectedList.map(item => ({
            itemId: item._id,
            assignedEmployee: item.assignedEmployee,
            bookngExtraInfomation: item.bookngExtraInfomation,
        }));

        const newEmployeeList = employeeSelectedList.map(item => ({
            employeeId: item._id,
            bookngExtraInfomation: item.bookngExtraInfomation,
        }));

        const formData = {
            accountId: values.accountId,
            accountName: selectedAccount.label,
            dateFrom: values.dateRange[0],
            dateTo: values.dateRange[1],
            bookingName: values.bookingName,
            origin: values.origin,
            destination: values.destination,
            distance: values.distance,
            duration: values.duration,
            remark: values.remark,
            bookingItems: newStockList,
            bookingEmployees: newEmployeeList,
            status: 'Draft'

        }


        await insertBookingData(formData)

    }

    const handleClear = () => {
        setEmployeeSelectedList([])
        setStockSelectedList([])
        setDocumentSubLevel([])
        form.resetFields(); // Reset form fields
    };




    const handleMapData = (data) => {
        setModalVisible(false)
        console.log(data)
        setLocationData(data)
        form.setFieldsValue({
            origin: data.originData,
            destination: data.destinationData,
            distance: data.distance,
            duration: data.duration
        });
    };

    const onDeleteBtn = (index) => {

        const updatedList = [...stockSelectedList];
        updatedList.splice(index, 1);
        setStockSelectedList(updatedList);
    };

    const onEmpDeleteBtn = (index, record) => {

        console.log("selselsel", stockSelectedList)
        const filteredEmpIndex = stockSelectedList.findIndex(item => item.assignedEmployee === record._id);

        if (filteredEmpIndex !== -1) {
            Notification.warning(NotificationType.WARNING, "Can't delete Employee its assigned to - " + stockSelectedList[filteredEmpIndex].itemName, NotificationPlacement.TOP_RIGHT);
            return
        }
        const updatedList = [...employeeSelectedList];
        updatedList.splice(index, 1);
        setEmployeeSelectedList(updatedList);
    };


    const employeesColumns = [

        {
            title: 'Code',
            dataIndex: 'empNumber',
            key: 'empNumber',
            width: '7%',

            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{text}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'image_data',
            key: 'image_data',
            width: '10%',
            render: (image_data) => (
                <Image
                    src={`data:image/jpeg;base64,${image_data}`}
                    alt="Image"
                    style={{ width: '50px', height: '50px', objectFit: 'scale-down' }} // Adjust width and height here
                />
            ),
        },
        {
            title: '',
            dataIndex: 'empName',
            key: 'empName',
            width: '35%',

            ellipsis: true,
            render: text => {
                return <span style={{ whiteSpace: 'pre-line', fontWeight: '500' }}>{text}</span>;
            },
        },


        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            width: '10%',
            render: (record, _, index) => (
                <div style={{ textAlign: 'center', display: 'flex', placeContent: 'space-evenly' }}>
                    <DeleteButton onClick={() => onEmpDeleteBtn(index, record)} />
                </div>
            ),
        }


    ];



    const itemsColumns = [

        {
            title: 'Code',
            dataIndex: 'itemCode',
            key: 'itemCode',
            width: '7%',

            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{text}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'image_data',
            key: 'image_data',
            width: '10%',
            render: (image_data) => (
                <Image
                    src={`data:image/jpeg;base64,${image_data}`}
                    alt="Image"
                    style={{ width: '50px', height: '50px', objectFit: 'scale-down' }} // Adjust width and height here
                />
            ),
        },
        {
            title: '',
            dataIndex: 'itemName',
            key: 'itemName',
            width: '35%',

            ellipsis: true,
            render: text => {
                return <span style={{ whiteSpace: 'pre-line', fontWeight: '500' }}>{text}</span>;
            },
        },
        {
            title: 'Per',
            dataIndex: 'perType',
            key: 'perType',
            width: '10%',
            ellipsis: true,
            render: value => {
                const perType = perTypes.find(item => item.value === value);
                return perType ? perType.label : value;
            },
        },

        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '10%',

            ellipsis: true,
            render: (text) => (
                <span style={{ whiteSpace: 'pre-line' }}>
                    {Number(text).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'lkr',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </span>
            ),
        },

        {
            title: 'Availability',
            dataIndex: 'availability',
            key: 'availability',
            width: '10%',

            ellipsis: true,
            render: text =>
                <span style={{ whiteSpace: 'pre-line' }}> <span>
                    <Tag color={text ? 'green' : 'red'}>
                        {text ? 'Granted' : 'Denied'}
                    </Tag>
                </span></span>,
        },

        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            width: '10%',
            render: (record, _, index) => (
                <div style={{ textAlign: 'center', display: 'flex', placeContent: 'space-evenly' }}>
                    <DeleteButton onClick={() => onDeleteBtn(index)} />
                </div>
            ),
        }


    ];

    const onEmployeeSelectInSock = (data, option, record) => {
        form.resetFields(['employee'])

        if (employeeSelectedList.some(item => item._id === data)) {
            // If already present, show an alert and return
            // antdConfirm({
            //     title: 'Employee Already Selected',
            //     content: 'This Employee has already been added to the selected list. Do you want to add it again?',
            //     okText: 'Ok',
            //     okType: 'primary',
            //     cancelText: 'No',
            //     onOk() {
            //         // setStockSelectedList(prevList => [...prevList, stockSelectedItem]);
            //     },
            //     onCancel() {

            //     },
            // });
            return;
        }

        console.log("rec", record)
        console.log("sel", employeeSelectedList)

    }

    const onEmployeeSelect = (data) => {
        form.resetFields(['employee'])
        let empSelectedItem = allEmployees.find(emp => emp._id === data);
        if (employeeSelectedList.some(item => item._id === data)) {
            // If already present, show an alert and return
            antdConfirm({
                title: 'Employee Already Selected',
                content: 'This Employee has already been added to the selected list. Do you want to add it again?',
                okText: 'Ok',
                okType: 'primary',
                cancelText: 'No',
                onOk() {
                    // setStockSelectedList(prevList => [...prevList, stockSelectedItem]);
                },
                onCancel() {

                },
            });
            return;
        }

        console.log("sel", employeeSelectedList)
        setEmployeeSelectedList(prevList => [...prevList, empSelectedItem]);
    }


    const onStockSelect = (data) => {
        form.resetFields(['stock'])
        let stockSelectedItem = stockItemData.find(stockData => stockData._id === data);
        if (stockSelectedList.some(item => item._id === data)) {
            // If already present, show an alert and return
            antdConfirm({
                title: 'Item Already Selected',
                content: 'This item has already been added to the selected list. Do you want to add it again?',
                okText: 'Ok',
                okType: 'primary',
                cancelText: 'No',
                onOk() {
                    // setStockSelectedList(prevList => [...prevList, stockSelectedItem]);
                },
                onCancel() {

                },
            });
            return;
        }

        console.log("sel", stockSelectedList)
        setStockSelectedList(prevList => [...prevList, stockSelectedItem]);
    }


    const onExpand = (expanded, record) => {

        let keys = expanded ? record._id : '';
        setActiveExpRow(keys);
    };

    const cerateEmployeeLovData = (emp) => {
        const lovList = emp.map(data => ({
            value: data._id,
            label: data.empNumber + " - " + data.empName
        }));

        setAllEmployeeLovData(lovList);
    }


    const getAllStocksItem = () => {
        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.getallStockDetails)
            .then((res) => {
                if (res.status === 200) {
                    setStockItemData(res.data.data);
                    setLoaderStatus(false)
                    cerateStockLovData(res.data.data)

                }
            })
            .catch((error) => {
                setLoaderStatus(false)
                Notification.error(NotificationType.ERROR, error?.response?.data.message, NotificationPlacement.TOP_RIGHT);
                console.error("Error", error);
            });
    }

    const cerateStockLovData = (stock) => {
        const lovList = stock.map(data => ({
            value: data._id,
            label: data.itemCode + " - " + data.itemName
        }));

        setStockLovData(lovList);
    }

    const getAllUsers = () => {
        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.getAllUsers)
            .then((res) => {
                console.log(res)
                if (res.status === 200) {
                    setAllEmployees(res.data);
                    cerateEmployeeLovData(res.data)
                    setLoaderStatus(false)

                }
            })
            .catch((error) => {
                setLoaderStatus(false)
                Notification.error(NotificationType.ERROR, error?.response?.data.message, NotificationPlacement.TOP_RIGHT);
                console.error("Error", error);
            });


    };

    const onItemRecordChange = (from, type, inputRecord, rowData) => {
        if (from === "item") {
            setStockSelectedList(prevStockSelectedList => {
                return prevStockSelectedList.map(stockData => {
                    if (stockData._id === rowData._id) {
                        // Clone the object to avoid mutating the state directly
                        const updatedStockItem = { ...stockData };

                        if (type === "textArea") {
                            updatedStockItem.bookngExtraInfomation = inputRecord;
                        } else if (type === "select") {
                            updatedStockItem.assignedEmployee = inputRecord;
                        }

                        return updatedStockItem;
                    }
                    return stockData;
                });
            });
        } else if (from === "emp") {
            setEmployeeSelectedList(prevEmpSelectedList => {
                return prevEmpSelectedList.map(empData => {
                    if (empData._id === rowData._id) {
                        // Clone the object to avoid mutating the state directly
                        const updatedmpItem = { ...empData };

                        if (type === "textArea") {
                            updatedmpItem.bookngExtraInfomation = inputRecord;
                        }

                        return updatedmpItem;
                    }
                    return empData;
                });
            });
        }

        console.log(inputRecord, rowData);
    };

    useEffect(() => {
        const lovList = employeeSelectedList.map(data => ({
            value: data._id,
            label: data.empNumber + " - " + data.empName
        }));

        setSelectedEmployeeList(lovList);
    }, [employeeSelectedList]);

    useEffect(() => {
        getAllUsers();
        getAllStocksItem();
    }, []);


    return (
        <div className="content" >
            <Form

                form={form}
                name="pdfUploadForm"
                onFinish={(values) => onFinish(values)}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                size={Form_Config.SIZE}
                layout='vertical'

            >
                <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <Breadcrumb style={{ margin: '10px 0' }}>
                        <Breadcrumb.Item>Booking Management</Breadcrumb.Item>
                        <Breadcrumb.Item>Add Booking</Breadcrumb.Item>
                    </Breadcrumb>

                    <div  >

                        <Button type="primary" icon={<SaveOutlined />} htmlType="submit" className="common-save-btn common-btn-color" style={{ marginRight: '8px', }}>
                            <span style={{ fontWeight: '600' }}>Save</span>
                        </Button>

                        <Button type="default" onClick={handleClear} style={{

                            backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                            color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                        }}>
                            <span style={{ fontWeight: '600' }}>Reset</span>
                        </Button>


                    </div>

                </div>


                <Row gutter={[20, 20]}>

                    <Col xs={24} lg={12}>
                        {/*................................. Account related code........................................ */}
                        <Row >
                            <Card title={<h4>Account</h4>}
                                className="booking-cotent-container"
                                style={{
                                    background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                                    minHeight: '200%',

                                }}
                            >

                                <Row gutter={16} style={{ marginTop: '33px' }}>
                                    <Col lg={20} xs={24}>
                                        <Item

                                            name="accountId"
                                            rules={[{ required: true, message: 'Please Select Account!' }]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                options={divisions}
                                                onChange={(value, option) => setSelectedAccount(option)}
                                            />
                                        </Item>
                                    </Col>

                                    <Col span={4} style={{ textAlign: 'right' }}>

                                        <Button icon={<PlusOutlined />} type="primary" htmlType="submit" className="common-save-btn common-btn-color">
                                            <span style={{ fontWeight: '500' }} >New</span>
                                        </Button>

                                    </Col>

                                </Row>


                            </Card >
                        </Row>
                        {/*................................. Account related code End........................................ */}

                        {/*................................. Time Related Data........................................ */}



                        {/*................................. Time Related Data........................................ */}

                    </Col>

                    <Col xs={24} lg={12}>
                        <Card
                            title={<h4>Rental Period</h4>}
                            className="booking-cotent-container"
                            style={{
                                background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                                height: '96%'

                            }}
                        >


                            <Row gutter={16}>
                                <Col span={12}>
                                    <Item
                                        label={<span className="common-form-label">Start Time</span>}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Item
                                        label={<span className="common-form-label">End Time</span>}

                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '-45px' }}>
                                <Item
                                    name="dateRange"
                                    style={{ width: '100%' }}
                                    rules={[{ required: true, message: 'Please Select Date!' }]}
                                >
                                    <DatePicker.RangePicker
                                        style={{ width: '100%', marginTop: '-40px' }}
                                        showTime={{
                                            format: 'hh:mm A', // 12-hour time format with AM/PM
                                        }}
                                        format="YYYY-MM-DD hh:mm A"
                                        placeholder={['Start Time', 'End Time']}
                                        value={rentalPeriod}
                                        onChange={handleRentalPeriodChange}
                                    />
                                </Item>
                            </Row>



                        </Card>
                    </Col>

                    {/* ................................................................................................................................................. */}


                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24} lg={24}>
                        <Card
                            title={<h4>Booking Information</h4>}
                            className="booking-cotent-container"
                            style={{
                                background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',

                            }}
                        >



                            <Row gutter={16}>
                                <Col lg={24} xs={24} >
                                    <Item
                                        label={<span className="common-form-label">Booking Name</span>}
                                        name="bookingName"
                                        rules={[{ required: true, message: 'Please enter the bookking Name!' }]}
                                    >
                                        <Input />
                                    </Item>
                                </Col>

                            </Row>
                            <Row gutter={16}>
                                <Col lg={24} xs={24} >
                                    <Button icon={<PlusOutlined />} onClick={onAddLocation} className="common-dashed-btn" type="dashed">
                                        <span style={{ fontWeight: '500' }}>Add Location</span>
                                    </Button>
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ marginTop: '15px' }}>

                                <Col lg={12} xs={24} >
                                    <Item
                                        label={<span className="common-form-label">Origin</span>}
                                        name="origin"
                                        rules={[{ required: true, message: 'Please enter the origin!' }]}
                                    >
                                        <Input />
                                    </Item>

                                </Col>


                                <Col lg={12} xs={24} >
                                    <Item
                                        label={<span className="common-form-label">Destination</span>}
                                        name="destination"
                                        rules={[{ required: true, message: 'Please enter the destination!' }]}
                                    >
                                        <Input />
                                    </Item>

                                </Col>

                            </Row>

                            <Row gutter={16} >

                                <Col lg={12} xs={24} >
                                    <Item
                                        label={<span className="common-form-label">Distance</span>}
                                        name="distance"

                                    >
                                        <Input />
                                    </Item>

                                </Col>


                                <Col lg={12} xs={24} >
                                    <Item
                                        label={<span className="common-form-label">Duration</span>}
                                        name="duration"

                                    >
                                        <Input />
                                    </Item>

                                </Col>

                            </Row>
                            <Row gutter={16} >

                                <Col lg={24} xs={24} >
                                    <Item
                                        label={<span className="common-form-label">Remark</span>}
                                        name="remark"

                                    >
                                        <TextArea />
                                    </Item>

                                </Col>


                            </Row>
                        </Card>
                    </Col>
                </Row>


                {/* ........................................................................<ROW>.............................................................................. */}


                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24} lg={16}>
                        <Card
                            title={<h4>Add Items</h4>}
                            className="booking-cotent-container"
                            style={{
                                background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',

                            }}
                        >


                            <Row gutter={16}>
                                <Col lg={24} xs={24} >
                                    <Item
                                        name="stock"

                                    >
                                        <Select
                                            showSearch
                                            placeholder="Search to add items"
                                            suffix={<SearchOutlined />}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={stockLovData}
                                            onChange={(value, option) => onStockSelect(value, option)}
                                        />
                                    </Item>
                                </Col>

                            </Row>

                            <Row>
                                {stockSelectedList.length > 0 &&
                                    <Table columns={itemsColumns} dataSource={stockSelectedList} style={{ marginTop: '-5px' }}
                                        rowKey="_id"
                                        expandable={{
                                            expandedRowRender: (record) =>

                                                <Descriptions layout="vertical">

                                                    <Descriptions.Item label="Extra Information" style={{ width: '70%' }}>
                                                        <TextArea style={{ width: '120%' }} rows={1} onChange={(event) => onItemRecordChange("item", "textArea", event.target.value, record)} />
                                                    </Descriptions.Item>
                                                    <br />
                                                    <Descriptions.Item label="Assigned Employee" >
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            showSearch
                                                            placeholder="Search to add employees"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                            filterSort={(optionA, optionB) =>
                                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                            }
                                                            options={selectedEmployeeList}
                                                            onChange={(value, option) => {
                                                                onEmployeeSelectInSock(value, option, record);
                                                                onItemRecordChange("item", "select", value, record);
                                                            }}
                                                        />
                                                    </Descriptions.Item>



                                                </Descriptions>
                                            ,
                                            expandedRowKeys: [activeExpRow],
                                            onExpand: onExpand,
                                        }}

                                        pagination={{
                                            pageSize: 10,
                                        }}
                                        scroll={{
                                            y: screenHeight > 900 ? "90%" : 390,
                                            x: true

                                        }}

                                        className={`${AccountCSS.customtable}`} />}

                            </Row>




                        </Card>
                    </Col>

                    {/* ................................................................................................................................................. */}

                    <Col xs={24} lg={8}>
                        <Card
                            title={<h4>Add Employees</h4>}
                            className="booking-cotent-container"
                            style={{
                                background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',

                            }}
                        >


                            <Row gutter={16}>
                                <Col lg={24} xs={24} >
                                    <Item
                                        name="employee"

                                    >
                                        <Select
                                            showSearch
                                            placeholder="Search to add employees"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={allEmployeeLovData}
                                            onChange={(value, option) => onEmployeeSelect(value, option)}
                                        />
                                    </Item>
                                </Col>

                            </Row>

                            <Row>
                                {employeeSelectedList.length > 0 &&
                                    <Table columns={employeesColumns} dataSource={employeeSelectedList} style={{ marginTop: '-5px' }}
                                        rowKey="_id"
                                        expandable={{
                                            expandedRowRender: (record) =>

                                                <Descriptions layout="vertical">
                                                    <Descriptions.Item label="Extra Information" span={1}>
                                                        <TextArea style={{ width: '100%' }} rows={1} onChange={(event) => onItemRecordChange("emp", "textArea", event.target.value, record)} />
                                                    </Descriptions.Item>

                                                </Descriptions>
                                            ,
                                            expandedRowKeys: [activeExpRow],
                                            onExpand: onExpand,
                                        }}

                                        pagination={{
                                            pageSize: 10,
                                        }}
                                        scroll={{
                                            y: screenHeight > 900 ? "90%" : 390,
                                            x: true

                                        }}

                                        className={`${AccountCSS.customtable}`} />}

                            </Row>



                        </Card>
                    </Col>
                </Row>


            </Form>
            <Modal
                title="Add Location"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={'85%'} // Set the width of the modal

            >
                <div style={{ height: '600px' }}> {/* Set the height of the map container */}
                    <MapComponent onMapDataChange={handleMapData} />
                </div>
            </Modal>
            {loaderStatus && <Loader />}
        </div >
    );
}

const mapStateToProps = (state) => ({
    isDarkMode: state.darkMode.darkMode,
});

export default connect(mapStateToProps)(BookingUpload);