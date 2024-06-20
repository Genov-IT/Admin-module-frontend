import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Checkbox, Modal, theme, Tag, Switch, Image, QRCode, InputNumber } from 'antd';
import { Form, Input, Select, Button, DatePicker, Upload, message as AntMessage } from 'antd';
import { UploadOutlined, DownloadOutlined ,EyeOutlined  } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import { appURLs, webAPI } from '../enums/urls';
import Loader from '../component/commonComponent/Loader';
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';
import AccountCSS from '../component/pagesComponent/account.module.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import EditButton from '../component/commonComponent/Buttons/IconButtons/EditButton';
import deleteButton from '../component/commonComponent/Buttons/IconButtons/DeleteButton ';
import DeleteButton from "../component/commonComponent/Buttons/IconButtons/DeleteButton ";
import QrButton from "../component/commonComponent/Buttons/IconButtons/QrButton";
import CommonButton from "../component/commonComponent/Buttons/IconButtons/CommonButton";
import {
    NotificationPlacement,
    NotificationType,
    perTypes
} from '../enums/constants'
import Notification from '../component/Notification/CustomNotification ';
import { convertAndFormatToKolkataTime } from "../utils/DateConverter";


const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Dragger } = Upload;
function BookingManage(props) {
    
    const screenWidth = window.innerHeight;
    const screenHeight = window.innerHeight;
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [formSearch] = Form.useForm();

    const [loaderStatus, setLoaderStatus] = useState(false);
    const history = useHistory();
    const [allCirculars, setAllCirculars] = useState([]);
    const [allPrevCirculars, setAllPrvCirculars] = useState([]);
    const [tags, setTags] = useState(['']);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const [qmsAccess, setQmsAccess] = useState(false);
    const [documentSubLevel, setDocumentSubLevel] = useState([]);
    const [qmsAccessCirculars, setQmsAccessCirculars] = useState(false);
    const [initialDateValue, setInitialDateValue] = useState(null);
    const [refrenceOptions, setRefrenceOptions] = useState([]);
    const [refPdfList, setRefPdfList] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [isQrDialogVisible, setQrDialogVisible] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [availability, setAvailability] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const { confirm: antdConfirm } = Modal;
    const [selectedPerType, setSelectedPerType] = useState('');



    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {

        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {

        clearFilters();
        setSearchText('');
        confirm();


    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    const onQrBtn = async (record) => {
        console.log("data", record)
        setQrCodeData(record);
        setQrDialogVisible(true);
    }

    const onBookingView = async (id) => {
        history.push(`/bookinView/${id}`);
    }

    const onEditBtn = async (record) => {
        try {
            // Assuming imageData is the property containing the base64-encoded string
            const imageData = record.image_data;

            // Set the initial file object in the fileList state
            setFileList([
                {
                    uid: '-1',
                    name: 'initialImage.png',
                    status: 'done',
                    url: `data:image/png;base64,${imageData}`,
                },
            ]);

            form.setFieldsValue({ ...record });
            setEditDialogVisible(true);
            setEditRecord(record);
            setAvailability(record.availability);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const onDeleteBtn = record => {
        antdConfirm({
            title: 'Are you sure?',
            content: "You won't be able to revert this!",
            okText: 'Yes, delete it!',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                setLoaderStatus(true);
                axios.delete(appURLs.web + webAPI.deleteStockData + record._id)
                    .then((res) => {
                        if (res.status === 200) {
                            getAllBookings();
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
            },
            onCancel() {
                setLoaderStatus(false);
            },
        });
    };

    const columns = [

        {
            title: 'Booking Number',
            dataIndex: 'bookingNumber',
            key: 'bookingNumber',
            width: '7%',
            ...getColumnSearchProps('bookingNumber'),
            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{text}</span>,
        },
        {
            title: 'Account Name',
            dataIndex: 'accountName',
            key: 'accountName',
            width: '15%',
            ...getColumnSearchProps('accountName'),
            ellipsis: true,
            render: text => {
                return <span style={{ whiteSpace: 'pre-line', fontWeight: '500' }}>{text}</span>;
            },
        },

        {
            title: 'Booking Name',
            dataIndex: 'bookingName',
            key: 'bookingName',
            width: '10%',
            ...getColumnSearchProps('bookingName'),
            ellipsis: true,
          
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            ...getColumnSearchProps('status'),
            ellipsis: true,
           
        },

        {
            title: 'From',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            width: '10%',
            ellipsis: true,
            render: (text, record) => {
                const formattedDate = convertAndFormatToKolkataTime(record.dateFrom);        
                return <span>{formattedDate}</span>;
            },
          
        },
        {
            title: 'To',
            dataIndex: 'dateTo',
            key: 'dateTo',
            width: '10%',
            ellipsis: true,
            render: (text, record) => {
                const formattedDate = convertAndFormatToKolkataTime(record.dateTo);  
                return <span>{formattedDate}</span>;
            },
          
        },

        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            width: '10%',
            render: record => <div style={{ textAlign: 'center', display: 'flex', "placeContent": 'space-evenly' }}>

                <CommonButton onClick={() => onBookingView(record._id)}  icon={<EyeOutlined />} />
                <EditButton onClick={() => onEditBtn(record)} />
                <QrButton onClick={() => onQrBtn(record)} />
                <DeleteButton onClick={() => onDeleteBtn(record)} />

            </div>,
        },

    ];

    const getAllBookings = () => {


        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.getallBookingDetails)
            .then((res) => {
                if (res.status === 200) {
                    setBookingData(res.data.data);
                    setRefrenceOptions(refrenceOptions);
                    setLoaderStatus(false)

                }
                // setLoader(false);
            })
            .catch((error) => {
                setLoaderStatus(false)
                Notification.error(NotificationType.ERROR, error?.response?.data.message, NotificationPlacement.TOP_RIGHT);
                console.error("Error", error);
            });


    }

    useEffect(() => {

        getAllBookings();

    }, []);

    return (
        <div>
            <div style={{ margin: '15px 20px', display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumb style={{ margin: '10px 0 0 ' }}>
                    <Breadcrumb.Item>Booking Management</Breadcrumb.Item>
                    <Breadcrumb.Item>Booking Manage</Breadcrumb.Item>
                </Breadcrumb>

                <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/bookingUpload')} className="common-save-btn common-btn-color">
                    <span style={{ fontWeight: '600' }}>Add Booking</span>
                </Button>
            </div>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={24}>
                    <div style={{ margin: '15px 20px 15px 15px' }}>



                        {/* <Form

                            form={formSearch}
                            name="pdfUploadForm"

                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}

                            layout='vertical'
                        >



                            <Row gutter={16}>

                                <Col lg={11} xs={24}>
                                    <Item
                                        label=""
                                        name=""

                                    >

                                        <Select
                                            showSearch
                                            placeholder="Select the Division"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={divisions}
                                            onChange={value => setSelectedDivision(value)}
                                        />
                                    </Item>
                                </Col>

                                <Col lg={8} xs={24}>
                                    <Item
                                        label=""
                                        name="."
                                    >
                                        <Button type="default" onClick={handleClear} style={{
                                            marginRight: '8px',

                                            backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                            color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                                        }}>
                                            <span style={{ fontWeight: '700' }}>RESET</span>
                                        </Button>
                                    </Item>
                                </Col>

                            </Row>
                        </Form> */}

                        <Table columns={columns} dataSource={bookingData} style={{ marginTop: '-5px' }}
                            className="table-container"
                            pagination={{
                                pageSize: 10,
                            }}
                            scroll={{
                                y: screenHeight > 900 ? "90%" : 390,
                                x: true

                            }}

                        />


                    </div>

                </Col>
            </Row>
            {loaderStatus && <Loader />}
        </div>
    );
}

export default BookingManage;