import React, {useEffect, useState} from 'react';
import {Avatar, Breadcrumb, Button, Col, Row, Select, Table, Tag} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    LeftOutlined,
    RightOutlined
} from "@ant-design/icons";
import Loader from "../../component/commonComponent/Loader";
import {convertAndFormatToKolkataTime} from "../../utils/DateConverter";
import CommonButton from "../../component/commonComponent/Buttons/IconButtons/CommonButton";
import EditButton from "../../component/commonComponent/Buttons/IconButtons/EditButton";
import QrButton from "../../component/commonComponent/Buttons/IconButtons/QrButton";
import DeleteButton from "../../component/commonComponent/Buttons/IconButtons/DeleteButton ";
import CustomPagination from "../../component/TableFooter/CustomPagination";
import {useHistory} from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import {appURLs, webAPI} from "../../enums/urls";
import Notification from "../../component/Notification/CustomNotification ";
import {NotificationPlacement, NotificationType} from "../../enums/constants";
import {EnumConverter} from "../../utils/EnumConverter";
import {MdOutlineEmail} from "react-icons/md";

const {Option} = Select;


function StaffListingPage({isDarkMode}) {

    const screenHeight = window.innerHeight;
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const history = useHistory();
    const [page, setPage] = useState(1);


    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Assuming a default page size of 10

    function onEditBtnClick(record) {
        history.push(`/userManage/update/${record.id}`)
    }

    function onEmailBtnClick(record) {
        setLoaderStatus(true);
        axiosInstance.get(`${appURLs.web}${webAPI.userVerificationEmail}${record?.id}`)
            .then((res) => {
                if (res.status === 200) {
                    Notification.success(NotificationType.SUCCESS, res.data.message, NotificationPlacement.TOP_RIGHT);
                }
            })
            .catch((error) => {
                Notification.error(NotificationType.ERROR, error.response.data.message, NotificationPlacement.TOP_RIGHT);
            })
            .finally(() => {
                setLoaderStatus(false); // Stop loading once the check is complete
            });

    }

    const columns = [
        {
            title: '',
            dataIndex: 'profilePhotoPath',
            key: 'profilePhotoPath',
            width: '5%',
            ellipsis: true,
            render: (profilePhotoPath, record) => {
                // Check if profilePhotoPath exists
                if (profilePhotoPath) {
                    return <Avatar size={40} src={profilePhotoPath}/>;
                } else {
                    // Use initials as fallback
                    const initials = EnumConverter.getInitials(`${record?.firstName} ${record?.lastName}`);
                    return (
                        <Avatar style={{backgroundColor: '#f56a00', verticalAlign: 'middle', marginRight: '8px'}}
                                size="default">
                            {initials}
                        </Avatar>
                    );
                }
            },
        },
        {
            title: 'Employee number',
            dataIndex: 'employeeNumber',
            key: 'employeeNumber',
            width: '15%',
            ellipsis: true,
            render: text => <span style={{whiteSpace: 'pre-line', fontWeight: '500'}}>{text}</span>,
        },
        {
            title: 'First name',
            dataIndex: 'firstName',
            key: 'firstName',
            width: '20%',
            ellipsis: true,
        },
        {
            title: 'Last name',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '20%',
            ellipsis: true,
        },
        {
            title: 'Designation',
            dataIndex: 'designationRefValue', // Nested access to `designation.name`
            key: 'designation.name',
            width: '20%',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '10%',
            ellipsis: true,
            render: isActive => (
                <Tag color={isActive ? 'green' : 'volcano'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            width: '15%',
            render: (record) => (
                <div className={`button-container ${isDarkMode ? 'dark-mode' : ''}`}>
                    {!record.isSystemUserVerified && <CommonButton onClick={() => onEmailBtnClick(record)}
                                   icon={<MdOutlineEmail/>}
                                   className="view" isDarkMode={isDarkMode}/>}
                    <CommonButton onClick={() => null}
                                  icon={<EyeOutlined/>}
                                  className="view" isDarkMode={isDarkMode}/>
                    <CommonButton onClick={() => null}
                                  icon={<EditOutlined/>} className="edit"
                                  isDarkMode={isDarkMode} onClick={() => onEditBtnClick(record)}/>
                    <CommonButton onClick={() => null}
                                  icon={<DeleteOutlined/>}
                                  className="delete" isDarkMode={isDarkMode}/>
                </div>
            ),
        },
    ];

    function getAllStaff() {
        const requestBody = {
            select: ["id",
                "lastName",
                "firstName",
                "employeeNumber",
                "isActive",
                "designationRefValue",
                "staffPrimaryMobileNumber",
                "staffPrimaryEmail",
                "profilePhotoPath",
                "isSystemUserVerified"
            ],
            from: "staff",
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
                    setStaffList(res.data)
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

    const expandedRowRender = (record) => {
        return (
            <div style={{margin: 0, display: 'flex', justifyContent: 'space-around'}}>
                <p>
                    <strong>
                        <MailOutlined style={{marginRight: '5px'}}/>
                        Primary Email :
                    </strong>
                    <span style={{marginLeft: '10px'}}>{record.staffPrimaryEmail}</span>
                </p>
                <p>
                    <strong>
                        <PhoneOutlined style={{marginRight: '5px'}}/>
                        Primary Mobile Number :
                    </strong>
                    <span style={{marginLeft: '10px'}}>{record.staffPrimaryMobileNumber}</span>
                </p>
            </div>
        );
    };

    useEffect(() => {
        getAllStaff();

    }, []);

    useEffect(() => {
        getAllStaff();
    }, [pageSize, page]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setPage(page);
    };

    const handlePageSizeChange = (size) => {
        setCurrentPage(1);
        setPageSize(size)
    };

    return (
        <div>
            <div style={{margin: '15px 20px', display: 'flex', justifyContent: 'space-between'}}>
                <Breadcrumb style={{margin: '10px 0 0 '}}>
                    <Breadcrumb.Item
                        className="custom-breadcrumb-item"
                        onClick={() => history.push('/user-dashboard')}>
                        User Management</Breadcrumb.Item>
                    <Breadcrumb.Item>Staff Management Listing</Breadcrumb.Item>
                </Breadcrumb>

                <Button type="primary" icon={<PlusOutlined/>} onClick={() => history.push('/bookingUpload')}
                        className="common-save-btn common-btn-color">
                    <span style={{fontWeight: '600'}}>Add Staff</span>
                </Button>
            </div>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={24}>
                    <div style={{margin: '15px 20px 15px 15px'}}>


                        <Table columns={columns} dataSource={staffList?.results} style={{marginTop: '-5px'}}
                               className="table-container"
                               scroll={{
                                   y: screenHeight > 900 ? "90%" : 390,
                                   x: true

                               }}
                               expandable={{
                                   expandedRowRender: (record) => expandedRowRender(record),
                                   rowExpandable: record => !!record.staffPrimaryEmail, // Optional: Only expandable if email exists
                               }}
                               rowKey="id" // Ensure each row has a unique key
                               footer={() => (
                                   <CustomPagination
                                       total={totalItems}
                                       totalPages={staffList.total}
                                       pageSize={pageSize}
                                       current={currentPage}
                                       onPageChange={handlePageChange}
                                       onPageSizeChange={handlePageSizeChange}
                                   />
                               )}
                               pagination={false}

                        />


                    </div>

                </Col>
            </Row>
            {loaderStatus && <Loader/>}
        </div>
    );
}

export default StaffListingPage;