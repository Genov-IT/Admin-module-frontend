import React, {useEffect} from "react";
import {Button, Result} from "antd";

function NotFoundPage() {
    const route = window.location.pathname;

    useEffect(() => {
        if (route == "/landing") {
            window.location.pathname = "/login"
        }

    }, [])

    const goBack = () => {
        window.location.pathname = "/landing";
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist or You dont have permission."
            extra={
                <Button style={{backgroundColor: 'var(--theam-color)'}} type="primary" onClick={goBack}>
                    Go Back
                </Button>
            }
            style={{marginTop: '50px'}}
        />
    );
};

export default NotFoundPage;