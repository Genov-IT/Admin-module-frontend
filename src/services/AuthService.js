import axios from "axios";
import {appURLs, webAPI} from '../enums/urls';
import jwt_decode from "jwt-decode";
import qs from 'qs';
import React from "react";
import NotFoundPage from "../component/notFoundPage/NotFoundPage";


function setCoockieData(jwtToken) {

    // Cookies.set('jwtToken', jwtToken, { expires: 1, secure: true, sameSite: 'Strict' });
    // // Cookies.set('jwtToken', jwtToken, { expires: 5 / (60 * 60 * 24), secure: true, sameSite: 'Strict' });
    // const jwtTokenFromCookie = Cookies.get('jwtToken');
    if(jwtToken !== ""){
        localStorage.setItem("U#T", JSON.stringify(jwtToken));
    }else {
        <NotFoundPage/>
    }


}


const insertLoggerData = (name) => {
    axios.post(appURLs.web + webAPI.insertAllLogs, {userId: name})
        .then((res) => {
            if (res.status == 200) {
                localStorage.setItem("12345", res.data);
            }
        })
        .catch((error) => {
            console.error("Error", error);

        });

}

const login = async (email, password) => {

    const data = qs.stringify({
        username: email,
        password: password
    });
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const response = await axios.post(appURLs.web + webAPI.login, data, config);
    if (response.status == 200) {
        setCoockieData(response.data?.access_token);
        //insertLoggerData(email)
    }
    return response;
};


const getCurrentUser = () => {

    const jwtToken = JSON.parse(localStorage.getItem("U#T"));

    if (jwtToken) {
        const decodedUser = jwt_decode(jwtToken);
        console.log(decodedUser);
        return decodedUser;
    } else {
        // window.location.pathname = "/login";
        return false;
    }
};


const insertLogOutData = () => {


    axios.put(appURLs.web + webAPI.updateLogs + localStorage.getItem("12345"))
        .then((res) => {

            if (res.status == 200) {
                localStorage.removeItem("U#T");

            }

        })
        .catch((error) => {
            console.error("Error", error);

        });

}

const logout = () => {

    insertLogOutData()
    localStorage.removeItem("U#T");
    localStorage.removeItem("12345");
    // Cookies.remove('jwtToken');

};

const pageValidator = () => {

    const dashboardRoute = ['/userUpload', '/stockManage', '/pdfUpload', '/Dashboard', '/home'];
    const route = window.location.pathname;
    const user = getCurrentUser();

    const isDashboardRoute = dashboardRoute.includes(route);

    if (isDashboardRoute) {
        if (user.position !== 'admin' && user.position !== 'editor') {
            window.location.pathname = "/landing";
        }

    }
};


export const authService = {
    login,
    getCurrentUser,
    logout,
    pageValidator
};