import React from 'react';
import {Button, Grid, Select} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Option } = Select;
const {useBreakpoint} = Grid;
const CustomPagination = ({
                              total,
                              totalPages,
                              pageSize,
                              current,
                              onPageChange,
                              onPageSizeChange,
                          }) => {

    const handlePrevPage = () => {
        if (current > 1) {
            onPageChange(current - 1);
        }
    };

    const handleNextPage = () => {
        if (current < totalPages) {
            onPageChange(current + 1);
        }
    };

    const handlePageSizeChange = (value) => {
        onPageSizeChange(value);
    };

    const renderPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(totalPages, current + 2);

        if (current <= 3) {
            endPage = Math.min(5, totalPages);
        } else if (current > totalPages - 3) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <div className={`button-container ${false ? 'dark-mode' : ''}`}>
                    <Button

                        key={i}
                        type={i === current ? 'primary' : 'default'}
                        onClick={() => onPageChange(i)}
                        style={{minWidth: '25px', textAlign: 'center', margin: '0 0px' , border:'none',fontWeight:'500'}}
                    >
                        {i}
                    </Button>
                </div>
            );
        }
        return pages;
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <span style={{ marginRight: '10px' ,fontWeight:'500'}}>Rows per page:</span>
                <Select value={pageSize.toString()} onChange={handlePageSizeChange} style={{ width: '60px', marginRight: '10px' }}>
                    <Option value="5">5</Option>
                    <Option value="10">10</Option>
                    <Option value="30">30</Option>
                    <Option value="50">50</Option>
                </Select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px',fontWeight:'500' }}>
                    Showing {current * pageSize - pageSize + 1} - {Math.min(current * pageSize, totalPages)} of {totalPages}
                </span>
                <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={handlePrevPage}
                    disabled={current === 1}
                    style={{ marginRight: '10px' }}
                />

                {useBreakpoint().lg && renderPageNumbers()}
                <Button
                    type="text"
                    icon={<RightOutlined />}
                    onClick={handleNextPage}
                    disabled={current === totalPages}
                />
            </div>
        </div>
    );
};

export default CustomPagination;
