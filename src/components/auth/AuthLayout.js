import React from 'react'
import authImg from '../../assets/images/auth-bg.svg'
import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";

const AuthLayout = () => {
    return (
        <>
            <div className="bg-img" style={{backgroundImage: `url(${authImg})`, height: '100dvh'}}>
                <Container>
                    <Outlet />
                </Container>
            </div>
        </>
    )
}

export default AuthLayout;