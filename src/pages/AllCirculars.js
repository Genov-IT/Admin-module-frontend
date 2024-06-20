import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loader from '../component/commonComponent/Loader';
import Swal from 'sweetalert2'
import { appURLs, webAPI } from '../enums/urls';
import { filePaths } from '../enums/constants';
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Tag } from 'antd';
import { Form, Input, Select, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import AccountCSS from '../component/pagesComponent/account.module.css';
import './AllCirculars.css';
import {
    OtherCircularsSites
} from '../enums/constants'

const { Option } = Select;
const { Item } = Form;
const { Header, Content } = Layout;
function AllCirculars({ selectedDivision, isDarkMode }) {

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [allCirculars, setAllCirculars] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchText, setSearchText] = useState('');
    const [searchDate, setsearchDate] = useState("");
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [newCircularList, setNewCircularList] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedPdfFile, setSelectedPdfFile] = useState(null);
    const [duplicateAllCirculars, setDuplicateAllCirculars] = useState([]);
    const [fileExists, setFileExists] = useState(true);

    const getAllCirculars = () => {
        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.getAllCirculars)
            .then((res) => {

                if (res.status === 200) {
                    setDuplicateAllCirculars(res.data);
                    setAllCirculars(res.data);
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

        if (selectedDivision === "All") {

            setAllCirculars(duplicateAllCirculars);

        } else {
            const currentPosts = duplicateAllCirculars
                .filter((value) => {
                    if (searchTerm === "" && selectedDivision === "" && searchDate === "") {
                        return value;
                    } else if (
                        (value.eng_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            value.division.toLowerCase().includes(selectedDivision.toLowerCase()) &&
                            value.date.includes(searchDate))

                        ||

                        (value.sin_title.toLowerCase().includes(searchTerm) &&
                            value.division.toLowerCase().includes(selectedDivision.toLowerCase()) &&
                            value.date.includes(searchDate))

                    ) {

                        return value;
                    }
                })
            let num = 0;
            const newList = currentPosts.map((post) => {
                const title = post.sin_title && post.eng_title
                    ? post.sin_title // If both Sinhala and English titles are available, use Sinhala.
                    : post.eng_title || post.sin_title; // If only one title is available, use it.
                num++
                return {
                    number: num + '.',
                    document: post.document,
                    circularName: title
                };
            });
            setAllCirculars(currentPosts)
            setNewCircularList(newList)
            setSelectedPdfFile(null)
            setSelectedRow(null)
        }


    }, [selectedDivision]);

    useEffect(() => {

        getAllCirculars();

    }, []);

    const handleReset = (clearFilters, confirm) => {

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


    const columns = [
        {
            title: '',
            dataIndex: 'number',
            key: 'number',
            width: '8%',
            render: (text, record, index) => index + 1 + '.',

        },
        {
            title: 'Division',
            dataIndex: 'division',
            key: 'division',
            width: '15%',
            ...getColumnSearchProps('division'),
            ellipsis: true
        },
        {
            title: 'Circular Date',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            ...getColumnSearchProps('date'),
            ellipsis: true,
            render: text => {
                const formattedDate = new Date(text).toLocaleDateString('en-GB'); // Adjust the locale as needed
                return <span style={{ whiteSpace: 'pre-line' }}>{formattedDate}</span>;
            },
        },

        {
            title: 'Circular Name',
            dataIndex: 'sin_title',
            key: 'sin_title',
            width: '75%',
            ...getColumnSearchProps('sin_title'),
            ellipsis: true,
            render: text => <span style={{ whiteSpace: 'pre-line' }}>{text}</span>,
        },
        {
            title: 'KeyWords',
            dataIndex: 'keywords',
            key: 'keywords',
            width: '15%',
            ...getColumnSearchProps('keywords'),
            ellipsis: true,
            render: text => (
                <div>
                    {text.split(',').map((tag, index) => (
                        index < 2 && (
                            <Tag key={index} color="green">
                                {tag.trim()}
                            </Tag>
                        )

                    ))}
                </div>
            ),
        },


    ];

    const dataSource = newCircularList;
    const handleRowClick = record => {
        setSelectedRow(record._id); // Store the selected row ID
        setSelectedPdfFile(record.document)


    };
    const rowClassName = (record) => {
        let classes = 'pointer'; // Adding 'pointer' class
        if (record._id === selectedRow) {
            classes += ' selected-row'; // Adding 'selected-row' class for the selected row
        }
        return classes;
    };



    useEffect(() => {
        const checkFileExistence = async () => {
            try {
                const response = await fetch(filePaths.FILE_SAVE_BASE_PATH + selectedPdfFile);

                const responseContentType = response.headers.get('content-type');


                // Check if the content type is PDF or HTML
                if (responseContentType.includes('application/pdf')) {
                    // It's a PDF

                    setFileExists(true);
                } else if (responseContentType.includes('text/html')) {
                    // It's HTML

                    setFileExists(false);
                } else {
                    // It's neither PDF nor HTML

                    setFileExists(false);
                }

            } catch (error) {
                console.error('Error checking file existence:', error);
                setFileExists(false);
            }
        };

        if (selectedPdfFile) {
            checkFileExistence();
        }
    }, [selectedRow]);

    const handleSelectChange = (selectedOption) => {
        console.log(selectedOption)
        if (selectedOption) {
        
          window.open(selectedOption, '_blank');
        }
      };


    return (

        <>


            <Row>
                <Col xs={12} lg={3}>
                    <Breadcrumb style={{ margin: '10px 0' }}>
                        <Breadcrumb.Item>Circulars</Breadcrumb.Item>
                        <Breadcrumb.Item>{selectedDivision ? selectedDivision : 'All'}</Breadcrumb.Item>

                    </Breadcrumb>
                </Col>
                <Col xs={12} lg={21}>
                    <Select size="small" defaultValue="Gov Circulars" style={{marginTop:"8px",width:'22%'}} options={OtherCircularsSites} onChange={handleSelectChange}/>
                      
                   

                </Col>
            </Row>







            <Row gutter={[16, 16]}>

                <Col xs={24} lg={14}>
                    <Content
                        className="common-cotent-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                        }}
                    >
                        <Divider orientation="left" orientationMargin="0">Circulars</Divider>


                        <Table
                            dataSource={allCirculars}
                            columns={columns.map(column => {
                                if (column.dataIndex === 'circularName') {
                                    return {
                                        ...column,
                                        render: text => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
                                    };
                                }
                                return column;
                            })}
                            pagination={{ pageSize: 10 }}
                            scroll={{
                                y: screenHeight > 900 ? "90%" : 350,
                                x: screenHeight > 960 ? false : true

                            }}
                            rowClassName={rowClassName}

                            onRow={(record) => ({
                                onClick: () => {
                                    handleRowClick(record);
                                }
                            })}
                            className={`${AccountCSS.customtable}`}
                        />

                    </Content>
                </Col>

                <Col xs={24} lg={10}>
                    <Content
                        className="common-cotent-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                        }}
                    >
                        <Divider orientation="left" orientationMargin="0">{selectedPdfFile ? <Button
                            type="text"
                            icon={<ExportOutlined />}
                            onClick={() => window.open(filePaths.FILE_SAVE_BASE_PATH + selectedPdfFile, '_blank')}
                        >
                            <span style={{ fontWeight: '500', fontSize: '16px' }}>Open in New Tab</span>
                        </Button> : 'Selected Pdf File'}</Divider>



                        <div className="pdf-container">
                            {selectedPdfFile && fileExists ? (
                                <iframe
                                    title="PDF Viewer"
                                    width="100%"
                                    height="90%"
                                    src={filePaths.FILE_SAVE_BASE_PATH + selectedPdfFile}
                                    allowFullScreen
                                    frameBorder="0"
                                ></iframe>
                            ) : (
                                <div style={{ padding: '80px' }}>
                                    {selectedPdfFile && <Empty />}
                                </div>
                            )}
                        </div>
                    </Content>
                </Col>


            </Row>

            {loaderStatus && <Loader />}
        </>

    );
}

export default AllCirculars;