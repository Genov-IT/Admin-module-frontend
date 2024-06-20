import React from 'react';
import { Button } from 'antd';
import { DeleteFilled } from '@ant-design/icons';

const DeleteButton = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <Button
                type="primary"
                icon={<DeleteFilled />}
                size="default"
                style={{
                    backgroundColor: '#f9f9f9',
                    color: '#fd3436',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                }}
                onClick={props.onClick}
            />
               
           
        </div>
    );
};

export default DeleteButton;
