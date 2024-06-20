import LoginContainer from '../container/LoginContainer';
import {Route, Switch} from 'react-router-dom';
import AllCirculars from '../pages/AllCirculars';


import Login from '../pages/Login';
import UserUpload from '../pages/UserUpload';
import LandingPage from '../pages/LandingPage';
import UserManage from '../pages/UserManage';
import {authService} from '../services/AuthService';
import Dashboard from '../pages/Dashboard/Dashboard';
import QmsAllCirculars from '../pages/QmsAllCirculars';
import UserProfile from '../pages/UserProfile';
import LogManagement from '../pages/LogManagement';

import {RoleEnum} from '../enums/constants'
import StockUpload from '../pages/StockUpload';
import SubDashboard from '../pages/Dashboard/SubDashboard';
import StockManage from '../pages/StockManage';
import BookingUpload from '../pages/BookingUpload';
import MapComponent from '../component/commonComponent/GoogleMap/MapComponent';
import BookingManage from '../pages/BookingManage';
import BookingView from '../pages/BookingView';
import ReferenceMain from "../pages/reference/ReferenceMain";
import ResourceView from "../pages/reference/ResourceView";
import StaffListingPage from "../pages/user/StaffListingPage";
import UserProfileUpdate from "../pages/user/UserProfileUpdate";
import UserProfileCreate from "../pages/user/UserProfileCreate";
import ForgetPasswordPage from "../pages/user/ForgetPasswordPage";

export const mainRoutes = [

    {
        path: '/dashboard',
        component: Dashboard,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
    },
    {
        path: '/stock-dashboard',
        component: SubDashboard,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
    },
    {
        path: '/user-dashboard',
        component: SubDashboard,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
    },
    {
        path: '/booking-dashboard',
        component: SubDashboard,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
    },
    {
        path: '/stockUpload',
        component: StockUpload,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
    },
    {
        path: '/stockManage',
        component: StockManage,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
    },


    {
        path: '/allCirculars',
        component: AllCirculars,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],

    },
    {
        path: '/userUpload',
        component: UserProfileCreate,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
    },
    {
        path: '/userManage',
        component: StaffListingPage,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
    },
    {
        path: '/userManage/update/:id',
        component: UserProfileUpdate,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
    },
    {
        path: '/landing',
        component: LandingPage,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
    },
    {
        path: '/logger',
        component: LogManagement,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],
    },
    {
        path: '/allQmsCirculars',
        component: QmsAllCirculars,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR],

    },
    {
        path: '/userProfile',
        component: UserProfileUpdate,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],

    },
    {
        path: '/bookingUpload',
        component: BookingUpload,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],

    },
    {
        path: '/bookinView/:id',
        component: BookingView,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],

    },
    {
        path: '/bookingManage',
        component: BookingManage,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],

    },
    {
        path: '/map',
        component: MapComponent,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],

    },
    {
        path: '/reference',
        component: ReferenceMain,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
    },
    {
        path: '/reference/view/:mainEntity',
        component: ResourceView,
        roles: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.USER],
    },

    // Add more routes if needed
];

export const currentUserRoutes = () => {

    const filterRoutesByRoles = (routes, userRoles, currentUse) => {
        console.log(userRoles)
        return routes.filter(route => {
            if (route.path === '/allQmsCirculars') {
                if (currentUse.qmsAccess === 'true') {
                    return true
                } else {
                    return false
                }


            } else if (route.path === '/allCirculars') {
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
        const filteredRoutes = filterRoutesByRoles(mainRoutes, currentUse.groups, currentUse);
        return filteredRoutes;
    } else {
        return [];
    }

}

export const authRoutes = []




