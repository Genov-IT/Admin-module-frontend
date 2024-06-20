import React, { useEffect, useRef, useState } from 'react';
import { UploadOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Divider, Row, Col, message, Empty, Space, Table, Tag, theme, Switch, InputNumber, notification, Modal, QRCode } from 'antd';
import { Form, Input, Select, Button, DatePicker, Upload, message as AntMessage } from 'antd';
import axios from "axios";
import { appURLs, webAPI } from '../enums/urls';
import Loader from '../component/commonComponent/Loader';
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';
import {
    NotificationPlacement,
    NotificationType,
    perTypes
} from '../enums/constants'
import Notification from '../component/Notification/CustomNotification ';
const { Item } = Form;
const { TextArea } = Input;
const { Header, Content } = Layout;

function StockUpload({ isDarkMode }) {
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const [loaderStatus, setLoaderStatus] = useState(false);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(false);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [selectedPerType, setSelectedPerType] = useState('');


    async function insertStockData(formData) {
        setLoaderStatus(true);

        try {
            let res = await axios.post(appURLs.web + webAPI.insertStock, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                setLoaderStatus(false);
                setLoading(false);
                Notification.success(NotificationType.SUCCESS, res.data.data.itemName + " " + res.data.message, NotificationPlacement.TOP_RIGHT);
                setQrCodeData(res.data.data);
                setEditDialogVisible(true);
                handleClear();
            }
        } catch (error) {
            setLoading(false);
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
        formData.append('image_data', values.ItemPhoto?.file);
        formData.append('itemCode', values.itemCode);
        formData.append('price', values.price);
        formData.append('description', values.description);
        formData.append('perType', values.perType);
        formData.append('availability', values.availability ? values.availability : false);
        await insertStockData(formData)

    };



    const handleClear = () => {
        setAvailability(false)
        form.resetFields(); // Reset form fields
    };





    const onCancel = () => {
        setEditDialogVisible(false);
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

    const onPerTypesSelect = (value, option) => {

        setSelectedPerType(option.label)
    }

    return (
        <div style={{ padding: '10px 30px 30px 30px ' }}>
            {contextHolder}
            <Breadcrumb style={{ margin: '10px 0 20px' }}>
                <Breadcrumb.Item>Stock</Breadcrumb.Item>
                <Breadcrumb.Item>Stock Upload</Breadcrumb.Item>
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



                        <Divider orientation="left" orientationMargin="0">Stock Upload</Divider>

                        <Form

                            form={form}
                            name="pdfUploadForm"
                            onFinish={onFinish}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            shouldUpdate={() => false}
                            layout='vertical'
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

                            {/* <Item
                                label="Photo Upload"
                                name="photoUpload"
                                valuePropName="file"
                                getValueFromEvent={normFile}
                                extra="Drag and drop your photo here or click to browse"
                                rules={[{ required: true, message: 'Please Upload a Photo!' }]}
                            >
                                <Dragger name="file" multiple={false} >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)' }} />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Support for a single photo.</p>
                                </Dragger>
                            </Item> */}

                            <Row justify="center">
                                <Col lg={24} xs={24}>
                                    <Item
                                        name="ItemPhoto"
                                        label="Item Photo"

                                    >

                                        <Upload
                                            className="customSizedUpload"
                                            action="/your-image-upload-api"
                                            name="image_data"
                                            listType="picture-card"
                                            accept="image/*"
                                            beforeUpload={(file) => {
                                                console.log('Uploading image:', file);
                                                return false;
                                            }}
                                            maxCount={1}
                                        >
                                            <Button icon={<UploadOutlined style={{
                                                width: '100%',
                                                color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'
                                            }} />}></Button>
                                        </Upload>

                                    </Item>
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






                            {/* <Item name="confirmation" valuePropName="checked" >
                                <Checkbox>All Details are Correct</Checkbox>
                            </Item> */}

                            <Row style={{ marginTop: "20px", marginBottom: '20px' }}>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <Button type="default" onClick={handleClear} style={{
                                        marginRight: '8px',
                                        backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                        color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                                    }}>
                                        <span style={{ fontWeight: '700' }}>RESET</span>
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading} className="common-save-btn common-btn-color">
                                        <span style={{ fontWeight: '600' }}>SAVE</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Content>
                    <Modal
                        title="QR Code"
                        visible={isEditDialogVisible}
                        onCancel={onCancel}
                        onOk={() => { }}
                        width={'200px'}
                        footer={null}
                    >
                        {isEditDialogVisible && (
                            <div id="myqrcode">
                                {/* Your modal content */}
                                <QRCode
                                    value={'ML-' + qrCodeData._id}
                                    errorLevel={'H'}
                                    bgColor="#fff"
                                    style={{}}
                                />
                                {isEditDialogVisible && (
                                    <Button
                                        type="primary"
                                        icon={<DownloadOutlined />}
                                        style={{ marginTop: '10px' }}
                                        onClick={() => downloadQRCode()}
                                    >
                                        Download QR Code
                                    </Button>
                                )}
                            </div>
                        )}
                    </Modal>
                </Col>
            </Row>
            {loaderStatus && <Loader />}
        </div>
    );
}

export default StockUpload;
