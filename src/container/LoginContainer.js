import React, { useState, useEffect } from 'react';
import Login from '../pages/Login';

function LoginContainer({ login , onLogin  }) {

    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
     
    }, [login]);

    
    useEffect(() => {
   
    }, [loginStatus]);

    return (
        <div>
            {/* <Login
                login={login}
                onLogin={onLogin}
                
                
            /> */}
        </div>
    );
}

export default LoginContainer;
