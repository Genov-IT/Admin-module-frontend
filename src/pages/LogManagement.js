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
    unites,
    UserRoles,
    DocumentLevels,
    DL1_SubLevels,
    DL2_SubLevels,
    DL3_SubLevels,
    DL4_SubLevels
} from '../enums/constants'


const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Dragger } = Upload;

function LogManagement({ isDarkMode }) {

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

   
   


    const getAllLogs = () => {
        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.viewAllLogs)
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
            title: 'User Name',
            dataIndex: 'userid',
            key: 'userid',
            width: '20%',
            ...getColumnSearchProps('userid'),
            ellipsis: true,
          
        },

        {
            title: 'Log IN Time',
            dataIndex: 'loggedIn',
            key: 'loggedIn',
            width: '20%',
            ...getColumnSearchProps('loggedIn'),
            ellipsis: true,
            render: text => {
                const formattedDate = new Date(parseInt(text, 10)).toLocaleString();
                return <span style={{ whiteSpace: 'pre-line' }}>{formattedDate}</span>;
            },
            sorter: (a, b) => a.loggedIn - b.loggedIn,
        },
        {
            title: 'Log OUT Time',
            dataIndex: 'loggedOut',
            key: 'loggedOut',
            width: '20%',
            ...getColumnSearchProps('loggedOut'),
            ellipsis: true,
            render: text => {
                const formattedDate = new Date(parseInt(text, 10)).toLocaleString();
                return <span style={{ whiteSpace: 'pre-line' }}>{formattedDate}</span>;
            },
            sorter: (a, b) => a.loggedOut - b.loggedOut,
        },
        

    ];

   
    
  
    useEffect(() => {

        getAllLogs();

    }, []);

   
    return (
        <div>
            <Breadcrumb style={{ margin: '10px 0' }}>
                <Breadcrumb.Item>User Management</Breadcrumb.Item>
                <Breadcrumb.Item>Logger</Breadcrumb.Item>
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
                        <Divider orientation="left" orientationMargin="0">User Logs</Divider>

                  

                        <Table columns={columns} dataSource={allUsers}

                            pagination={{
                                pageSize: 10,
                            }}
                            scroll={{
                                y: '90%',
                                x: true

                            }}

                            className={`${AccountCSS.customtable}`} />



                    </Content>
                </Col>
            </Row>
         
            {loaderStatus && <Loader />}
        </div>
    );
}

export default LogManagement;