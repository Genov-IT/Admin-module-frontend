import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loader from '../component/commonComponent/Loader';
import Swal from 'sweetalert2'
import { appURLs, webAPI } from '../enums/urls';
import { filePaths } from '../enums/constants';
import { Breadcrumb, Layout, Divider, Row, Col, Empty, Space, Table, Tag, Modal, Result, Descriptions } from 'antd';
import { Form, Input, Select, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import AccountCSS from '../component/pagesComponent/account.module.css';
import './AllCirculars.css';
import { divisions, AllSubLevels, DocumentLevels } from '../enums/constants';
import { authService } from '../services/AuthService';

const { Item } = Form;
const { Header, Content } = Layout;
function QmsAllCirculars({ isDarkMode }) {

    const defaultExpandable = {
        expandedRowRender: (record) => <p>{record.description}</p>,
    };


    const [formSearch] = Form.useForm();
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
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedSubLevel, setSelectedSubLevel] = useState('');
    const [duplicateAllCirculars, setDuplicateAllCirculars] = useState([]);
    const [filterdDivision, setFilterdDivision] = useState([]);
    const loggedUser = authService.getCurrentUser();
    const [fileExists, setFileExists] = useState(true);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedPdfFileRefrences, setSelectedPdfFileRefrences] = useState([]);
    const [refPdfList, setRefPdfList] = useState([]);

    const [selectedRowRef, setSelectedRowRef] = useState(null);
    const [selectedPdfFileRef, setSelectedPdfFileRef] = useState(null);
    const [fileExistsRef, setFileExistsRef] = useState(true);
    const [activeExpRow, setActiveExpRow] = useState('');
    const [refrenceAccsess, setRefrenceAccsess] = useState(true);
    const [selectedRowDivision, setSelectedRowDivision] = useState('All');


    const handleClear = () => {
        formSearch.resetFields(); // Reset form fields
        setSelectedDivision('')
        setSelectedSubLevel('')
        getAllCirculars();
    };


    const userPermisionValidation = (data) => {


        const permissionedList = data.filter(dataObject => {
            switch (loggedUser.documentLevel) {
                case "DL1":
                    return dataObject.documentLevel === "DL1";

                case "DL2":
                    return dataObject.documentLevel === "DL1" || dataObject.documentLevel === "DL2";

                case "DL3":
                    if (dataObject.documentLevel === "DL1" || dataObject.documentLevel === "DL2") {
                        return true;
                    } else if (dataObject.documentLevel === "DL3" && dataObject.division === loggedUser.unit) {
                        return true;
                    }
                    return false;

                case "DL4":
                    if (dataObject.documentLevel === "DL1" || dataObject.documentLevel === "DL2") {
                        return true;
                    } else if ((dataObject.documentLevel === "DL3" || dataObject.documentLevel === "DL4") && dataObject.division === loggedUser.unit) {
                        return true;
                    }
                    return false;

                case "DLALL":
                    return true;

                default:
                    return false;
            }
        });

        setAllCirculars(permissionedList);
        setDuplicateAllCirculars(permissionedList);
    };

    const getAllCirculars = () => {
        setLoaderStatus(true)
        axios.get(appURLs.web + webAPI.qmsGetAllCirculars)
            .then((res) => {

                if (res.status === 200) {

                    userPermisionValidation(res.data)
                    // setAllCirculars(res.data);
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



        const currentPosts = duplicateAllCirculars
            .filter((value) => {
                if (searchTerm === "" && selectedDivision === "" && searchDate === "") {
                    return value;
                } else if (
                    (value.eng_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        value.unite.toLowerCase().includes(selectedDivision.toLowerCase()) &&
                        value.date.includes(searchDate))

                    ||

                    (value.sin_title.toLowerCase().includes(searchTerm) &&
                        value.unite.toLowerCase().includes(selectedDivision.toLowerCase()) &&
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
        setSelectedPdfFile(null)
        setSelectedRow(null)





    }, [selectedDivision]);

    const setDivisionsByUser = () => {
        const filterdDivision = divisions?.filter(division => {
            if (loggedUser.documentLevel === 'DL3' || loggedUser.documentLevel === 'DL4') {

                return division.value === loggedUser.unit

            } else {
                return division
            }
        });

        setFilterdDivision(filterdDivision);
        setSelectedDivision(filterdDivision[0].value)
    }

    useEffect(() => {

        getAllCirculars();
        setDivisionsByUser();

    }, []);

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

    const columns = [
        {
            title: '',
            dataIndex: 'number',
            key: 'number',
            width: '8%',
            render: (text, record, index) => index + 1 + '.',

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
                    {text?.split(',').map((tag, index) => (
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

    const columns_2 = [
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
            title: 'Document Level',
            dataIndex: 'documentLevel',
            key: 'documentLevel',
            width: '10%',
            ...getColumnSearchProps('documentLevel'),
            ellipsis: true
        },
        {
            title: 'Sub Level',
            dataIndex: 'subLevel',
            key: 'subLevel',
            width: '10%',
            ...getColumnSearchProps('subLevel'),
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
                    {text?.split(',').map((tag, index) => (
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

        setSelectedRowDivision(record.division)
        setSelectedRow(record._id); // Store the selected row ID
        setSelectedPdfFile(record.document)
        setSelectedPdfFileRefrences(record.refrences)


    };
    const rowClassName = (record) => {
        let classes = 'pointer'; // Adding 'pointer' class

        if (record._id === selectedRow) {
            classes += ' selected-row'; // Adding 'selected-row' class for the selected row
        }
        return classes;
    };

    const refHandleRowClick = record => {

        setSelectedRowRef(record._id); // Store the selected row ID
        setSelectedPdfFileRef(record.document)

        getRefrenceAccsess(record);

        // window.open(filePaths.FILE_SAVE_BASE_PATH + record.document, '_blank')


    };

    const refRowClassName = (record) => {
        let classes = 'pointer'; // Adding 'pointer' class

        if (record._id === selectedRowRef) {
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




    useEffect(() => {

        const checkFileExistence = async () => {
            try {
                const response = await fetch(filePaths.FILE_SAVE_BASE_PATH + selectedPdfFileRef);

                const responseContentType = response.headers.get('content-type');


                // Check if the content type is PDF or HTML
                if (responseContentType.includes('application/pdf')) {
                    // It's a PDF

                    setFileExistsRef(true);
                } else if (responseContentType.includes('text/html')) {
                    // It's HTML

                    setFileExistsRef(false);
                } else {
                    // It's neither PDF nor HTML

                    setFileExistsRef(false);
                }

            } catch (error) {
                console.error('Error checking file existence:', error);
                setFileExistsRef(false);
            }
        };

        if (selectedPdfFileRef) {
            checkFileExistence();
        }
    }, [selectedRowRef]);

    const onCancel = () => {

        setRefrenceAccsess(true)
        setEditDialogVisible(false);

    };

    const onRefrenceClick = () => {

        setSelectedPdfFileRef();
        setSelectedRowRef();


        if (selectedPdfFileRefrences[0] !== "") {
            const refList = selectedPdfFileRefrences[0]?.split(",");
            const refrencePdfList = [];
            const promises = [];

            refList?.forEach(data => {
                if (data !== "undefined") {
                    setLoaderStatus(true);

                    const promise = axios.get(appURLs.web + webAPI.getFileUploadById + data)
                        .then((res) => {
                            if (res.status === 200) {
                                refrencePdfList.push(res.data);
                                setLoaderStatus(false);
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
            Promise.all(promises)
                .then(() => {
                    // This block will be executed after all promises are resolved
                    setRefPdfList(refrencePdfList);
                    setEditDialogVisible(true);
                })
                .catch((error) => {
                    console.error("Error", error);
                });
        }
    }

    const getRefrenceAccsess = (record) => {




        let status = false;
        switch (loggedUser.documentLevel) {
            case "DL1":
                if (record.documentLevel === "DL1") {
                    status = true;
                }
                break

            case "DL2":

                if (record.documentLevel === "DL1" || record.documentLevel === "DL2") {
                    status = true;
                }
                break

            case "DL3":
                if (record.documentLevel === "DL1" || record.documentLevel === "DL2" || (record.documentLevel === "DL3" && record.division === loggedUser.unit)) {
                    status = true;
                }
                break

            case "DL4":

                if (record.documentLevel === "DL1" || record.documentLevel === "DL2" || (record.documentLevel === "DL3" && record.division === loggedUser.unit)
                    || (record.documentLevel === "DL4" && record.division === loggedUser.unit)) {

                    status = true;
                }
                break

            case "DLALL":
                status = true;
                break


        }

        setRefrenceAccsess(status);
    }

    useEffect(() => {
        const currentPosts = duplicateAllCirculars
            .filter((value) => {
                if (value.subLevel.includes(selectedSubLevel)) {
                    return value;
                }
                return false;
            })

        setAllCirculars(currentPosts)
        setSelectedPdfFile(null)
        setSelectedRow(null)



    }, [selectedSubLevel]);

    const onExpand = (expanded, record) => {

        let keys = expanded ? record._id : '';
        setActiveExpRow(keys);
    };


    const getUserDocumentLevelLabel = (documentLevel) => {
        const foundLevel = DocumentLevels.find((level) => level.value === documentLevel);
        return foundLevel ? foundLevel.label : null;
    };

    return (

        <>
            <Breadcrumb style={{ margin: '10px 0' }}>
                <Breadcrumb.Item>QMS</Breadcrumb.Item>
                <Breadcrumb.Item>{selectedRowDivision}</Breadcrumb.Item>

            </Breadcrumb>

            <Row gutter={[16, 16]}>

                <Col xs={24} lg={14}>
                    <Content
                        className="common-cotent-container"
                        style={{
                            background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--content-container-bg-light)',
                        }}
                    >
                        <Divider orientation="left" orientationMargin="0">QMS</Divider>
                        <Form

                            form={formSearch}
                            name="pdfUploadForm"

                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}

                            layout='vertical'
                        >



                            <Row gutter={16}>

                                <Col lg={10} xs={24}>
                                    <Item
                                        label=""
                                        name="division"
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

                                <Col lg={10} xs={24}>
                                    <Item
                                        label=""
                                        name="subLevel"
                                    >

                                        <Select
                                            showSearch
                                            placeholder="Select the Document Sub Level"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={AllSubLevels}
                                            onChange={value => setSelectedSubLevel(value)}
                                        />

                                    </Item>
                                </Col>

                                <Col lg={4} xs={24}>
                                    <Item
                                        label=""
                                        name="."
                                        style={{ float: 'right', }}
                                    >
                                        <Button type="default" onClick={handleClear} style={{
                                            marginRight: '15px',

                                            backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                            color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                                        }}>
                                            <span style={{ fontWeight: '700', width: '100%' }}>RESET</span>
                                        </Button>
                                    </Item>
                                </Col>

                            </Row>
                        </Form>

                        <Table
                            rowKey="_id" // Specify the row key
                            expandable={{
                                expandedRowRender: (record) =>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                                        <Descriptions title="PDF Information" >
                                            <Descriptions.Item label="Division">{record.division}</Descriptions.Item>
                                            <Descriptions.Item label="Document Level">{getUserDocumentLevelLabel(record.documentLevel)}</Descriptions.Item>
                                            <Descriptions.Item label="Sub Level">{record.subLevel}</Descriptions.Item>
                                            <Descriptions.Item label="Name">{record.sin_title}</Descriptions.Item>


                                        </Descriptions>
                                    </div>,
                                expandedRowKeys: [activeExpRow],
                                onExpand: onExpand,
                            }}

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

                            {selectedPdfFile && fileExists && <Button
                                type="text"
                                style={{ marginTop: "10px" }}
                                icon={<ExportOutlined />}
                                onClick={() => onRefrenceClick()}
                            >
                                <span style={{ fontWeight: '500', fontSize: '16px' }}>Refrences</span>
                            </Button>}
                        </div>

                    </Content>
                </Col>


            </Row>
            <Modal
                title="Refrence PDF"
                visible={isEditDialogVisible}
                onCancel={onCancel}
                onOk={() => { }}
                width={'75%'}
                footer={null}
                bodyStyle={{ height: selectedPdfFileRef ? 850 : 280 }}

            >
                <Row >
                    <Table
                        dataSource={refPdfList && refPdfList}
                        columns={columns_2.map(column => {
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
                            y: 160,
                            x: screenHeight > 960 ? false : true

                        }}
                        rowClassName={refRowClassName}

                        onRow={(record) => ({
                            onClick: () => {
                                refHandleRowClick(record);
                            }
                        })}
                        className={`${AccountCSS.customtable}`}
                    />
                </Row>

                {refrenceAccsess ?
                    <div className="pdf-container">
                        {selectedPdfFileRef && fileExistsRef ? (
                            <iframe
                                title="PDF Viewer"
                                width="100%"
                                height="70%"
                                src={filePaths.FILE_SAVE_BASE_PATH + selectedPdfFileRef}
                                allowFullScreen
                                frameBorder="0"
                            ></iframe>
                        ) : (
                            <div style={{ padding: '80px' }}>
                                {selectedPdfFileRef && <Empty />}
                            </div>
                        )}

                        {selectedPdfFileRef && fileExistsRef && <Button
                            type="text"
                            icon={<ExportOutlined />}
                            onClick={() => window.open(filePaths.FILE_SAVE_BASE_PATH + selectedPdfFileRef, '_blank')}
                        >
                            <span style={{ fontWeight: '500', fontSize: '16px' }}>Open in New Tab</span>
                        </Button>}
                    </div>
                    :
                    <Result
                        status="403"  // Use 403 for "Forbidden" (no access) instead of 404
                        title="403"
                        subTitle="Sorry, you do not have access to this Pdf."


                    />

                }

            </Modal>

            {loaderStatus && <Loader />}
        </>

    );
}

export default QmsAllCirculars;