import React from 'react';
import { Button } from 'antd';
import { EditFilled } from '@ant-design/icons';

const EditButton = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <Button
                type="primary"
                icon={<EditFilled />}
                size="default"
                style={{
                    backgroundColor: '#f9f9f9',
                    color: 'var( --theam-color)',
                    border: '1px solid rgba(0, 0, 0, 0.23)'

                }}
                onClick={props.onClick}
                
            />
        </div>
    );
};

export default EditButton;
