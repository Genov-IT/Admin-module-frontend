import React, {useState} from 'react';
import {Layout, Button, Menu, Dropdown, Avatar} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BulbOutlined,
    LogoutOutlined,
    UserOutlined,
    KeyOutlined
} from '@ant-design/icons';
import {authService} from '../../services/AuthService';
import {connect} from 'react-redux';
import {enableDarkMode, disableDarkMode} from '../../redux/actions/actions';
import logoimgwording from '../../images/logo2.png';
import {useHistory} from "react-router-dom";

const {Header} = Layout;

function AppHeader({collapsed, onToggleCollapse, onToggleDarkMode, onLogOut, isDarkModeRed, onToggleDarkModes}) {

    const screenWidth = window.innerWidth;
    const [isDarkMode, setDarkMode] = useState(false);
    const route = window.location.pathname;
    const history = useHistory();

    // Toggle dark mode
    const toggleDarkMode = () => {
        isDarkModeRed ? onToggleDarkModes() : onToggleDarkModes();
        setDarkMode(!isDarkMode);
        onToggleDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    const onLogOutBtnClick = () => {
        authService.logout();
        history.push('/login');
    };

    const menu = (
        <Menu>
            <div style={{fontWeight: 'bold', color: 'black', padding: '10px'}}><UserOutlined/> {authService.getCurrentUser().preferred_username}
                {console.log("hiiiiiiii",authService.getCurrentUser())}
            </div>

            <Menu.Divider/>
            <Menu.Item key="profile" icon={<UserOutlined/>} onClick={() =>  history.push(`/userManage/update/${authService.getCurrentUser()?.staffId}`)}>
                My Profile
            </Menu.Item>
            <Menu.Item key="change_password" icon={<KeyOutlined/>}>
                Change Password
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={onLogOutBtnClick}>
                Sign Out
            </Menu.Item>
        </Menu>
    );

    return (
        <Header style={{
            textAlign: 'center',
            padding: 0,
            background: isDarkMode ? "#0e0d0d" : "#ffffff",
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)', // Add box shadow
            borderBottom: '0.5px solid #ddd', // Add a border on the right side
        }}>
            {route !== '/landing' ? (
                <>
                    <div style={{float: 'left'}}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={onToggleCollapse}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Button
                            type="text"
                            icon={<BulbOutlined/>}
                            onClick={toggleDarkMode}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <img src={logoimgwording} alt="Vector" style={{
                        width: screenWidth >= 768 ? '280px' : '250px',
                        height: '90%',
                        padding: '10px',
                        float: "left"
                    }}/>
                    <span style={{
                        fontWeight: '600',
                        display: screenWidth <= 900 && 'none',
                        fontSize: '25px',
                        color: 'var(--theam-color)'
                    }}>National Environmental Information Center</span>
                </>
            )}

            <div style={{float: 'right', display: 'flex', alignItems: 'center', padding: '15px 20px'}}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a onClick={e => e.preventDefault()} style={{display: 'flex', alignItems: 'center'}}>
                        <Avatar icon={<UserOutlined/>}/>
                    </a>
                </Dropdown>
            </div>
        </Header>
    );
}

const mapStateToProps = (state) => ({
    isDarkModeRed: state.darkMode.darkMode,
});

const mapDispatchToProps = {
    onToggleDarkModes: () => {
        return (dispatch, getState) => {
            const {darkMode} = getState().darkMode;
            dispatch(darkMode ? disableDarkMode() : enableDarkMode());
        };
    },
    // Add other dispatch functions if needed
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
