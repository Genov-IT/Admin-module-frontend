import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Checkbox, Modal, theme, Tag, Switch, Image, QRCode, InputNumber } from 'antd';
import { Form, Input, Select, Button, DatePicker, Upload, message as AntMessage } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { divisions } from '../enums/constants'
import axios from "axios";
import Swal from 'sweetalert2'
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
import {
    NotificationPlacement,
    NotificationType,
    perTypes
} from '../enums/constants'
import Notification from '../component/Notification/CustomNotification ';



const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Dragger } = Upload;


function StockManage({ isDarkMode }) {

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
    const [stockItemData, setStockItemData] = useState([]);
    const [isQrDialogVisible, setQrDialogVisible] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [availability, setAvailability] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const { confirm: antdConfirm } = Modal;
    const [selectedPerType, setSelectedPerType] = useState('');


    async function updateStockData(formData) {
        setLoaderStatus(true);

        try {
            let res = await axios.put(appURLs.web + webAPI.updateStock + editRecord._id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                setLoaderStatus(false);

                Notification.success(NotificationType.SUCCESS, res.data.data.itemName + " " + res.data.message, NotificationPlacement.TOP_RIGHT);
                setQrCodeData(res.data.data);
                setEditDialogVisible(false);
                handleClear();
            }
        } catch (error) {

            setLoaderStatus(false);
            Notification.error(NotificationType.ERROR, error.response.data.message, NotificationPlacement.TOP_RIGHT);
            console.error("Error", error);
        }
    }

    const onFinish = async (values) => {
        // Handle form submission here

        console.log(values)

        const formData = new FormData();
        formData.append('itemName', values.itemName);
        formData.append('image_data', values.image_data?.file);
        formData.append('itemCode', values.itemCode);
        formData.append('price', values.price);
        formData.append('description', values.description);
        formData.append('availability', values.availability ? values.availability : false);
        formData.append('perType', values.perType);

        await updateStockData(formData)
    };

    const handleClear = () => {
        formSearch.resetFields(); // Reset form fields
        getAllStocksItem();
    };

    useEffect(() => {

        // Filter allCirculars based on selectedDivision
        const filteredList = allPrevCirculars.filter(circular => circular.division === selectedDivision);
        // Update the state with the filtered list
        setAllCirculars(filteredList);

    }, [selectedDivision]);


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


    const getAllCirculars = () => {
        let endPoint = webAPI.getAllCirculars;
        if (qmsAccessCirculars) {
            endPoint = webAPI.qmsGetAllCirculars;
        }
        setLoaderStatus(true)
        axios.get(appURLs.web + endPoint)
            .then((res) => {

                if (res.status === 200) {

                    setAllCirculars(res.data);
                    setAllPrvCirculars(res.data)
                    setLoaderStatus(false)

                }
                // setLoader(false);
            })
            .catch((error) => {
                setLoaderStatus(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Network Error',
                    showConfirmButton: false,
                    timer: 1500,
                });
                console.error("Error", error);
            });
    };

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);

        setTags(newTags);
    };


    const forMap = (tag) => {
        const tagElem = (
            <Tag
                closable
                onClose={(e) => {
                    e.preventDefault();
                    handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span
                key={tag}
                style={{
                    display: 'inline-block',
                }}
            >
                {tagElem}
            </span>
        );
    };

    const tagChild = tags.map(forMap);

    const tagPlusStyle = {
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };


    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }

        setInputVisible(false);
        setInputValue('');
    };



    const getReffrencedList = async (record) => {


        const refList = record?.refrences[0]?.split(",");


        const refrencePdfList = [];
        const promises = [];

        refList?.forEach(data => {
            setLoaderStatus(true);
            if (data !== "undefined") {
                const promise = axios.get(appURLs.web + webAPI.getFileUploadById + data)
                    .then((res) => {
                        if (res.status === 200) {
                            if (res.data.status === 404) {
                                setLoaderStatus(false);

                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'warning',
                                    title: res.data.message,
                                    showConfirmButton: false,
                                    timer: 1500,
                                });
                            } else {
                                let refOptionData = {
                                    value: res.data._id,
                                    label: res.data.sin_title
                                }
                                refrencePdfList.push(refOptionData);
                                setLoaderStatus(false);
                            }

                        }
                    })
                    .catch((error) => {
                        setLoaderStatus(false);
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Network Error',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        console.error("Error", error);
                    });

                promises.push(promise);
            }
        });

        // Wait for all promises to resolve
        try {
            await Promise.all(promises);

            // This block will be executed after all promises are resolved



            return refrencePdfList;
        } catch (error) {
            console.error("Error", error);
        }



    }

    const onQrBtn = async (record) => {
        console.log("data", record)
        setQrCodeData(record);
        setQrDialogVisible(true);
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
                            getAllStocksItem();
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
            title: 'Code',
            dataIndex: 'itemCode',
            key: 'itemCode',
            width: '7%',
            ...getColumnSearchProps('itemCode'),
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
            ...getColumnSearchProps('itemName'),
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
            ...getColumnSearchProps('perType'),
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
            ...getColumnSearchProps('price'),
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
            render: record => <div style={{ textAlign: 'center', display: 'flex', "placeContent": 'space-evenly' }}>

                <EditButton onClick={() => onEditBtn(record)} />
                <QrButton onClick={() => onQrBtn(record)} />
                <DeleteButton onClick={() => onDeleteBtn(record)} />

            </div>,
        },

    ];



    useEffect(() => {
        getAllStocksItem();
    }, [qmsAccessCirculars]);


    const onCancel = async () => {
        setUploadedImage(null)
        await modalHandleClear();
        setEditDialogVisible(false);

    };


    const onQrCancel = async () => {

        setQrDialogVisible(false);

    };


    const getAllStocksItem = () => {


        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.getallStockDetails)
            .then((res) => {
                if (res.status === 200) {
                    setStockItemData(res.data.data);
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



    const modalHandleClear = async () => {
        setRefPdfList([]);
        form.resetFields(); // Reset form fields
        setQmsAccess('')
        setEditRecord('');
        setDocumentSubLevel([]);



        try {
            // Introduce a small delay before resetting form fields
            await new Promise(resolve => setTimeout(resolve, 0));
            form.resetFields();

        } catch (error) {
            console.error('Error resetting form fields:', error);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };


    const downloadQRCode = () => {
        const canvas = document.getElementById('myqrcode')?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            const a = document.createElement('a');
            a.download = qrCodeData.itemName + '-QRCode.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const handleChange = (info) => {
        console.log("info", info)
        if (info.file.status === 'done') {
            // Get the server response and update the file list with the correct URL
            const serverResponse = info.file.response; // Make sure your server returns the image URL
            setFileList([{ ...info.file, url: serverResponse.url }]);
        }
    };

    const onPerTypesSelect = (value, option) => {

        setSelectedPerType(option.label)
    }

    useEffect(() => {

        getAllStocksItem();

    }, []);


    return (

        <div>
            <div style={{ margin: '15px 20px', display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumb style={{ margin: '10px 0 0 ' }}>
                    <Breadcrumb.Item>Stock Management</Breadcrumb.Item>
                    <Breadcrumb.Item>Stock Manage</Breadcrumb.Item>
                </Breadcrumb>

                <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/stockUpload')} className="common-save-btn common-btn-color">
                    <span style={{ fontWeight: '600' }}>Add Stock</span>
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

                        <Table columns={columns} dataSource={stockItemData} style={{ marginTop: '-5px' }}
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
            <Modal
                title="Edit Stock Data"
                visible={isEditDialogVisible}
                onCancel={onCancel}
                onOk={() => form.submit()}
                width={'75%'}
                footer={null}
            >
                <Form

                    form={form}
                    name="pdfUploadForm"
                    onFinish={onFinish}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    shouldUpdate={() => false}
                    layout='vertical'
                    initialValues={editRecord}
                >

                    <Row gutter={16}>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Item Code"
                                name="itemCode"
                                rules={[{ required: true, message: 'Please input the Item code!' }]}
                            >
                                <Input />
                            </Item>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Item Name"
                                name="itemName"
                                rules={[{ required: true, message: 'Please input the Item Name!' }]}
                            >
                                <Input />
                            </Item>
                        </Col>

                    </Row>

                    <Row gutter={16}>
                        <Col lg={12} xs={24}>
                            <Item
                                label="per"
                                name="perType"
                                rules={[{ required: true, message: 'Please select the date!' }]}
                            >
                                <Select

                                    placeholder="Search to add items"
                                    suffix={<SearchOutlined />}
                                    optionFilterProp="children"

                                    options={perTypes}
                                    onChange={(value, option) => onPerTypesSelect(value, option)}
                                />
                            </Item>
                        </Col>

                        <Col lg={12} xs={24}>
                            <Item
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: 'Please enter the price!' },
                                    { type: 'number', message: 'Please enter a valid number!' },
                                    { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject('Price cannot be negative!') },
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} addonAfter={"Per " + selectedPerType} />
                            </Item>
                        </Col>

                    </Row>

                    <Row>
                        <Col lg={24} xs={24}>
                            <Item
                                label="Remark"
                                name="description"
                            >
                                <TextArea style={{ width: '100%' }} />
                            </Item>
                        </Col>
                    </Row>


                    {editRecord?.image_data && (
                        <Image
                            src={`data:image/jpeg;base64,${editRecord?.image_data}`}
                            alt="Image"

                            style={{ width: '70px', height: '70px', objectFit: 'scale-down' }} // Adjust width and height here
                        />
                    )}
                    <Row justify="center">
                        <Col lg={24} xs={24}>
                            <Form.Item
                                name="image_data"
                                label="Item Photo"
                            >

                                <Upload
                                    className="customSizedUpload"
                                    action="/your-image-upload-api"
                                    name="image_data"
                                    listType="picture-card"
                                    accept="image/*"
                                    beforeUpload={(file) => {
                                        // Clear the previous file list and set the new one
                                        setEditRecord((prevRecord) => ({
                                            ...prevRecord,
                                            image_data: null
                                        }))
                                        console.log('Uploading image:', file);
                                        return false;
                                    }}


                                    maxCount={1}

                                >
                                    <Button
                                        icon={<UploadOutlined style={{
                                            width: '100%',
                                            color: isDarkMode ? 'var(--cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)',
                                        }} />}
                                    ></Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>



                    <Row gutter={16}>
                        <Col lg={12} xs={24}>

                            <Item
                                label="Availability"
                                name="availability"

                                style={{ display: 'inline-flex', marginTop: '10px' }}
                            >

                                <Switch
                                    checkedChildren="True"
                                    unCheckedChildren="False"
                                    style={{ marginTop: '-10px', backgroundColor: availability ? 'var( --theam-color)' : 'gray' }}
                                    checked={availability}
                                    onChange={(checked) => setAvailability(checked)}
                                />
                            </Item>

                        </Col>

                    </Row>




                    <Row style={{ marginBottom: "10px", marginTop: '-15px' }}>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="default" onClick={onCancel} style={{
                                marginRight: '8px',
                                backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                            }}>
                                <span style={{ fontWeight: '700' }}>CANCEL</span>
                            </Button>
                            <Button type="default" onClick={modalHandleClear} style={{
                                marginRight: '8px',
                                backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                            }}>
                                <span style={{ fontWeight: '700' }}>RESET</span>
                            </Button>
                            <Button type="primary" htmlType="submit" className="common-save-btn common-btn-color">
                                <span style={{ fontWeight: '600' }}>SAVE</span>
                            </Button>
                        </Col>
                    </Row>

                </Form>
            </Modal>
            <Modal
                title={["QR Code", <span key="subtitle" style={{ fontSize: '14px', color: 'gray', display: 'block' }}>{qrCodeData.itemName}<br /></span>]}
                visible={isQrDialogVisible}
                onCancel={onQrCancel}
                onOk={() => { }}
                width={'250px'}
                footer={null}
            >
                {isQrDialogVisible && (
                    <div id="myqrcode">
                        {/* Your modal content */}
                        <QRCode
                            value={'ML-' + qrCodeData._id}
                            errorLevel={'H'}
                            bgColor="#fff"
                            style={{ margin: '15px' }}
                        />
                        {isQrDialogVisible && (
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                style={{ marginTop: '10px' }}
                                onClick={() => downloadQRCode()}
                                className="common-save-btn common-btn-color"
                            >
                                <span style={{ fontWeight: '600' }}>Download QR Code</span>
                            </Button>
                        )}
                    </div>
                )}
            </Modal>
            {loaderStatus && <Loader />}
        </div>
    );
}

export default StockManage;