import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Checkbox, Modal, Tag, Switch } from 'antd';
import { Form, Input, Select, Button, DatePicker, Upload, message as AntMessage } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
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

import {
    UserDocumentLevels,
    unites,
    UserRoles,
    DocumentLevels,
    DL1_SubLevels,
    DL2_SubLevels,
    DL3_SubLevels,
    DL4_SubLevels,
    DLALL_SubLevels
} from '../enums/constants'


const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Dragger } = Upload;

function UserManage({ isDarkMode }) {

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;


    const [Pdfform] = Form.useForm();
    const [form] = Form.useForm();
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [allPrevUsers, setAllPrevUsers] = useState([]);
    const history = useHistory();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    let [editRecord, setEditRecord] = useState(null);
    const [documentSubLevel, setDocumentSubLevel] = useState([]);
    const [qmsAccess, setQmsAccess] = useState(false);
    const [circularAccess, setCircularAccess] = useState(false);

    useEffect(() => {
        // Set the initial state when editRecord changes
        if (editRecord) {
            setQmsAccess(editRecord.qmsAccess === 'true');
            setCircularAccess(editRecord.circularsAccess === 'true');
        }
    }, [editRecord]);

    const onFinish = (values) => {
  


        setLoaderStatus(true)
        axios.put(appURLs.web + webAPI.updateUser + editRecord._id, values)
            .then((res) => {
                setLoaderStatus(false)
                if (res.status == 200) {

                    Swal.fire(
                        values.empName + ' Updated!',
                        'Employee has been Updated.',
                        'success'
                    );
                    setEditDialogVisible(false);
                    handleClear()
                }

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
    }

    useEffect(() => {

        // Filter allCirculars based on selectedDivision
        const filteredList = allPrevUsers.filter(circular => circular.division === selectedDivision);
        // Update the state with the filtered list
        setAllUsers(filteredList);

    }, [selectedDivision]);

    const onCancel = () => {

        setEditDialogVisible(false);

    };


    const onDeleteBtn = record => {


        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',

        }).then((result) => {
            if (result.isConfirmed) {
                setLoaderStatus(true)
                axios.delete(appURLs.web + webAPI.deleteUser + record._id).then((res) => {

                    if (res.status == '200') {
                        getAllUsers();
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )


                        setLoaderStatus(false)
                    }

                })


            } else {
                setLoaderStatus(false)
            }
        }).catch((error) => {
            console.error('Error', error);
            setLoaderStatus(false)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Network Error',
                showConfirmButton: false,
                timer: 1500
            })


        })

    }


    const onEditBtn = record => {


        Pdfform.setFieldsValue({ ...record });
       
        setEditRecord(record);
        setEditDialogVisible(true);
    }


    const getAllUsers = () => {
        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.getAllUsers)
            .then((res) => {
               
                if (res.status === 200) {

                    setAllUsers(res.data);
                    setAllPrevUsers(res.data)
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

    const handleReset = (clearFilters,confirm) => {
        clearFilters();
        setSearchText('');
        confirm();
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
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
                        onClick={() => clearFilters && handleReset(clearFilters,confirm)}
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

    const formatedPosition = (text) => {

        const roleObject = UserRoles.find((role) => role.value === text);
        return roleObject ? roleObject.label : text;
    };


    const formatedDocumentLevele = (text) => {

        const roleObject = DocumentLevels.find((role) => role.value === text);
        return roleObject ? roleObject.label : text;
    };


    const columns = [
        {
            title: '',
            dataIndex: 'number',
            key: 'number',
            width: '6%',
            render: (text, record, index) => index + 1 + '.',

        },
        {
            title: 'Division',
            dataIndex: 'division',
            key: 'division',
            width: '20%',
            ...getColumnSearchProps('division'),
            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{text}</span>,
        },

        {
            title: 'Employee Name',
            dataIndex: 'empName',
            key: 'empName',
            width: '20%',
            ...getColumnSearchProps('empName'),
            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{text}</span>,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            width: '20%',
            ...getColumnSearchProps('position'),
            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{formatedPosition(text)}</span>,
        },

        {
            title: 'Document Accsess Level',
            dataIndex: 'documentLevel',
            key: 'documentLevel',
            width: '20%',
            ...getColumnSearchProps('documentLevel'),
            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{formatedDocumentLevele(text)}</span>,
        },

        {
            title: 'QMS Accsess',
            dataIndex: 'qmsAccess',
            key: 'qmsAccess',
            width: '10%',

            ellipsis: true,
            render: text =>
                <span style={{ whiteSpace: 'pre-line' }}> <span>
                    <Tag color={text === 'true' ? 'green' : 'red'}>
                        {text === 'true' ? 'Granted' : 'Denied'}
                    </Tag>
                </span></span>,
        },

        {
            title: 'Circular Accsess',
            dataIndex: 'circularsAccess',
            key: 'circularsAccess',
            width: '10%',

            ellipsis: true,
            render: text =>
                <span style={{ whiteSpace: 'pre-line' }}> <span>
                    <Tag color={text === 'true' ? 'green' : 'red'}>
                        {text === 'true' ? 'Granted' : 'Denied'}
                    </Tag>
                </span></span>,
        },

        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            width: '15%',
            render: record => <div style={{ textAlign: 'center', display: 'flex', "placeContent": 'space-evenly' }}>
                <EditButton onClick={() => onEditBtn(record)} />
                <DeleteButton onClick={() => onDeleteBtn(record)} />

            </div>,
        },

    ];

    const handleClear = () => {


        form.resetFields(); // Reset form fields
        getAllUsers();
    };



    const modalHandleClear = () => {

        setEditRecord('');

        try {
            // Introduce a small delay before resetting form fields
            setTimeout(() => {
                Pdfform.resetFields();
            }, 0);
        } catch (error) {
            console.error('Error resetting form fields:', error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, [editRecord]);

    useEffect(() => {

        getAllUsers();

    }, []);

    const onDocLevelSelect = (value) => {

        setEditRecord((prevEditRecord) => ({
            ...prevEditRecord,
            subLevel: [],
        }));

        setTimeout(() => {

            Pdfform.resetFields(['subLevel']);
        }, 0);

        if (value === 'DL1') {
            setDocumentSubLevel(DL1_SubLevels);
        } else if (value === 'DL2') {
            setDocumentSubLevel(DL2_SubLevels);
        } else if (value === 'DL3') {
            setDocumentSubLevel(DL3_SubLevels);
        } else if (value === 'DL4') {
            setDocumentSubLevel(DL4_SubLevels);
        } else if (value === 'DLALL') {
            setDocumentSubLevel(DLALL_SubLevels)
        }
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '10px 0' }}>
                <Breadcrumb.Item>User Management</Breadcrumb.Item>
                <Breadcrumb.Item>User Manage</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={24}>
                    <Content
                        className="common-cotent-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                            paddingLeft: '30px', paddingRight: '30px'
                        }}
                    >
                        <Divider orientation="left" orientationMargin="0">User Manager</Divider>

                        <Form

                            form={form}
                            name="pdfUploadForm"

                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}

                            layout='vertical'
                        >

                            <Row gutter={16}>
                                <Col lg={12} xs={24}>
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
                                            options={unites}
                                            onChange={value => setSelectedDivision(value)}
                                        />
                                    </Item>
                                </Col>

                                <Col lg={12} xs={24}>
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
                        </Form>

                        <Table columns={columns} dataSource={allUsers}

                            pagination={{
                                pageSize: 10,
                            }}
                            scroll={{
                                y: screenHeight > 900 ? "90%" : 350,
                                x: true

                            }}

                            className={`${AccountCSS.customtable}`} />



                    </Content>
                </Col>
            </Row>
            <Modal
                title="Edit PDF"
                visible={isEditDialogVisible}
                onCancel={onCancel}
                onOk={() => Pdfform.submit()}
                width={'75%'}
                footer={null}
            >
                <Form
                    form={Pdfform}
                    name="pdfUploadForm"
                    onFinish={(values) => onFinish(values)}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={editRecord}
                    // Set initial values from the editRecord
                    layout="vertical"
                >
                    <Row gutter={16}>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Employee Name"
                                name="empName"
                                rules={[{ required: true, message: 'Please input the Emplyee Name!' }]}
                            >
                                <Input />
                            </Item>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Employee Number"
                                name="empNumber"

                            >
                                <Input />
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col lg={12} xs={24}>
                            <Item
                                label="User Name"
                                name="email"
                                rules={[{ required: true, message: 'Please input the User Name!' }]}
                            >
                                <Input />
                            </Item>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input the Password!' }]}

                            >
                                <Input.Password />
                            </Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" orientationMargin="0">System Accsess Details</Divider>


                    <Row gutter={16}>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Division"
                                name="division"
                                rules={[{ required: true, message: 'Please select the division!' }]}
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
                                />
                            </Item>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Role"
                                name="position"
                                rules={[{ required: true, message: 'Please select the Role!' }]}
                            >
                                <Select

                                    placeholder="Search to Select"

                                    options={UserRoles}
                                />
                            </Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Document Accsess Level"
                                name="documentLevel"
                                rules={[{ required: true, message: 'Please select the Document Accsess Level!' }]}
                            >
                                <Select

                                    placeholder="Search to Select"
                                    onChange={(value) => onDocLevelSelect(value)}

                                    options={UserDocumentLevels}
                                />
                            </Item>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Item
                                label="Sub Level"
                                name="subLevel"
                                rules={[{ required: true, message: 'Please select the Sub Level!' }]}
                            >
                                <Select

                                    placeholder="Search to Select"

                                    options={documentSubLevel}
                                />
                            </Item>
                        </Col>
                    </Row>


                    <Row gutter={16}>
                                <Col lg={12} xs={24}>
                                    <Row>

                                        <Col lg={10} xs={24}>
                                            <Item
                                                label="QMS Access"
                                                name="qmsAccess"

                                                style={{ display: 'inline-flex', marginTop: '10px' }}
                                            >
                                                <Switch checkedChildren="True" unCheckedChildren="False" style={{ marginTop: '-10px', backgroundColor: qmsAccess ? 'var( --theam-color)' : 'gray' }}
                                                    checked={qmsAccess} onChange={(checked) => setQmsAccess(checked)} />
                                            </Item>

                                        </Col>

                                        <Col lg={14} xs={24}>
                                            <Item
                                                label="Circulars Access"
                                                name="circularsAccess"

                                                style={{ display: 'inline-flex', marginTop: '10px' }}
                                            >
                                                <Switch checkedChildren="True" unCheckedChildren="False" style={{ marginTop: '-10px', backgroundColor: circularAccess ? 'var( --theam-color)' : 'gray' }}
                                                    checked={circularAccess} onChange={(checked) => setCircularAccess(checked)} />
                                            </Item>

                                        </Col>

                                    </Row>
                                </Col>
                            </Row>



                    <Row style={{ marginBottom: "10px", marginTop: '-30px' }}>
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
            {loaderStatus && <Loader />}
        </div>
    );
}

export default UserManage;