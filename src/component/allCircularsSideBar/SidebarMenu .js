import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { items } from './sidebarData';

function AllCircularsSidebar({ isDarkMode, setSelectedDivision }) {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');


  const handleOpenChange = (keys) => {
   
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };




  const onMenuClick = ({ key }) => {
    const parts = key.split('-');
  
    setSelectedKey(key)



    let selectedItem = items.find((item) => item.key === key);
    if (!selectedItem) {
      selectedItem = items.find((item,index) => {
        
        if (item.children && item.key === parts[1]) {
      
          const childItem = item.children.find((child, index) => index.toString() === parts[2]);
          return childItem !== undefined;
        }
        return false;
      });
    }


    if (selectedItem) {
      if (selectedItem.children) {
        const children = selectedItem.children;
        const selectedChildrenItem = children.find((item, index) => index.toString() === parts[2]);
        if (selectedChildrenItem) {
          setSelectedDivision(selectedChildrenItem.value);
        }
      } else {
        setSelectedDivision(selectedItem.value);
      }
    }

    if (selectedItem && !selectedItem.children) {

      setOpenKeys([]);
    }

    if (selectedItem) {
      if (selectedItem.children) {
        // Submenu item, do something if needed
      } else if (selectedItem.link) {
        // If the clicked item has a link, navigate to that link
        // You can also perform additional actions here if needed

      } else if (selectedItem.onClick) {
        // If the clicked item doesn't have a link but has an onClick method, call the onClick function
        selectedItem.onClick(selectedItem.label);
      }
    }
  };

  return (
    <Menu
      color='#064e47'
      theme="dark"
      mode="inline"
      style={{ background: isDarkMode ? 'var(--content-container-bg-dark)' : '#064e47' }}
      defaultSelectedKeys={['1']}
      selectedKeys={[selectedKey]}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      onClick={onMenuClick}
    >
      {items.map((item) =>
        item.children ? (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {item.children.map((child) => (
              <Menu.Item key={child.link} icon={child.icon}>
                {child.link ? (
                  <Link to={child.link}>{child.label}</Link>
                ) : (
                  <span onClick={() => onMenuClick({ key: child.key })}>{child.label}</span>
                )}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.link || item.key} icon={item.icon}>
            {item.link ? (
              <Link to={item.link}>{item.label}</Link>
            ) : (
              <span onClick={() => onMenuClick({ key: item.key })}>{item.label}</span>
            )}
          </Menu.Item>
        )
      )}
    </Menu>
  );
}

export default AllCircularsSidebar;
