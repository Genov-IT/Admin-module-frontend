import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    Layout,
    Divider,
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Upload,
    message as AntMessage,
    Table,
    Tabs,
    Card,
    Grid
} from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    SettingOutlined,
    LaptopOutlined,
    AlertOutlined,
    LinkOutlined, GlobalOutlined
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

const {Item} = Form;
const {Option} = Select;
const {Header, Content} = Layout;
const {Dragger} = Upload;
const {TabPane} = Tabs;
const {useBreakpoint} = Grid;


function ReferenceMain({isDarkMode}) {

    const [loaderStatus, setLoaderStatus] = useState(false);
    const [resources, setResource] = useState([]);

    function getAllReferenceResources() {
        axiosInstance.get(`${appURLs.web}${webAPI.getAllResources}`)
            .then((res) => {
                console.log(EnumConverter.resourceNameConverter(res.data))
                if (res.status === 200) {
                    setResource(EnumConverter.resourceNameConverter(res.data))
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
        getAllReferenceResources();
    }, []);

    return (
        <Layout>
            <Content style={{ padding: '50px', marginTop: '20px' }}>
                <Row gutter={[24, 24]} justify="start">
                    {resources?.map((data, index) => {
                        const mainEntityDisplayName = `${data.mainEntity}$${data.displayName}`;
                        return (
                            <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
                                <MenuCard
                                    title={data.displayName}
                                    description={data.displayName + ' Reference'}
                                    icon={<GlobalOutlined />}
                                    link={`/reference/view/${mainEntityDisplayName}`}
                                    isDarkMode={isDarkMode}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </Content>
        </Layout>

    );

}

export default ReferenceMain;