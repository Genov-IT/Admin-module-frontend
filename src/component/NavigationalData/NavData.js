import React from 'react';
import {
    PieChartOutlined,
    DesktopOutlined,
    GlobalOutlined,
    TeamOutlined,
    FilePdfOutlined,
    AppstoreOutlined,
    HomeOutlined,
    BankOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import {authService} from '../../services/AuthService';
import {RoleEnum} from '../../enums/constants'

const iconMapping = {
    'All Circulars': <AppstoreOutlined/>,
    'PDF Upload': <FilePdfOutlined/>,
    'PDF Manage': <FilePdfOutlined/>,
    'Add User': <TeamOutlined/>,
    'Logger': <TeamOutlined/>,
    'Home': <HomeOutlined/>,
    'Dashboard': <BankOutlined/>,
    'Booking': <CalendarOutlined/>,
    'Ref': <GlobalOutlined/>
    // Add more mappings as needed
};


export const NavData = () => {

    const navigationalDataList = [
        {
            label: 'Home',
            description: 'Home',
            key: '1',
            icon: iconMapping['Home'],
            link: '/landing',
            defLink: '/landing',
            roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
        },
        {
            label: 'Dashboard',
            defLink: '/landing',
            description: 'Dashboard',
            key: '2',
            icon: iconMapping['Dashboard'],
            link: '/dashboard',
            roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
        },


        {
            label: 'Inventory',
            defLink: '/stock-dashboard',
            description: 'Inventory Management',
            key: '5',
            icon: iconMapping['PDF Upload'],
            roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
            children: [
                {
                    label: 'Manage',
                    key: '1',
                    link: '/stockManage',
                    icon: iconMapping['PDF Manage'],
                    description: 'Inventory Manage',
                },
                {
                    label: 'Upload',
                    key: '2',
                    link: '/stockUpload',
                    defLink: '/landing',
                    icon: iconMapping['PDF Upload'],
                    description: 'Inventory Upload',
                },

            ],
        },
        {
            label: 'User',
            description: 'User Management',
            defLink: '/user-dashboard',
            key: '6',
            icon: iconMapping['Add User'],
            roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
            children: [
                {
                    label: 'Add Staff',
                    key: '1',
                    link: '/userUpload',
                    defLink: '/landing',
                    icon: iconMapping['Add User'],
                    description: 'Add Staff',
                },
                {
                    label: 'Staff Manage',
                    key: '2',
                    link: '/userManage',
                    defLink: '/landing',
                    icon: iconMapping['Add User'],
                    description: 'Staff Management',
                },
                {
                    label: 'Logger',
                    key: '3',
                    link: '/logger',
                    defLink: '/landing',
                    icon: iconMapping['Logger'],
                    description: 'Logger',
                },
            ],
        },
        {
            label: 'Booking',
            description: 'Booking Management',
            defLink: '/booking-dashboard',
            key: '7',
            icon: iconMapping['Booking'],
            roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
            children: [
                {
                    label: 'Manage',
                    key: '1',
                    link: '/bookingManage',
                    defLink: '/landing',
                    icon: iconMapping['Booking'],
                    description: 'Manage Booking',
                },
                {
                    label: 'Add',
                    key: '2',
                    link: '/bookingUpload',
                    defLink: '/landing',
                    icon: iconMapping['Booking'],
                    description: 'Add Booking',
                },


            ],
        },
        {
            label: 'User Profile',
            description: 'User Profile',
            key: '8',
            icon: iconMapping['Add User'],
            link: '/userProfile',
            defLink: '/landing',
            roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
        },
        {
            label: 'Reference',
            description: 'Reference Management',
            key: '9',
            icon: iconMapping['Ref'],
            link: '/reference',
            defLink: '/landing',
            roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
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


            } else if (route.link === '/allCirculars') {
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
        const filteredRoutes = filterRoutesByRoles(navigationalDataList, currentUse.groups, currentUse);

        return filteredRoutes;
    } else {
        return [];
    }

}