import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Checkbox, Switch } from 'antd';
import { Form, Input, Select, Button, DatePicker, Upload, message as AntMessage } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
    UserDocumentLevels,
    divisions,
    unites,
    UserRoles,
    DocumentLevels,
    DL1_SubLevels,
    DL2_SubLevels,
    DL3_SubLevels,
    DL4_SubLevels,
    DLALL_SubLevels
} from '../enums/constants'

import axios from "axios";
import Swal from 'sweetalert2'
import { appURLs, webAPI } from '../enums/urls';
import Loader from '../component/commonComponent/Loader';
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Content } = Layout;
const { Dragger } = Upload;

function UserUpload({ isDarkMode }) {

    const [form] = Form.useForm();
    const [loaderStatus, setLoaderStatus] = useState(false);
    const history = useHistory();

    const [documentSubLevel, setDocumentSubLevel] = useState([]);
    const [qmsAccess, setQmsAccess] = useState(false);
    const [circularAccess, setCircularAccess] = useState(false);


    const onFinish = (values) => {

        const modifiedValues = {
            ...values,
            passwordstatus: 'false', // Replace 'your_value_here' with the actual value
        };

        setLoaderStatus(true)
        axios.post(appURLs.web + webAPI.userInsert, modifiedValues)
            .then((res) => {
                setLoaderStatus(false)
                if (res.status == 200) {

                    Swal.fire(
                        values.empName + ' Added!',
                        'Employee has been Added.',
                        'success'
                    );

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

    const handleClear = () => {
        setDocumentSubLevel([])
        form.resetFields(); // Reset form fields
    };




    const onDocLevelSelect = (value) => {

        form.resetFields(['subLevel']);

        if (value === 'DL1') {
            setDocumentSubLevel(DL1_SubLevels)
        } else if (value === 'DL2') {
            setDocumentSubLevel(DL2_SubLevels)
        } else if (value === 'DL3') {
            setDocumentSubLevel(DL3_SubLevels)
        }
        else if (value === 'DL4') {
            setDocumentSubLevel(DL4_SubLevels)
        } else if (value === 'DLALL') {
            setDocumentSubLevel(DLALL_SubLevels)
        }

    }


    return (
        <div>
            <Breadcrumb style={{ margin: '10px 0' }}>
                <Breadcrumb.Item>User Management</Breadcrumb.Item>
                <Breadcrumb.Item>Add User</Breadcrumb.Item>
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
                        <Divider orientation="left" orientationMargin="0">Basic Details</Divider>

                        <Form

                            form={form}
                            name="pdfUploadForm"
                            onFinish={(values) => onFinish(values)}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            initialValues={{
                                qmsAccess: false
                            }}
                            layout='vertical'
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
                                        <Input />
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


                            <Row style={{ marginBottom: "10px" }}>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <Button type="default" onClick={handleClear} style={{
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
                    </Content>
                </Col>
            </Row>
            {loaderStatus && <Loader />}
        </div >
    );
}

export default UserUpload;