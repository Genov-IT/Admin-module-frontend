import React from 'react';
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FilePdfOutlined,
  AppstoreOutlined,
  HomeOutlined,
  BankOutlined
} from '@ant-design/icons';
import { authService } from '../services/AuthService';


const iconMapping = {
  'All Circulars': <AppstoreOutlined />,
  'PDF Upload': <FilePdfOutlined />,
  'PDF Manage': <FilePdfOutlined />,
  'Add User': <TeamOutlined />,
  'Logger': <TeamOutlined />,
  'Home': <HomeOutlined />,
  'Dashboard': <BankOutlined />
  // Add more mappings as needed
};




export const items = () => {

  const itemsData = [
    {
      label: 'Home',
      key: '1',
      icon: iconMapping['Home'],
      link: '/landing',
      roles: ['admin', 'editor','user']
    },
    {
      label: 'Dashboard',
      key: '2',
      icon: iconMapping['Dashboard'],
      link: '/dashboard',
      roles: ['admin', 'editor']
    },
    {
      label: 'Circulars',
      key: '3',
      icon: iconMapping['All Circulars'],
      link: '/allCirculars',
      roles: ['admin', 'editor','user']
    },
    {
      label: 'QMS',
      key: '4',
      icon: iconMapping['All Circulars'],
      link: '/allQmsCirculars',
      roles: ['admin', 'editor']
    },
    {
      label: 'PDF Management',
      key: '5',
      icon: iconMapping['PDF Upload'],
      roles: ['admin', 'editor'],
      children: [
        { label: 'PDF Upload', key: '1', link: '/pdfUpload', icon: iconMapping['PDF Upload'], },
        { label: 'PDF Manage', key: '2', link: '/stockManage', icon: iconMapping['PDF Manage'], },
      ],
    },
    {
      label: 'User Management',
      key: '6',
      icon: iconMapping['Add User'],
      roles: ['admin', 'editor'],
      children: [
        { label: 'Add User', key: '1', link: '/userUpload', icon: iconMapping['Add User'], },
        { label: 'User Manage', key: '2', link: '/userManage', icon: iconMapping['Add User'], },
        { label: 'Logger', key: '3', link: '/logger', icon: iconMapping['Logger'], },
      ],
    },
    {
      label: 'User Profile',
      key: '7',
      icon: iconMapping['Add User'],
      link: '/userProfile',
      roles: ['admin', 'editor','user']
    },
    // Add more menu items as needed
  ];


  const filterRoutesByRoles = (routes, userRoles, currentUse) => {

    return routes.filter(route => {
      if (route.link === '/allQmsCirculars') {
        if (currentUse.qmsAccess === 'true') {
          return true
        } else {
          return false
        }


      }else if (route.link === '/allCirculars') {
        if (currentUse.circularsAccess === 'true') {
          return true
        } else {
          return false
        }
      } else {
        if (Array.isArray(route.roles)) {
          for (const role of route.roles) {
            if (userRoles.includes(role)) {
              return true;
            }
          }
        }
        return false;
      }


    });
  };

  const currentUse = authService.getCurrentUser();
  if (currentUse) {
    const filteredRoutes = filterRoutesByRoles(itemsData, currentUse.position, currentUse);
    return filteredRoutes;
  } else {
    return [];
  }

}