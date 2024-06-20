
import React, { useState } from 'react';
import logoimg from '../../images/logo.png'

import { Layout, Menu, Button, theme } from 'antd';


import SidebarMenu from './SidebarMenu ';


const { Header, Sider, Content } = Layout;

function Sidebar({ collapsed, onCollapse, isDarkMode, setSelectedDivision }) {


  const {
    token: { colorBgContainer },
  } = theme.useToken();



  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={260}
      style={{
        
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        transition: 'width 0.3s ease',
        scrollbarwidth: "thin",
        scrollbarcolor: "#ccc #fff",
        background: isDarkMode ? 'var(--content-container-bg-dark)' : '#064e47',
      }}>

      <div className="demo-logo-vertical">

        {/* Add your image here */}
        <img
          style={{ width: '-webkit-fill-available' , margin: collapsed ? '5px': '35px' }}
          src={logoimg} alt="Logo" className="logo" />
      </div>
      <SidebarMenu isDarkMode={isDarkMode} setSelectedDivision={(value) => setSelectedDivision(value)} />
    </Sider>
  );
}

export default Sidebar;