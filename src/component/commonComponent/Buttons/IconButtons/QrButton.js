import React from 'react';
import { Button } from 'antd';
import { EditFilled, QrcodeOutlined } from '@ant-design/icons';

const QrButton = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
     
            <Button
                type="primary"
                icon={<QrcodeOutlined />}
                size="default"
                style={{
                    backgroundColor: '#f9f9f9',
                    color: 'black',
                    border: '1px solid rgba(0, 0, 0, 0.23)',

                }}
                onClick={props.onClick}
            />
        </div>
    );
};

export default QrButton;
