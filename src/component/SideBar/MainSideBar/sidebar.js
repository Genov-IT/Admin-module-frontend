
import React, { useState } from 'react';
import { useEffect } from 'react';
import logoimg from '../../../images/genovIT-2.jpeg'
import { Layout, Menu, Button, theme } from 'antd';


import SidebarMenu from './SidebarMenu ';


const { Header, Sider, Content } = Layout;

function Sidebar({ collapsed, onCollapse, isDarkMode }) {


  const {
    token: { colorBgContainer },
  } = theme.useToken();

 

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={200}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        transition: 'width 0.3s ease',
        scrollbarWidth: 'thin',
        scrollbarColor: '#ccc #fff',
        background: isDarkMode ? 'var(--content-container-bg-dark)' : 'var(--side-bar-color)',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)', // Add box shadow
        borderRight: '0.5px solid #ddd', // Add a border on the right side
      }}>

      <div className="demo-logo-vertical">

        {/* Add your image here */}
        <img
          style={{ width: '-webkit-fill-available', margin: collapsed ? '5px' : '10px 20px 20px' }}
          src={logoimg} alt="Logo" className="logo" />
      </div>
      <SidebarMenu isDarkMode={isDarkMode} />
    </Sider>
  );
}

export default Sidebar;