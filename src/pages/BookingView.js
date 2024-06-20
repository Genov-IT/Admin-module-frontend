import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Avatar, Descriptions, Switch, Modal, Card, Image, Tag } from 'antd';
import { Form, Input, Select, Button, DatePicker, Upload, message as AntMessage } from 'antd';
import { PlusOutlined, SearchOutlined, SaveOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { appURLs, webAPI } from '../enums/urls';
import Notification from '../component/Notification/CustomNotification ';
import Loader from '../component/commonComponent/Loader';
import {
    NotificationPlacement,
    NotificationType,
    perTypes
} from '../enums/constants'
import { connect } from 'react-redux';
import { convertAndFormatToKolkataTime } from "../utils/DateConverter";


function BookingView(props) {

    const screenHeight = window.innerHeight;
    const [isDarkMode, setisDarkMode] = useState(false);
    const [loaderStatus, setLoaderStatus] = useState(false);
    const history = useHistory();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [bookingItemDetails, setBookingItemDetails] = useState([]);
    const [empItemDetails, setEmpItemDetails] = useState([]);

    useEffect(() => {
        // Retrieve the id from the URL parameters
        const { id } = props.match.params;
        setLoaderStatus(true);
        // Make Axios call to fetch booking details based on the id
        axios.get(appURLs.web + webAPI.viewBookingById + id)
            .then(res => {
                if (res.status === 200) {
                    setBookingDetails(res.data.data);
                    setBookingItemDetails(res.data.data.bookingItems.map(data => {
                        let itemData = data.itemData
                        itemData.assignEmpName = data?.assignEmpData?.empName;
                        return itemData
                    }));
                    console.log("list", bookingItemDetails)
                    setEmpItemDetails(res.data.data.bookingEmployees.map(data => data.itemData));
                    setLoaderStatus(false);
                    Notification.success(NotificationType.SUCCESS, res.data.message, NotificationPlacement.TOP_RIGHT);
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
    }, []);

    function getInitials(accountName) {
        // Split the account name into words
        if (accountName) {
            const words = accountName.split(' ');
            let initials = '';

            // Iterate through each word
            for (let i = 0; i < words.length; i++) {
                // Get the first character of each word and capitalize it
                initials += words[i][0].toUpperCase();
            }

            return initials;
        }
    }



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
        }
    ];

    const employeesColumns = [

        {
            title: 'Code',
            dataIndex: 'empNumber',
            key: 'empNumber',
            width: '15%',

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
        }


    ];

    return (
        <div className="content" >

            <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumb style={{ margin: '10px 0' }}>
                    <Breadcrumb.Item>Booking Management</Breadcrumb.Item>
                    <Breadcrumb.Item>View Booking</Breadcrumb.Item>
                </Breadcrumb>

                <div  >

                    <Button type="primary" icon={<SaveOutlined />} htmlType="submit" className="common-save-btn common-btn-color" style={{ marginRight: '8px', }}>
                        <span style={{ fontWeight: '600' }}>Save</span>
                    </Button>

                    <Button type="default" onClick={{}} style={{

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
                                minHeight: '180%',

                            }}
                        >

                            <Row gutter={16}>
                                <Col lg={20} xs={24}>
                                    <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle', marginRight: '8px' }} size="large">
                                        {getInitials(bookingDetails?.accountName)}
                                    </Avatar>
                                    <span style={{ verticalAlign: 'middle', fontSize: '16px', fontWeight: 500, marginLeft: '10px' }}>{bookingDetails?.accountName}</span>
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ marginTop: '15px' }}>
                                <Col lg={12} xs={24}>
                                    <Descriptions bordered column={1} style={{ width: '100%' }} size={'middle'}>
                                        <Descriptions.Item label="Email">
                                            <span style={{ color: '#1890ff' }}>example@example.com</span>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col lg={12} xs={24}>
                                    <Descriptions bordered column={1} style={{ width: '100%' }} size={'middle'}>
                                        <Descriptions.Item label="Phone">
                                            <span style={{ color: '#1890ff' }}>123-456-7890</span>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>





                        </Card >
                    </Row>

                </Col>

                <Col xs={24} lg={12}>
                    <Row >
                        <Card title={<h4>Rental Period</h4>}
                            className="booking-cotent-container"
                            style={{
                                background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                                height: '100%'
                            }}
                        >
                            <Row gutter={20} style={{ padding: '27px 0 27px 0' }}>
                                <Col lg={12} xs={24}>
                                    <Descriptions bordered column={1} style={{ width: '100%' }} size={'middle'}>
                                        <Descriptions.Item label="From">
                                            <span style={{ color: '#1890ff' }}>{convertAndFormatToKolkataTime(bookingDetails?.dateFrom)}</span>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col lg={12} xs={24}>
                                    <Descriptions bordered column={1} style={{ width: '100%' }} size={'middle'}>
                                        <Descriptions.Item label="To">
                                            <span style={{ color: '#1890ff' }}>{convertAndFormatToKolkataTime(bookingDetails?.dateTo)}</span>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>


                        </Card >
                    </Row>
                </Col>

                {/* ................................................................................................................................................. */}


            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                <Col xs={24} lg={24}>
                    <Card
                        title={<h4>Booking Information</h4>}
                        className="booking-content-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                            height: '100%',
                            minHeight: '100%'
                        }}
                    >
                        <Descriptions bordered column={{
                            xs: 1,
                            sm: 1,
                            md: 1,
                            lg: 2,
                            xl: 2,
                            xxl: 2,
                        }} style={{ width: '100%' }} size={'middle'} >
                            <Descriptions.Item label="Number" >
                                <span style={{ color: '#1890ff' }}>{bookingDetails?.bookingNumber}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Name">
                                <span style={{ color: '#1890ff' }}>{bookingDetails?.bookingName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Origin">
                                <span style={{ color: '#1890ff' }}>{bookingDetails?.origin}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Destination" >
                                <span style={{ color: '#1890ff' }}>{bookingDetails?.destination}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Distance" >
                                <span style={{ color: '#1890ff' }}>{bookingDetails?.distance}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Duration">
                                <span style={{ color: '#1890ff' }}>{bookingDetails?.duration}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Remark" span={1}>
                                <span style={{ color: '#1890ff' }}>{bookingDetails?.remark ? bookingDetails.remark : "No Remark"}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

            </Row>



            {/* ........................................................................<ROW>.............................................................................. */}


            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                <Col xs={24} lg={16}>
                    <Card
                        title={<h4>Items</h4>}
                        className="booking-cotent-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',

                        }}
                    >


                        <Table
                            columns={itemsColumns}
                            dataSource={bookingItemDetails}
                            style={{ marginTop: '-5px' }}
                            className="table-container"
                            pagination={{ pageSize: 10 }}
                            scroll={{ y: screenHeight > 900 ? "90%" : 390, x: true }}
                            expandable={{
                                expandedRowRender: record =>
                                    <Descriptions style={{marginLeft:"40px"}} >
                                        <Descriptions.Item label="Assign Employee" >
                                            <span style={{ color: '#1890ff' }}>{record?.assignEmpName}</span>
                                        </Descriptions.Item>
                                    </Descriptions>
                                ,
                                rowExpandable: record => !!record.assignEmpName,
                            }}
                        />






                    </Card>
                </Col>

                {/* ................................................................................................................................................. */}

                <Col xs={24} lg={8}>
                    <Card
                        title={<h4>Employees</h4>}
                        className="booking-cotent-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',

                        }}
                    >

                        <Table columns={employeesColumns} dataSource={empItemDetails} style={{ marginTop: '-5px' }}
                            className="table-container"
                            pagination={{
                                pageSize: 10,
                            }}
                            scroll={{
                                y: screenHeight > 900 ? "90%" : 390,
                                x: true

                            }}

                        />





                    </Card>
                </Col>
            </Row>



            {loaderStatus && <Loader />}
        </div>
    );
}

const mapStateToProps = (state) => ({
    isDarkMode: state.darkMode.darkMode,
});

export default connect(mapStateToProps)(BookingView);